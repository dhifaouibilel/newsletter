const express = require('express');
const bodyParser = require('body-parser');
const https = require('https');
// const client = require('mailchimp-marketing'); // this module for second solution
const port = 3000;
const app = express();
const dataCenter = "us13"; // from api key 48ce21492087e896a529db21bfcd3efd-us13
const list_id = "74656285c3";

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'))

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/signup.html');
})

app.post('/', function(req, res){
  const firstName = req.body.fName;
  const lastName = req.body.lName;
  const email = req.body.email;

  // First solution is to use API .. for second solution look at readme.txt file
  const data = {
    email_address: email,
    status: "subscribed",
    merge_fields:{
      FNAME:firstName,
      LNAME:lastName,
    }
  }

  const jsonData = JSON.stringify(data);
  const url = "https://"+dataCenter+".api.mailchimp.com/3.0/lists/"+list_id+"/members"
  const options = {
    method: "POST",
    auth: "bilel:48ce21492087e896a529db21bfcd3efd-us13"
  };

  const request = https.request(url, options, function(response){
    response.on("data", function(data){
      console.log(JSON.parse(data));
      if(response.statusCode==200){
        res.sendFile(__dirname+'/success.html');
      } else {
        res.sendFile(__dirname+'/failure.html');
      }
    })
  })
  request.write(jsonData);
  request.end();

})

app.post('/failure', function(req, res){
  res.redirect('/')
})


app.listen(port, function() {
  console.log('this server is running in port '+port);
});
