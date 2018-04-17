const mongoose = require("mongoose");
const schema = mongoose.Schema;

mongoose.connect('mongodb://jolaya182:marieo23@ds125618.mlab.com:25618/atheleteform',
  () => console.log("connected database to use atheleteSchema"))
const atheleteSchema = new schema({
FirstName: {type: String, required: true },
LastName: {type: String, required: true }, 
DateOfBirth: {type: Date, required: true },
Nationality: {type: String, required: true },
Location: {type: String, required: true },
Association: {type: String, required: true }, 
Team: {type: String, required: true }, 
Gender: {type: String, required: true },
Sports: {type: String, required: true }, 
About: {type: String, required: true },
Interests: {type: String, required: true },
Charities: {type: String, required: true },
SocialMediaHandles: {type: String, required: true },
Pets: {type: String, required: true },
DrinksAlcohol: {type: Boolean, required: true },
Married: {type: Boolean, required: true },
ProfileImage: {type: String, required: true } 
});
const athlete = mongoose.model("athlete",atheleteSchema );
module.exports = athlete; 
