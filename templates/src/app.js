const path = require('path')
const express = require('express')
const cors = require('cors')

const app = express()
const port = process.env.PORT || 3000

const basePath = path.join(__dirname, '../public')

app.use(express.static(basePath))
var corsOptions = {
    origin: "http://localhost:3002"
  };
  
  app.use(cors(corsOptions));


app.get('/', (req, res) => {
    res.sendFile(path.join(basePath, 'one.html'))
})

app.get('/HTML/login.html', (req, res) => {
    res.sendFile(path.join(basePath, './HTML/login.html'))
})

app.get('/HTML/verification.html', (req, res) => {
    res.sendFile(path.join(basePath, './HTML/verification.html'))
})

app.get('/HTML/faceVerification.html', (req, res) => {
    res.sendFile(path.join(basePath, './HTML/faceVerification.html'))
})



//start express server
app.listen(port, () => {
    console.log('Server started on post ' + port)
})