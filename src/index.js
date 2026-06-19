const express = require("express");
const jwt = require("jsonwebtoken");
const {authMiddleware} = require("./middleware");
const {userModel, organizationModel} = require("./model");

const app = express();
app.use(express.json());

let USER_ID = 1;
let ORGANIZATION_ID = 1;
let BOIARD_ID = 1;
let ISSUES_ID = 1;


const BOIARDS = [{
    id:1,
    title: "webdev school",
    organizationId: 1 
}];

app.post("/signup",async (req,res)=>{
    const username = req.body.username;
    const password = req.body.password;
    const userExists = await userModel.findOne({
        username: username,
    })
    if(userExists){
        return res.status(411).json({
            message: "User with this username already exists"
        })
    }
    const newUser = await userModel.create({
        username: username,
        password: password
    });
    res.json({
        message: "you have signed up"
    });
});
app.post("/signin", async (req,res)=>{
    const username = req.body.username;
    const password = req.body.password;
    const userExists = await userModel.findOne({
        username: username,
        password: password
    });
    if(!userExists){
        return res.status(403).json({
            message: "Incorrect credentials"
        })
        return;
    }
    //  jwt token
    const token = jwt.sign({
        userId: userExists.id
    }, "mehhul123");

    res.json({
        token: token
    })
})
app.post("/organization", authMiddleware,async (req,res)=>{
    const userID = req.userId;
    const newOrg = await organizationModel.create({
        title: req.body.title,
        description: req.body.description,
        admin: userID,
        members: []
    });

    res.json({
        message: "organization created",
        id: newOrg._id
    });
    
})
app.post("/add-member-to-org",authMiddleware, async (req,res)=>{
    const userId = req.userId;
    const organizationId = req.body.organizationId;
    const memberUsername = req.body.username;

    const organization = await organizationModel.findOne({
        _id: organizationId
    });

    if(!organization || organization.admin.toString() !== userId){
        res.status(411).json({
            message: "Either this org doesn't exist or you are not an admin of this org"
        });
        return;
    }
    const memberUser = await userModel.findOne({
        username: memberUsername
    });
    if(!memberUser){
         res.status(404).json({
            message: "No user with this username exists"
        });
        return;
    }

    // await organization.updateOne({
    //     _id: organizationId
    // },{
    //     $push:{
    //         members: memberUser._id
    //     }
    // });
    organization.members.push(memberUser._id);
    await organization.save();
    res.json({
        message: "New member added!"
    });
    
})
app.post("/board", (req,res)=>{
    
})
app.post("/issue", (req,res)=>{
    
})
// read
app.get("/organizations", authMiddleware, async (req,res)=>{
    const userId = req.userId;
    const organizationId = req.query.organizationId;

     const organization = await organizationModel.findOne({
        _id: organizationId
    });

    if(!organization || organization.admin.toString() !== userId){
        res.status(411).json({
            message: "Either this org doesn't exist or you are not an admin of this org"
        });
        return;
    }
    
    const members = await userModel.find({
        _id: organization.members
    });
    res.json({
        organization: {
            title: organization.title,
            discription: organization.description,
            members: members.map(m => ({
                username: m.username,
                id: m._id
            }))
        }
    })


})

app.get("/boards", (req,res)=>{
    
})
app.get("/issues", (req,res)=>{
    
})
app.put("/issues", (req,res)=>{
    
})

// delete
app.delete("/members", authMiddleware ,async(req,res)=>{
    const userId = req.userId;
    const organizationId = req.query.organizationId;
    const memberUsername = req.body.username;

     const organization = await organizationModel.findOne({
        _id: organizationId
    });

    if(!organization || organization.admin.toString() !== userId){
        res.status(411).json({
            message: "Either this org doesn't exist or you are not an admin of this org"
        });
        return;
    }
    const memberUser = await userModel.findOne({
        username: memberUsername
    });
    if(!memberUser){
         res.status(404).json({
            message: "No user with this username exists"
        });
        return;
    }
    // await organizationModel.updateOne({
    //     _id: organizationId
    // }, {
    //     "$pullAll":{
    //         members: memberUser._id
    //     }
    // });
    organization.members = organization.members.filter(x => x.toString() !== memberUser._id);
    await organization.save();
    res.json({ 
        message: "member deleted!"
    });
})

app.listen(3000, ()=>{
    console.log("app is running on 3000!");
});