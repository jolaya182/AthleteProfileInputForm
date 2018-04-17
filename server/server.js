console.log("server!");
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const path = require("path");
const Ip = "localhost";
const port = 3001;
const athleteController = require("../middleWare/athleteController");
const sportController = require("../middleWare/sportController");
app.use(express.static(__dirname));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});


mongoose.connect('mongodb://jolaya182:marieo23@ds125618.mlab.com:25618/atheleteform',
  () => console.log("connected with javis mongodatabase"))

app.get('/:profiles', athleteController.getAtheletes)

app.get('/:taskId', athleteController.getAthelete);

app.get("/get/sports",sportController.getSport );

app.post("/:sports",sportController.insertSport );

app.post('/',  athleteController.insertAthlete );

app.put('/:taskId', athleteController.updateAthlete);

app.delete("/",athleteController.deleteAthlete)

app.listen(port, Ip, () => console.log(`server running at http://${Ip}:${port}`));