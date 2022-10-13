from sre_constants import SUCCESS
from urllib import request
from flask import Flask, render_template, Response
import cv2
import numpy as np
from pyzbar.pyzbar import decode
import simpleaudio 





app=Flask(__name__)


#POST API
# headers = {
#         'User-Agent': 'Mozilla/5.0 (Windows NT 6.3; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/54.0.2840.71 Safari/537.36'}

# r = requests.post("localhost:3002/api/analytic", headers=headers, data=json.dumps({
#      "testID": "000-000-001",
#     "testcenter": "Public School Sukkur",
#     "detected":"arslan",
#     "gender":"male",
#     "authorized":"true"
# }))


wave_obj = simpleaudio.WaveObject.from_wave_file("beepone.wav")
wave_obj1 = simpleaudio.WaveObject.from_wave_file("beeptwo.wav")
camera = cv2.VideoCapture(0)
#QR code generator
with open('myDataFile.txt') as f:
    myDataList = f.read().splitlines()

def qr_code():
    while True:
        success, frame = camera.read()  # read the camera frame
        for barcode in decode(frame):
            myData = barcode.data.decode('utf-8')
            if myData in myDataList:
                Output = myData + " Verified"
                play_obj = wave_obj.play()
                play_obj.wait_done()
            else:
                Output = "UnAuthorized"
                play_obj = wave_obj1.play()
                play_obj.wait_done()
        #detect QR
            pts = np.array([barcode.polygon],np.int32)
            pts = pts.reshape((-1,1,2))
            cv2.polylines(frame,[pts],True,(255,0,0),5)

            pts2 = barcode.rect
            cv2.putText(frame,(Output),(pts2[0],pts2[1]),cv2.FONT_HERSHEY_SIMPLEX,0.9,(0,0,255),2)

        ret, buffer = cv2.imencode('.jpg', frame)
        frame = buffer.tobytes()
        yield(b'--frame\r\n'
                    b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')


@app.route('/')
def index():
    return render_template('index.html')


@app.route('/face')
def face():
    return render_template('face_detection.html')


@app.route('/qrcheck')
def qrcheck():
    return render_template('qr_code.html')

@app.route('/code')
def code():
    return Response(qr_code(), mimetype='multipart/x-mixed-replace; boundary=frame')


if __name__=='__main__':
    app.run(debug=True)