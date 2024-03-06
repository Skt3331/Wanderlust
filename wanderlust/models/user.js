
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passlomo=require("passport-local-mongoose");
const userSchema =new Schema({
    email:
    {
        type:String,
        required:true
    },

})
userSchema.plugin(passlomo);
module.exports=mongoose.model('User',userSchema);