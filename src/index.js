const express = require("express");
const jwt = require("jsonwebtoken");
const {authMiddleware} = require("./middleware");
const app = express();
app.use(express.json());

let USER_ID = 1;
let ORGANIZATION_ID = 1;
let BOIARD_ID = 1;
let ISSUES_ID = 1;
const USERS = [{
    id: 1,
    username: "Mehhul",
    password: "12345"
},
{
    id: 2,
    username: "Virat",
    password: "1212",
}];
const ORGANIZATIONS = [{
    id:1,
    title: "100xdevs",
    description: "asfddsf",
    admin: 1,
    members: [2]
}];
const BOIARDS = [{
    id:1,
    title: "webdev school",
    organizationId: 1 
}];

app.post("/signup",(req,res)=>{
    const username = req.body.username;
    const password = req.body.password;
    const userExists = USERS.find(user=> user.username == username);
    if(userExists){
        return res.status(403).json({
            message: "User with this username already exists"
        })
    }
    USERS.push({
        username: username,
        password: password,
        id: USER_ID++
    });
    res.json({
        message: "you have signed up"
    });
});
app.post("/signin",(req,res)=>{
    const username = req.body.username;
    const password = req.body.password;
    const userExists = USERS.find(user=> user.username == username && user.password == password);
    if(!userExists){
        return res.status(403).json({
            message: "Incorrect credentials"
        })
    }
    //  jwt token
    const token = jwt.sign({
        userId: userExists.id
    }, "mehhul123");

    res.json({
        token: token
    })
})
app.post("/organization", authMiddleware,(req,res)=>{
    const userID = req.userId;
    ORGANIZATIONS.push({
        id:ORGANIZATION_ID++,
        title: req,title,
        description: req,description,
        admin: userID,
        members: []
    });
    res.json({
        message: "organization created",
        id: ORGANIZATION_ID -1
    });
    
})
app.post("/add=member-to-org",authMiddleware, (req,res)=>{
    const userId = req.userId;
    const organizationId = req.body.organizationId;
    const memberUsername = req.body.username;

    const organization = ORGANIZATIONS.find(org => org.id === organizationId);

    if(!organization || organization.admin !== userId){
        res.status(404).json({
            message: "Either this org doesn't exist or you are not an admin of this org"
        });
        return;
    }
    const memberUser = USERS.find(user=> user.username === memberUsername);
    if(!memberUser){
         res.status(404).json({
            message: "No user with this username exists"
        });
        return;
    }
    organization.members = organization.members.push(memberUser.id);
    res.json({
        message: "New member added!"
    });
    
})
app.post("/board", (req,res)=>{
    
})
app.post("/issue", (req,res)=>{
    
})
// read
app.get("/organizations", authMiddleware, (req,res)=>{
    const userId = req.userId;
    const organizationId = parseInt(req.body.organizationId);
    const organization = ORGANIZATIONS.find(org => org.id === organizationId);

    if(!organization || organization.admin !== userId){
        res.status(404).json({
            message: "Either this org doesn't exist or you are not an admin of this org"
        });
        return;
    }
    
    res.json({
        organization: {
            ...organization,
            members: organization.members.map(memberId=>{
                const user = USERS.find(user=> user.id === memberId);
                return{
                    id: user.id,
                    username: user.username
                }
            })
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
app.delete("/members", (req,res)=>{
    const userId = req.userId;
    const organizationId = req.body.organizationId;
    const memberUsername = req.body.username;

    const organization = ORGANIZATIONS.find(org => org.id === organizationId);

    if(!organization || organization.admin !== userId){
        res.status(404).json({
            message: "Either this org doesn't exist or you are not an admin of this org"
        });
        return;
    }
    const memberUser = USERS.find(user=> user.username === memberUsername);
    if(!memberUser){
         res.status(404).json({
            message: "No user with this username exists"
        });
        return;
    }
    organization.members = organization.members.filter(user => user.id !== memberUser.id);
    res.json({
        message: "member deleted!"
    });
})

app.listen(3000, ()=>{
    console.log("app is running on 3000!");
});