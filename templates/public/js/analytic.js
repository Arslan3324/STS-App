
const testID = document.getElementById("testId");
const testIDStored = localStorage.getItem('test_id');
testID.innerHTML = 'TEST ID: '+testIDStored;

const present = document.getElementById("present");

const absent = document.getElementById("absent");
const validated = document.getElementById("validated");
const rejected = document.getElementById("rejected");


//get api data
fetch(`http://sts-backapi.herokuapp.com/api/analytic/${testIDStored}`)
.then(response => response.json())
.then(data => {
    console.log(data.analytics[0].count);
    let c = 0;
    for(let i = 0; i<data.analytics.length; i++){
        c += data.analytics[i].count;
    }

    present.innerHTML = c
    absent.innerHTML = 100 - c
    //round off 

    let math =  Math.round(c/4)
    validated.innerHTML = c
    rejected.innerHTML = 0
    // console.log(data[0].count);
    // present.innerHTML = data[0].count;
}
)

