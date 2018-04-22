const path = require("path");
const Athlete = require("../model/atheleteSchema");

module.exports = {

  getAtheletes:(req, res)=>{
    // res.setHeader("Content-Type", "application/x-www-form-urlencoded");
    console.log("requested an Athletes", req.params)
     Athlete.find( (err, results)=>{
       if(err) return res.status(404).send("error: "+err);
       let newResult = [];
      //  results = JSON.parse(results);
       for (let index = 0; index < results.length; index++) {
         const element = { "name":results[index].LastName  + ", "+ results[index].FirstName, "imgName": results[index].ProfileImage} ;
          newResult.push(element);
       }
       res.send(newResult)
     });
  },
  getAthelete:(req, res)=>{
    // res.setHeader("Content-Type", "application/x-www-form-urlencoded");
    console.log("requested an Athlete", req.params)
     Athlete.findOne({_id:req.params.taskId} , (err, results)=>{
       if(err) return res.status(404).send("error: "+err);
       res.send(results)
     });
  },

  insertAthlete: (req, res)=>{
    console.log("got a post request", req.body); 
    res.set("Content-Type", "application/json"); 
    let d = req.body;
    let a = { 
      FirstName:d.FirstName,
      LastName: d.LastName, 
      DateOfBirth: d.DateOfBirth, 
      Nationality: d.Nationality,
      Location: d.Location,
      Association: d.Association,
      Team: d.Team,
      Gender: d.Gender,
      Sports: d.Sports,
      About: d.About,
      Interests: d.Interests,
      Charities: d.Charities,
      SocialMediaHandles: d.SocialMediaHandles,
      Pets: d.Pets,
      DrinksAlcohol: d.DrinksAlcohol,
      Married: d.Married,
      ProfileImage: d.ProfileImage
     } ;
    
    Athlete.create(a, (err, result)=>{ 
      if(err) return res.status(404).send("error:"+err);

      console.log("successful result: ", result); 
      return res.send(result);
      
    });
  },
  updateAthlete: (req, res)=>{
    console.log("requested an Athlete", req.body,req.params.taskId)
    Athlete.findByIdAndUpdate(req.params.taskId,req.body, (err, results)=>{
      if(err) return res.status(404).send("error: "+err);
      res.send(results)
    });
  },
  deleteAthlete: (req, res)=>{
    console.log("deleting athlete",req.body );
    Athlete.deleteOne({_id:req.body.taskId}, (err, results)=>{
      if(err)return res.status(404).send("error"+ err);
      console.log("success deleted one athlete", results);
    }
  )

  },
}