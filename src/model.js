const mongoose = require("mongoose");
mongoose.connect("mongodb+srv://mehulgargh:Emjee..1234@mycluster.m16mnl0.mongodb.net/trello-app-19june");


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