const mongoose = require('mongoose')

const url = "mongodb+srv://avichandraker:avinash01@cluster1.uwkt3rc.mongodb.net/chatapp001"

mongoose.connect(url).then(() => console.log("connected to DB")).catch((e) => console.log("error" , e))