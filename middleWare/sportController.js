const path = require("path");
const sport = require("../model/sportSchema");

module.exports = {

  getSport:(req, res)=>{
    // res.setHeader("Content-Type", "application/x-www-form-urlencoded");
    console.log("requested a sport", req.params)
    sport.find( (err, results)=>{
       if(err) return res.status(404).send("error: "+err);
       res.send(results)
     });
  },

  insertSport: (req, res)=>{
    console.log("got a post request", req.body); 
  //   // res.set("Content-Type", "application/json");
  let d = req.body.sports;
  console.log("d:",d); 
    
    sport.create(req.body, (err, results)=>{ 
      if(err) return res.status(404).send("error:"+err);
      let newResult = [];
      //  results = JSON.parse(results);
       for (let index = 0; index < results.length; index++) {

         newResult.push(results[index].sports);
       }
      console.log("successful result: ", results); 
      return res.send(results);
      
    });
  },
  // updateAthlete: (req, res)=>{
  //   console.log("requested an Athlete", req.body,req.params.taskId)
  //   Athlete.findByIdAndUpdate(req.params.taskId,req.body, (err, results)=>{
  //     if(err) return res.status(404).send("error: "+err);
  //     res.send(results)
  //   });
  // },
  // deleteAthlete: (req, res)=>{
  //   console.log("deleting athlete",req.body );
  //   Athlete.deleteOne({_id:req.body.taskId}, (err, results)=>{
  //     if(err)return res.status(404).send("error"+ err);
  //     console.log("success deleted one athlete", results);
  //   }
  // )

  // },
}