require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const request = require('request')
const cors = require("cors");

const { Client } = require('pg')
const { max } = require('pg/lib/defaults')
const connectStr = process.env.DATABASE_URL;
const pg = new Client({
  connectionString: connectStr,
  ssl: { rejectUnauthorized: false }
});

pg.connect().catch((error) => {
  console.log('Error connecting to database', error)
})

const firebase = require("firebase")

const app = express()
const port = process.env.PORT || 4000

app.use(bodyParser.json())
app.use(express.json());
app.use(cors());


var admin = require("firebase-admin");

var serviceAccount = require("./permision.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://zoomchatbot-545fd-default-rtdb.firebaseio.com"
});
app.use(cors({ origin: true }));
const db = admin.firestore();

app.get('/', (req, res) => {
  res.send('Welcome to the Chatbot for Zoom! by Buddhi')
})

app.get('/test/:msg', (req, res) => {
  res.send('Testing')
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
  /////////////////////////////////////
  const trigger = [
    ["hi", "hey", "hello", "good morning", "good afternoon"],
    ["how are you", "how is life", "how are things"],
    ["what are you doing", "what is going on", "what is up"],
    ["how old are you"],
    ["who are you", "are you human", "are you bot", "are you human or bot"],
    ["who created you", "who made you"],
    [
      "your name please",
      "your name",
      "may i know your name",
      "what is your name",
      "what call yourself"
    ],
    ["i love you"],
    ["happy", "good", "fun", "wonderful", "fantastic", "cool"],
    ["bad", "bored", "tired"],
    ["help me", "tell me story", "tell me joke"],
    ["ah", "yes", "ok", "okay", "nice"],
    ["thanks", "thank you"],
    ["bye", "good bye", "goodbye", "see you later"],
    ["what should i eat today"],
    ["bro"],
    ["what", "why", "how", "where", "when"]
  ];


  const reply = [
    ["Hello!", "Hi!", "Hey!", "Hi there!"],
    [
      "Fine... how are you?",
      "Pretty well, how are you?",
      "Fantastic, how are you?"
    ],
    [
      "Nothing much",
      "About to go to sleep",
      "Can you guess?",
      "I don't know actually"
    ],
    ["I am infinite"],
    ["I am just a bot", "I am a bot. What are you?"],
    ["The one true God, JavaScript"],
    ["I am nameless", "I don't have a name"],
    ["I love you too", "Me too"],
    ["Have you ever felt bad?", "Glad to hear it"],
    ["Why?", "Why? You shouldn't!", "Try watching TV"],
    ["What about?", "Once upon a time..."],
    ["Tell me a story", "Tell me a joke", "Tell me about yourself"],
    ["You're welcome"],
    ["Bye", "Goodbye", "See you later"],
    ["Sushi", "Pizza"],
    ["Bro!"],
    ["Yes?"]
  ];


  const alternative = [
    "Same",
    "Go on...",
    "Bro...",
    "Try again",
    "I'm listening..."
  ];


  let output;
  function proccessMessage(input) {
    let text = input.toLowerCase().replace(/[^\w\s\d]/gi, "");
    text = text
      .replace(/ a /g, " ")
      .replace(/i feel /g, "")
      .replace(/whats/g, "what is")
      .replace(/please /g, "")
      .replace(/ please/g, "");

    const match = compare(trigger, reply, text)
    if (match) {
      output = match;
    } else if (text.match(/coronavirus/gi)) {
      output = coronavirus[Math.floor(Math.random() * coronavirus.length)];
    } else {
      output = alternative[Math.floor(Math.random() * alternative.length)];
    }
    return output

  }
  function compare(triggerArray, replyArray, string) {
    let item;
    for (let x = 0; x < triggerArray.length; x++) {
      for (let y = 0; y < replyArray.length; y++) {
        if (triggerArray[x][y] == string) {
          items = replyArray[x];
          item = items[Math.floor(Math.random() * items.length)];
        }
      }
    }
    return item;
  }

  msg = req.params.msg

  /////////////////////////////////////

  ///////////////----02----////////////
  function getSentiment(msg) {
    var natural = require('natural');
    var Analyzer = natural.SentimentAnalyzer;
    var stemmer = natural.PorterStemmer;
    var analyzer = new Analyzer("English", stemmer, "afinn");


    var natural = require('natural');
    var tokenizer = new natural.WordTokenizer();
    var trimmedText = tokenizer.tokenize(msg);

    var k = analyzer.getSentiment(trimmedText);
    var url;
    if (k > 0) {
      url = "https://hotemoji.com/images/dl/f/happy-emoji-by-google.png";
      return url;
    }
    else if (k == 0) {
      url = "https://cdn.shopify.com/s/files/1/1061/1924/products/Neutral_Face_Emoji_grande.png?v=1571606037";
      return url;
    }
    else if (k < 0) {
      url = "https://www.cambridge.org/elt/blog/wp-content/uploads/2019/07/Sad-Face-Emoji-480x480.png";
      return url;
    }
  }

  function getSen(url) {
    var k;
    if (url == "https://hotemoji.com/images/dl/f/happy-emoji-by-google.png") {
      k = "Very Happy";
    }
    else if (url == "https://cdn.shopify.com/s/files/1/1061/1924/products/Neutral_Face_Emoji_grande.png?v=1571606037") {
      k = "Happy";
    }
    else if (url == "https://www.cambridge.org/elt/blog/wp-content/uploads/2019/07/Sad-Face-Emoji-480x480.png") {
      k = "Sad";
    }
    else {

    }
    return k;
  }
  ////////////////////////////////////
  getChatbotToken()

  function getChatbotToken() {
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

  function sendChat(chatbotToken) {
    const msg = req.body.payload.cmd;
    const replay = proccessMessage(msg);



    //Save the Chat//

    (async () => {

      try {
        await db.collection('Messages').doc()
          .create({
            message: msg
          })
  
        return res.status(200).send();
      }
      catch (error) {
        console.log(error);
        return res.status(500).send(error);
      }
  
    })();

    ///////
    let fullChat = [];

    if (msg == "Bye" || msg == "bye") {
      (async () => {

        try {
          let query = db.collection('Messages');

          await query.get().then(querySnapshot => {
            let docs = querySnapshot.docs;

            for (let doc of docs) {
              const selectedItem = {
                message: doc.data().message
              };
              fullChat.push(selectedItem.message);
            };
            return fullChat;
          })
          return res.status(200).send(fullChat.join(". "));
        }
        catch (error) {
          console.log(error);
          return res.status(500).send(error);
        }

      })();
    } 



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
            'text': 'Zoom_Bot'
          },
          'body': [{
            'type': 'message',
            'text': replay
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