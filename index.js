require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const request = require('request')

const { Client } = require('pg')
const connectStr = process.env.DATABASE_URL;
const pg = new Client({
  connectionString: connectStr,
  ssl: { rejectUnauthorized: false }
});



// const {Pool} = require('pg');
// const connectStr = process.env.DATABASE_URL;
// const pool = new Pool({
//     connectionString: connectStr,
//     ssl: true
// });


pg.connect().catch((error) => {
  console.log('Error connecting to database', error)
})

const app = express()
const port = process.env.PORT || 4000

app.use(bodyParser.json())

app.get('/', (req, res) => {
  res.send('Welcome to the Chatbot for Zoom! by Buddhi')
})




app.get('/test/:msg', (req, res) => {
  
  
})


app.get('/authorize', (req, res) => {
  res.redirect('https://zoom.us/launch/chat?jid=robot_' + process.env.zoom_bot_jid)
})

app.get('/support', (req, res) => {
  res.send('Contact Chathuranga4lk12@gmail.com for support.')
})

app.get('/privacy', (req, res) => {
  res.send('The Chatbot for Zoom does not store any user data.')
})

app.get('/terms', (req, res) => {
  res.send('By installing the Chatbot for Zoom, you are accept and agree to these terms...')
})

app.get('/documentation', (req, res) => {
  res.send('Documentation')
})

app.get('/zoomverify/verifyzoom.html', (req, res) => {
  res.send(process.env.zoom_verification_code)
})




app.post('/unsplash', (req, res) => {

  getChatbotToken()

  function getChatbotToken () {
    request({
      url: `https://zoom.us/oauth/token?grant_type=client_credentials`,
      method: 'POST',
      headers: {
        'Authorization': 'Basic ' + Buffer.from(process.env.zoom_client_id + ':' + process.env.zoom_client_secret).toString('base64')
      }
    }, (error, httpResponse, body) => {
      if (error) {
        console.log('Error getting chatbot_token from Zoom.', error)
      } else {
        body = JSON.parse(body)
        sendChat(body.access_token)
      }
    })
  }
  
  function sendChat (chatbotToken) {
    //req.body.payload.cmd
    var msg = req.body.payload.cmd

    request({
      url: 'https://api.zoom.us/v2/im/chat/messages',
      method: 'POST',
      json: true,
      body: {
        'robot_jid': process.env.zoom_bot_jid,
        'to_jid': req.body.payload.toJid,
        'account_id': req.body.payload.accountId,
        'content': {
          'head': {
            'text': 'Unsplash'
          },
          'body': [{
            'type': 'message',
            'text': 'You sent ' + req.body.payload.cmd
          }]
        }
      },
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + chatbotToken
      }
    }, (error, httpResponse, body) => {
      if (error) {
        console.log('Error sending chat.', error)
      } else {
        console.log(body)
      }
    })
  }

  var trigger = [
    ["hi","hey","hello"], 
    ["how are you", "how is life", "how are things"],
    ["what are you doing", "what is going on"],
    ["how old are you"],
    ["who are you", "are you human", "are you bot", "are you human or bot"],
    ["who created you", "who made you"],
    ["your name please",  "your name", "may i know your name", "what is your name"],
    ["i love you"],
    ["happy", "good"],
    ["bad", "bored", "tired"],
    ["help me", "tell me story", "tell me joke"],
    ["ah", "yes", "ok", "okay", "nice", "thanks", "thank you"],
    ["bye", "good bye", "goodbye", "see you later"]
  ];

  var reply = [
    ["Hi","Hey","Hello"], 
    ["Fine", "Pretty well", "Fantastic"],
    ["Nothing much", "About to go to sleep", "Can you guest?", "I don't know actually"],
    ["I am 1 day old"],
    ["I am just a bot", "I am a bot. What are you?"],
    ["Buddhi Chathuranga", "My God"],
    ["I am nameless", "I don't have a name"],
    ["I love you too", "Me too"],
    ["Have you ever felt bad?", "Glad to hear it"],
    ["Why?", "Why? You shouldn't!", "Try watching TV"],
    ["I will", "What about?"],
    ["Tell me a story", "Tell me a joke", "Tell me about yourself", "You are welcome"],
    ["Bye", "Goodbye", "See you later"]
  ];

  var alternative = ["Haha...", "Eh..."];


  function output(input){
    try{
      var product = input + "=" + eval(input);
    } catch(e){
      var text = (input.toLowerCase()).replace(/[^\w\s\d]/gi, ""); //remove all chars except words, space and 
      text = text.replace(/ a /g, " ").replace(/i feel /g, "").replace(/whats/g, "what is").replace(/please /g, "").replace(/ please/g, "");
      if(compare(trigger, reply, text)){
        var product = compare(trigger, reply, text);
      } else {
        var product = alternative[Math.floor(Math.random()*alternative.length)];
      }
    }

    res.send(product);
    
  }
  function compare(arr, array, string){
    var item;
    for(var x=0; x<arr.length; x++){
      for(var y=0; y<array.length; y++){
        if(arr[x][y] == string){
          items = array[x];
          item =  items[Math.floor(Math.random()*items.length)];
        }
      }
    }
    return item;
  }
})









app.post('/deauthorize', (req, res) => {
  if (req.headers.authorization === process.env.zoom_verification_token) {
    res.status(200)
    res.send()
    request({
      url: 'https://api.zoom.us/oauth/data/compliance',
      method: 'POST',
      json: true,
      body: {
        'client_id': req.body.payload.client_id,
        'user_id': req.body.payload.user_id,
        'account_id': req.body.payload.account_id,
        'deauthorization_event_received': req.body.payload,
        'compliance_completed': true
      },
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Basic ' + Buffer.from(process.env.zoom_client_id + ':' + process.env.zoom_client_secret).toString('base64'),
        'cache-control': 'no-cache'
      }
    }, (error, httpResponse, body) => {
      if (error) {
        console.log(error)
      } else {
        console.log(body)
      }
    })
  } else {
    res.status(401)
    res.send('Unauthorized request to Chatbot for Zoom.')
  }
})

app.listen(port, () => console.log(`Chatbot for Zoom listening on port ${port}!`))