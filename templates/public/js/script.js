const video = document.getElementById('videoInput')
let detected = 0;
let detectedF = [];
let count = 0;
Promise.all([
    faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
    faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
    faceapi.nets.ssdMobilenetv1.loadFromUri('/models') //heavier/accurate version of tiny face detector
]).then(start)


function start() {
    
    
    navigator.getUserMedia(
        { video:{} },
        stream => video.srcObject = stream,
        err => console.error(err)
    )
    
    //video.src = '../videos/speech.mp4'
    console.log('video added')
    recognizeFaces()
}

async function recognizeFaces() {

    const labeledDescriptors = await loadLabeledImages()
    console.log(labeledDescriptors)
    const faceMatcher = new faceapi.FaceMatcher(labeledDescriptors, 0.6)


    video.addEventListener('play', async () => {
        console.log('Playing')
        const canvas = faceapi.createCanvasFromMedia(video)
        document.body.append(canvas)

        const displaySize = { width: video.width, height: video.height }
        faceapi.matchDimensions(canvas, displaySize)

        

        setInterval(async () => {
            const detections = await faceapi.detectAllFaces(video).withFaceLandmarks().withFaceDescriptors()

            const resizedDetections = faceapi.resizeResults(detections, displaySize)

            canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height)

            const results = resizedDetections.map((d) => {
                return faceMatcher.findBestMatch(d.descriptor)
            })
            results.forEach( (result, i) => {

                console.log(result.label)
                if((!detectedF.includes(result.label)) && (result.label != 'unknown')) {

                    let hold = result.label
                    if(result.label==hold){
                        count+=1
                    }
                    else{
                        count = 0;
                    }
                    if(count>60){
                    detectedF.push(result.label)
                    count=0;}
                }
                console.log(detectedF)
                detected.innerHTML = detectedF;


                const box = resizedDetections[i].detection.box
                const drawBox = new faceapi.draw.DrawBox(box, { label: result.toString() })
                drawBox.draw(canvas)
            
            })
        }, 100)
        const detected = document.getElementById('detected');

        
    })
}

// Example POST method implementation:
async function uploadResult() {


    
   
    // fetch('http://sts-backapi.herokuapp.com/api/analytic',{
    //     method : "POST",
    //     mode: 'cors'},
    //     {body : {"testID" : "10223",
    //     "count" : 33}}
    // )
    // .then (response => response.json())
    // .then(data => console.log(data))
    // .catch(err => console.log(err))


fetch('http://sts-backapi.herokuapp.com/api/analytic', {
            mode: 'cors',
            method: "post",
            headers: {
                 "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "testID" : localStorage.getItem( 'test_id' ),
                 "count" : detectedF.length
            })
 })
    .then(alert('Uploaded!'))

}



function loadLabeledImages() {
    const labels = ['AbdulJabbar','Arslan','DrAhsanullah','DrMuhammadHussain','DrFaheemAkhtar','DrGhulamMujtaba','DrJavedShahani','DrMirMuhammad','DrQamarKhand','DrSher','DrZahidKhand']
    // const labels = [] // for WebCam
    return Promise.all(
        labels.map(async (label)=>{
            const descriptions = []
            for(let i=1; i<=2; i++) {
                const img = await faceapi.fetchImage(`../labeled_images/${label}/${i}.jpg`)
                const detections = await faceapi.detectSingleFace(img).withFaceLandmarks().withFaceDescriptor()
                console.log(label + i + JSON.stringify(detections))
                descriptions.push(detections.descriptor)
            }
            // document.body.append(label+' Faces Loaded | ')
            return new faceapi.LabeledFaceDescriptors(label, descriptions)
        })
    )
}