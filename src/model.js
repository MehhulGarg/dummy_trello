const mongoose = require("mongoose");
const path = require("path");

require("dotenv").config({
  path: path.resolve(__dirname, "../.env"),
});
// const uri = process.env.MONGO_URI;
mongoose.connect(process.env.MONGO_URI).then(()=>{
    console.log("mongodb connected");
}).catch(err => console.log("error",err));


const userSchema = mongoose.Schema({
    username: String,
    password: String
});

const organizationSchema = mongoose.Schema({
    title: String,
    description: String,
    admin: mongoose.Types.ObjectId,
    members: [mongoose.Types.ObjectId]
});
const organizationModel = mongoose.model("organizations", organizationSchema);
const userModel = mongoose.model("users", userSchema);

module.exports = {
    userModel,
    organizationModel
}