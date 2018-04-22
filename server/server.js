
console.log("server!");
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const path = require("path");
const fs = require("fs");
const Ip = "localhost";
const port = 3001;
const athleteController = require("../middleWare/athleteController");
const sportController = require("../middleWare/sportController");
const formidable = require('formidable');
app.use(express.static(__dirname));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
  res.header("Content-Type", "multipart/form-data");
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
let AWS = require("aws-sdk");
let awsAccessKeyId = "AKIAIHLP74EW67JPYUFQ";
let awsSecretAccessKey = "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";
let region = "us-east-1";
// let multiparty = require("multiparty");

// let promi = getPics();
// promi.then(function(data){ console.log(data)})
// console.log("array", promi);

// let  d = getPics()
// console.log("d is :", d);
function getPics() {
  let a = [];
  let s3 = new AWS.S3({ accessKeyId: awsAccessKeyId, secretAccessKey: awsSecretAccessKey, region: region });
  let params = { Bucket: "athleteform" };

  let p = new Promise(function (resolve, reject) {
    s3.listObjects(params, function (err, d) {
      // console.log("err",err,"Your generated an amazon s3 pre-signed URL is", d);
      let data = d.Contents;
      for (let index = 0; index < data.length; index++) {
        let urlParams = { Bucket: 'athleteform', Key: data[index].Key };
        s3.getSignedUrl('getObject', urlParams, function (err, url) {
          // console.log("err",err, "url",url);
          a.push(url)
        });
      }
      resolve(a);
      // console.log(a);
    })
  });
  p.then(function (data) { console.log("arraydata", data); return data; });
  p.catch(function (err) { console.log("error from promise", err); return err; })

}

function uploadPics() {
  let s3 = new AWS.S3({ accessKeyId: awsAccessKeyId, secretAccessKey: awsSecretAccessKey, region: region });
  let params = { Bucket: "athleteform" };
  s3.listObjects(params, function (err, url) {
    console.log("err", err, "Your generated an amazon s3 pre-signed URL is", url);
  });
}

mongoose.connect('mongodb://jolaya182:marieo23@ds125618.mlab.com:25618/atheleteform',
  () => console.log("connected with javis mongodatabase"))

app.get('/:profiles', athleteController.getAtheletes)

app.get('/:taskId', athleteController.getAthelete);

app.get("/get/sports", sportController.getSport);

app.post("/:sports", sportController.insertSport);

app.post('/', athleteController.insertAthlete);

app.put('/:taskId', athleteController.updateAthlete);

app.delete("/", athleteController.deleteAthlete);

app.post("/post/profilePic", function (req, res) {
  console.log("requested to post a  picture");
  let form = new formidable.IncomingForm();
  // let form = new multiparty.Form();

  form.parse(req, function(err, fields, files){
    // console.log("form parses err",err, "fields", fields, "files", files );
    console.log("files", files );
    let a = [];
    let s3 = new AWS.S3({ accessKeyId: awsAccessKeyId, secretAccessKey: awsSecretAccessKey, region: region });
    let someData = req;
    // console.log("data files.image",  files.image, "some body:", someData.body, "some data:", someData.data);
    // let pic = require(path.join(__dirname+ "../pics/vegeta.jpg"))
    // let img = fs.readFileSync(__dirname+'/../pics/vegeta1.jpg' );
    // console.log("file path",  files.[0].path);__dirname+'/../pics/vegeta1.jpg'
    let data = fs.readFile(files[0].path, function(err,data){

      
      console.log("data", data);
      let params = { Bucket: "athleteform",  Key:files[0].name , Body:data, ACL:'public-read'};//
      let p = new Promise(function (resolve, reject) {
        s3.putObject(params, function (err, d) {
          // console.log("err",err,"Your generated an amazon s3 pre-signed URL is", d);
          console.log("d has returned from amazon", d);
          console.log("the error is ", err);
          resolve(d);
        })
      });
      p.then(function (data) { console.log("arraydata", data); res.send(JSON.stringify({ data: data })); });
      p.catch(function (err) { console.log("error from promise", err); return err; })
    });

  } )//end of formidable

});

app.get("/get/profilePics", function (req, res) {
  console.log("requested Profile pictures");
  let a = [];
  let s3 = new AWS.S3({ accessKeyId: awsAccessKeyId, secretAccessKey: awsSecretAccessKey, region: region });
  let params = { Bucket: "athleteform" };

  let p = new Promise(function (resolve, reject) {
    s3.listObjects(params, function (err, d) {
      // console.log("err",err,"Your generated an amazon s3 pre-signed URL is", d);
      let data = d.Contents;
      for (let index = 0; index < data.length; index++) {
        let urlParams = { Bucket: 'athleteform', Key: data[index].Key };
        s3.getSignedUrl('getObject', urlParams, function (err, url) {
          // console.log("err",err, "url",url);
          a.push({ "Key": data[index].Key, "url": url })
        });
      }
      resolve(a);
      // console.log(a);
    })
  });
  p.then(function (data) { console.log("arraydata", data); res.send(JSON.stringify({ data: data })); });
  p.catch(function (err) { console.log("error from promise", err); return err; })
})

app.listen(port, Ip, () => console.log(`server running at http://${Ip}:${port}`));