const mongoose = require("mongoose");
const schema = mongoose.Schema;

mongoose.connect('mongodb://jolaya182:marieo23@ds125618.mlab.com:25618/atheleteform',
  () => console.log("connected database to use sportSchema"))
const sportSchema = new schema({
sports: {type: String, required: true },
 
});
const sport = mongoose.model("sport",sportSchema );
module.exports = sport; 
