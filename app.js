const express = require('express')


const questions = require('./Questions/script')

const port = 3000
const app = express()

app.get('/ques1',(req,res)=>{
    res.send(questions.ques1())
})

app.get('/ques2/:q',(req,res)=>{
    // console.log(req.params.q)
    questions.ques2(req.params.q).then(data=>{
        res.send(data)
    })
})

app.get('/ques3',(req,res)=>{
    // console.log(req.params.q)
    questions.ques3().then(data=>{
        res.send(data)
    })
})

app.listen(port,()=>{
    console.log("Server is up and is running on port:",port)
})