// import express from "express"
//Note: generally we require express but if i want to import express like we import the packages of react
//so that we have to so some change in "package.json" file
//we have to add   "type": "module", under the "main":"index.js"....

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(express.urlencoded());
app.use(cors());

mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => {
        console.log("Db Connected")
    })
    .catch((error) => {
        console.log(error);
    });

//==============Schema===================
const userSchema = new mongoose.Schema({
    name: String,
    email: { type: String, unique: true, required: true },
    password: String
});

const User = mongoose.model('User', userSchema);


//=============================
// app.get('/', (req, res) => {
//     res.send("Hello I am from backend");
// });

//Routes
//===========================Login=============================
app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email: email }).exec();

        if (user) {
            if (password === user.password) {
                res.send({ message: "Login Successfully", user: user });
            } else {
                res.send({ message: "Password Didn't match" });
            }
        } else {
            res.send({ message: "User not Registered" });
        }
    } catch (err) {
        res.status(500).send({ error: err.message });
    }
});
//=====================================================================

 
//============================Getting some error because here uses callBack and mongoose 7 doesn;t support it========
// app.post('/register', (req,res) => {
//     const {name, email, password } = req.body
//     User.findOne({email:email}, (err, user) =>{
//         if(user){
//             res.send({message:"User already registered"})
//         }else{
//             const user = new User({
//                 name, 
//                 email,
//                 password
//             })
//             user.save(err => {
//                 if(err){
//                     res.send(err)
//                 }else{
//                     res.send({message : "Successfully Registered"})
//                 }
//             })
//         }
//     })

// })
//======end of callBack code======

//===============Register======================
//This is promises that supports mongoose 7 it will properly work
app.post('/register', async (req, res) => {
    const { name, email, password } = req.body;

    try {
        const user = await User.findOne({ email: email }).exec();

        if (user) {
            res.send({ message: "User already registered" });
        } else {
            const newUser = new User({
                name,
                email,
                password
            });

            await newUser.save();
            res.send({ message: "Successfully Registered, Please login Now" });
        }
    } catch (err) {
        res.status(500).send({ error: err.message });
    }
});
//===================================================================

app.listen(process.env.PORT, () => {
    console.log(`Server is running at port ${process.env.PORT}`);
});
