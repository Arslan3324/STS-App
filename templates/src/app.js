const path = require('path')
const express = require('express')
const app = express()
const cors=require("cors");
const corsOptions ={
   origin:'http://localhost:3000', 
   credentials:true,            //access-control-allow-credentials:true
   optionSuccessStatus:200,
}

app.use(cors(corsOptions)) // Use this after the variable declaration


const port = process.env.PORT || 3000

const basePath = path.join(__dirname, '../public')

app.use(express.static(basePath))

  
  


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