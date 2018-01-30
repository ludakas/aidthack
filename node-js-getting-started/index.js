
const PAGE_ACCESS_TOKEN = "EAACSsMdvLc4BADEHvOcxx9zMbszEaNHcPyfBboLGwJcOVvchPZABAQOR3i0r1DjcJPD9aAja1qF30in5jDKW1G6Fgx9eg45xWmo62O206uTYBXcSwdudJvXOSaY0gIevE3nMw97bgeZAJZCs8A9ZAuf2PjfVmUJvMo5TCOITYQZDZD";

const http = require('http')
const express = require('express')
const path = require('path')
const request = require('request')
const bodyParser = require('body-parser')
var querystring = require('querystring');

const PORT = process.env.PORT || 5000
const translate = require('google-translate-api')
var app = express()
app.use(bodyParser.urlencoded({"extended": false}))
app.use(bodyParser.json());
var urldecode = require('urldecode')
var urlencode = require('urlencode')



var lang = 'en';


const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
var fs = require("fs");

// Connection url
const url = 'mongodb://admin:test@cluster0-shard-00-00-crkpw.mongodb.net:27017,cluster0-shard-00-01-crkpw.mongodb.net:27017,cluster0-shard-00-02-crkpw.mongodb.net:27017/admin?replicaSet=Cluster0-shard-0&ssl=true';
// Database Name
const dbName = 'aidthack';

app.get('/dbtest', function (req, res) {
	// Use connect method to connect to the server
					MongoClient.connect(url, function(err, db) {
					  if (err) throw err;
					  var dbo = db.db("inquiries");
					  var myobj = { language: "en", inquiry: "stuff", answer:"stuff" }
					  dbo.collection("questions").insertOne(myobj, function(err, res) {
					    if (err) throw err;
					    console.log("record inserted");
					    db.close();
					  });
					});
					res.send('doh');
})

app.get('/question', function (req, res) {
	let inputmessage = urldecode(req.query.message);
		translate(inputmessage, {to: 'de'}).then(response => {
			//console.log(response.text);
			//=> I speak English 
			console.log(response.from.language.iso);
			lang = response.from.language.iso;
		    //=> nl 
			//res.send(response.text)

			let aiurl = 'http://ec2-34-244-29-166.eu-west-1.compute.amazonaws.com:8000/?message=' + urlencode(response.text);

			http.get(aiurl, response2 => {
			  response2.setEncoding("utf8");
			  let body = "";
			  response2.on("data", data => {
			    body += data;
			  });
			  response2.on("end", () => {
			    body = JSON.parse(urldecode(body));

				translate(body.message, {from: 'de', to: lang}).then(response3 => {
					console.log(lang);
				    console.log(response3.text);
				    //=> false 
					//res.send(response.text)

					MongoClient.connect(url, function(err, db) {
					  if (err) throw err;
					  var dbo = db.db("inquiries");
					  var myobj = { language: lang, inquiry: inputmessage, answer:response3.text }
					  dbo.collection("questions").insertOne(myobj, function(err, responsedb) {
					    if (err) throw err;
					    console.log("record inserted");
					    db.close();
					  });
					});

					res.send(response3.text);
				}).catch(err => {
				    res.send("error");
				});

			  });

			});
		}).catch(err => {
			res.send("error");
	});

  
})

app.get('/toGerman', function (req, res) {
 		translate(received_message.text, {to: 'de'}).then(response => {
			//console.log(response.text);
			//=> I speak English 
			console.log(response.from.language.iso);
			lang = response.from.language.iso;
		    //=> nl 
			res.send(response.text)
	});
})

app.get('/fromGerman', function (req, res) {

	translate('I spea Dutch!', {from: 'de', to: lang}).then(response => {
		console.log(lang);
	    console.log(response.text);
	    //=> false 
		res.send(response.text)
	}).catch(err => {
	    console.error(err);
		res.send("error")

	});
})

app.post('/webhook', (req, res) => {  

  // Parse the request body from the POST
  let body = req.body;

  // Check the webhook event is from a Page subscription
  if (body.object === 'page') {

    body.entry.forEach(function(entry) {

      // Gets the body of the webhook event
      let webhook_event = entry.messaging[0];
      console.log(webhook_event);


      // Get the sender PSID
      let sender_psid = webhook_event.sender.id;
      console.log('Sender ID: ' + sender_psid);

      // Check if the event is a message or postback and
      // pass the event to the appropriate handler function
      if (webhook_event.message) {
        handleMessage(sender_psid, webhook_event.message);        
      } else if (webhook_event.postback) {
        
        handlePostback(sender_psid, webhook_event.postback);
      }
      
    });
    // Return a '200 OK' response to all events
    res.status(200).send('EVENT_RECEIVED');

  } else {
    // Return a '404 Not Found' if event is not from a page subscription
    res.sendStatus(404);
  }

});

// Accepts GET requests at the /webhook endpoint
app.get('/webhook', (req, res) => {
  
  /** UPDATE YOUR VERIFY TOKEN **/
  const VERIFY_TOKEN = "UBER_TOKEN";
  
  // Parse params from the webhook verification request
  let mode = req.query['hub.mode'];
  let token = req.query['hub.verify_token'];
  let challenge = req.query['hub.challenge'];
    
  // Check if a token and mode were sent
  if (mode && token) {
  
    // Check the mode and token sent are correct
    if (mode === 'subscribe' && token === VERIFY_TOKEN) {
      
      // Respond with 200 OK and challenge token from the request
      console.log('WEBHOOK_VERIFIED');
      res.status(200).send(challenge);
    
    } else {
      // Responds with '403 Forbidden' if verify tokens do not match
      res.sendStatus(403);      
    }
  }
});


