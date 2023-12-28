const mongoose = require('mongoose')


const userSchema = mongoose.Schema({
          name : {
                    type : String,
                    required : true,
          },
          email : {
                    type : String,
                    required : true,
                    unique : true
          },
          password : {
                    type : String,
                    required : true,
          },
          token : {
                    type : String,
                    
          }
})


const users = mongoose.model("users" , userSchema);


module.exports  = users