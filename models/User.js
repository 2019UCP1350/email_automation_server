const mongoose =require('mongoose');
const userSchema = new mongoose.Schema({
    email:{
        type:String,
        required : true,
        max:255,
        min: 6 
    },
    name:{
        type : String,
        required : true,
        min : 6,
        max: 255
    },
    
    password:{
        type:String,
        required: true,
       
    }, 

    isverified:{
        type:Boolean,
        default:false
    },

    emailList:{
        type:[Object],
        required:false
      
    }
 
    

}) ;
module.exports = mongoose.model('User',userSchema);