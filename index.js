'use strict'

const express = require('express')
const bodyParser = require('body-parser')
const request = require('request')

const app = express()

//app.set('port',(process.env.PORT || 5000))
let port = process.env.PORT || 1299;
let host = '0.0.0.0';
//Allows to process data
app.use(bodyParser.urlencoded({extended : false}))
app.use(bodyParser.json())

//ROUTES
app.get('/',function(req,res)
{
    console.log("in get");
    res.send("Hi Iam a chatbot")
})
let token = "EAADvmNrEZB44BAInhtzSC3M81AgOMylaCtIdmpy0NuPUi2SdHk9UgBkcePB1SdIQuhYvjIyqdS8fsjSkppZCCbqhucoSfW53icBQZCZBt88fVN4tQEUXKWY21cZAKZBi47Sfbz48wD98IW2HS4OS6xZAii1cIm5guqoXJmUEyPK8AZDZD";
//FACEBOOK
app.get('/webhook/',function(req,res)
{
    if(req.query['hub.verify_token'] === "Msrapp")
    {
        res.send(req.query['hub.challenge'])
    }
    res.send("Wrong Token")
})
app.post('/webhook/',function(req,res)
{
    console.log("Success");
    let messaging_events = req.body.entry[0].messaging;
    for(let i=0 ; i<messaging_events.length ; i++)
    {
        let event = messaging_events[i];
        let sender = event.sender.id;
        console.log(event)
        if(event.message && event.message.text)
        {
            let text = event.message.text;
            sendText(sender, "Text echo: " + text.substring(0,100))
            //res.send(text);
        }
    }
    res.sendStatus(200)
})
function sendText(sender,text)
{
    let messageData = {text:text};
    request({
        url:"https://graph.facebook.com/me/messages",
        qs : {access_token:token},
        method : "POST",
        json:{
            recipient : {id: sender},
            message : messageData
        }
    }, function(error , response ,body){
        if(error){
            console.log("sending error");
        }
        else if(response.body.error)
        {
            console.log("response body error");
        }
    })
}
//Listening the requests
app.listen( process.env.PORT || 1299,function(){
    console.log("running");
});