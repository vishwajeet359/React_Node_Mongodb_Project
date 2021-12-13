const express = require('express');
const User = require('../models/User');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fetchuser =require("../middleware/fetchuser")

const JWT_SECRET = "vishwajeet$boy"

// Route 1:create the user using :POST "/api/auth/createuser"
router.post('/createuser', [
    body('name', 'Enter your valid name').isLength({ min: 3 }),
    body('email', 'Enter your valid email').isEmail(),
    body('password', 'Password must be atlest 5 character').isLength({ min: 5 }),
], async (req, res) => {
    //If there are error return Bad request and the error
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    //check whether the user with this email exists already
    try {
        let user = await User.findOne({ email: req.body.email });
        if (user) {
            return res.status(400).json({ error: "Sorry a user with this email already exists" })
        }
        const salt = await bcrypt.genSalt(10);
        const secPass = await bcrypt.hash(req.body.password, salt);

        //create a new user
        user = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: secPass,
        });
        const data = {
            user: {
                id: user.id
            }
        }
        const authtoken = jwt.sign(data, JWT_SECRET);


        //res.json(user)
        res.json({ authtoken })
        //catch errors
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Some error occured");
    }

})
//Route 2: Authenticate a user using :POST "/api/auth/login"
router.post('/login', [
    body('email', 'Enter your valid email').isEmail(),
    body('password', 'Password can not be blank').exists(),
], async (req, res) => {
    //If there are error return Bad request and the error
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body; //Destruchering 
    try {
        let user=await User.findOne({email});
        if(!user){
            return res.status(400).json({error:"Please try to login correct"});
        }
        const passwordCompare = await bcrypt.compare(password,user.password);
        if(!passwordCompare){
            return res.status(400).json({error:"Please try to login correct"});
        }
        const data = {
            user: {
                id: user.id
            }
        }
        const authtoken = jwt.sign(data, JWT_SECRET);
        res.json({ authtoken })
    } catch (error) {
        console.error(error.message);
        res.status(500).send("External server error");
    }

})
//Route 3: Get loggedin User details using :POST "/api/auth/getuser".Login required
router.post('/getuser',fetchuser ,async (req, res) => {

try {
    userId = req.user.id;
    const user = await User.findById(userId).select("-password")
    res.send(user)
} catch (error) {
    console.error(error.message);
    res.status(500).send("External server error");
    
}
})
module.exports = router