function handleMessage(sender_psid, received_message) {

  let response;
  if (received_message.text) {    

	console.log(received_message.text);
	translate(received_message.text, {to: 'de'}).then(response => {
			//console.log(response.text);
			//=> I speak English 
			console.log(response.from.language.iso);
			lang = response.from.language.iso;
		    //=> nl 
			//res.send(response.text)


			let aiurl = 'http://ec2-34-244-29-166.eu-west-1.compute.amazonaws.com:8000/?message=' + urlencode(response.text);

			http.get(aiurl, response2 => {
			  response2.setEncoding("utf8");
			  let body = "";
			  response2.on("data", data => {
			    body += data;
			  });
			  response2.on("end", () => {
			    body = JSON.parse(urldecode(body));

				translate(body.message, {from: 'de', to: lang}).then(response3 => {
					console.log(lang);
				    console.log(response3.text);
				    //=> false 
					//res.send(response.text)
					console.log(received_message.text);
					MongoClient.connect(url, function(err, db) {
					  if (err) throw err;
					  var dbo = db.db("inquiries");
					  var myobj = { language: lang, inquiry: received_message.text, answer:response3.text }
					  dbo.collection("questions").insertOne(myobj, function(err, res) {
					    if (err) throw err;
					    console.log("record inserted");
					    db.close();
					  });
					});

					response = {
				      "text":response3.text
				    }
				    callSendAPI(sender_psid, response); 
				}).catch(err => {
				    console.error(err);
					response = {
				      "text": 'error'
				    }
				    callSendAPI(sender_psid, response); 

				});

			  });

			});
		}).catch(err => {
	    	console.error(err);
	    	response = {
		      "text": 'error'
		    }
		    callSendAPI(sender_psid, response); 
	});
    // Create the payload for a basic text message, which
    // will be added to the body of our request to the Send API

  }

  /*
  // Checks if the message contains text
  if (received_message.text) {    
    // Create the payload for a basic text message, which
    // will be added to the body of our request to the Send API
    response = {
      "text": `You sent the message: "${received_message.text}". Now send me an attachment!`
    }
  } else if (received_message.attachments) {
    // Get the URL of the message attachment
    let attachment_url = received_message.attachments[0].payload.url;
    response = {
      "attachment": {
        "type": "template",
        "payload": {
          "template_type": "generic",
          "elements": [{
            "title": "Is this the right picture?",
            "subtitle": "Tap a button to answer.",
            "image_url": attachment_url,
            "buttons": [
              {
                "type": "postback",
                "title": "Yes!",
                "payload": "yes",
              },
              {
                "type": "postback",
                "title": "No!",
                "payload": "no",
              }
            ],
          }]
        }
      }
    }
  } 
  
  // Send the response message
  callSendAPI(sender_psid, response);    
  */
}

function handlePostback(sender_psid, received_postback) {
  console.log('ok')
   let response;
  // Get the payload for the postback
  let payload = received_postback.payload;

  // Set the response based on the postback payload
  if (payload === 'yes') {
    response = { "text": "Thanks!" }
  } else if (payload === 'no') {
    response = { "text": "Oops, try sending another image." }
  }
  // Send the message to acknowledge the postback
  callSendAPI(sender_psid, response);
}

function callSendAPI(sender_psid, response) {
  // Construct the message body
  let request_body = {
    "recipient": {
      "id": sender_psid
    },
    "message": response
  }

  // Send the HTTP request to the Messenger Platform
  request({
    "uri": "https://graph.facebook.com/v2.6/me/messages",
    "qs": { "access_token": PAGE_ACCESS_TOKEN },
    "method": "POST",
    "json": request_body
  }, (err, res, body) => {
    if (!err) {
      console.log('message sent!')
    } else {
      console.error("Unable to send message:" + err);
    }
  }); 
}

function test()
{

/*
		  var post_data = querystring.stringify({
		      'message' : response.text
		  });

		  // An object of options to indicate where to post to
		  var post_options = {
		      host: 'ec2-34-244-29-166.eu-west-1.compute.amazonaws.com',
		      port: '8000',
		      path: '/compile',
		      method: 'POST',
		      headers: {
		          'Content-Type': 'application/x-www-form-urlencoded',
		          'Content-Length': Buffer.byteLength(post_data)
		      }
		  };

		  // Set up the request
		  var post_req = http.request(post_options, function(res) {
		      res.setEncoding('utf8');
		      res.on('data', function (chunk) {
		          	console.log('Response: ' + chunk);
		          	let body  = JSON.parse(chunk);

					MongoClient.connect(url, function(err, db) {
					  if (err) throw err;
					  var dbo = db.db("inquiries");
					  var myobj = { language: lang, question: received_message.text, answer:body.message }
					  dbo.collection("questions").insertOne(myobj, function(err, res) {
					    if (err) throw err;
					    console.log("record inserted");
					    db.close();
					  });
					});

					translate(body.message, {from: 'de', to: lang}).then(response3 => {
						console.log(lang);
					    console.log(response3.text);
					    //=> false 
						//res.send(response.text)
						response = {
					      "text":response3.text
					    }
					    callSendAPI(sender_psid, response); 
					}).catch(err => {
					    console.error(err);
						response = {
					      "text": 'error'
					    }
					    callSendAPI(sender_psid, response); 

					});


		      });
		  });

		  // post the data
		  post_req.write(post_data);
		  post_req.end();
*/
}

app.listen(PORT, () => console.log(`Listening on ${ PORT }`))