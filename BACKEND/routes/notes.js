const express = require('express');
const { body, validationResult } = require('express-validator');
const router = express.Router();
const fetchuser = require("../middleware/fetchuser")
const Note = require('../models/Note');
//Route 1: Get All The Notes using :GET "/api/notes/getuser".Login required
router.get('/fetchallnotes', fetchuser, async (req, res) => {
    try {
        const notes = await Note.find({ user: req.user.id });
        res.json(notes)
    } catch (error) {
        console.error(error.message);
        res.status(500).send("External server error");

    }

})
//Route 2: Add a new Notes using :POST "/api/notes/getuser".Login required
router.post('/addnotes', fetchuser, [
    body('title', 'Enter your valid title').isLength({ min: 3 }),
    body('description', 'description must be atlest 5 character').isLength({ min: 5 }),], async (req, res) => {
        try {

            const { title, description, tag } = req.body;  //Destructure
            //If there are error return Bad request and the error
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            const note = new Note({
                title, description, tag, user: req.user.id
            })
            const savedNote = await note.save()

            res.json(savedNote)
        } catch (error) {
            console.error(error.message);
            res.status(500).send("External server error");

        }

    })
    //Route 3: Update an existing Notes using :PUT "/api/note/updatenote".Login required
    router.put('/updatenote/:id', fetchuser, async (req, res) => {
    try {
    const{title,description,tag} = req.body;
    //Create newNote object
    const newNote = {};
    if(title){newNote.title = title};
    if(description){newNote.description = description};
    if(tag){newNote.tag = tag};

    //find the note to be updated and update it.
    let note =  await Note.findById(req.params.id);
    if(!note){return res.status(404).send("Not Found")}

    if(note.user.toString()!== req.user.id){
        return res.status(401).send("Not Allowed")
    }
    note = await Note.findByIdAndUpdate(req.params.id,{$set:newNote},{new:true})
    res.json(note);  
} catch (error) {
    console.error(error.message);
    res.status(500).send("External server error");
}
})

//Route 4: Delete an existing Notes using :DELETE "/api/note/deletenote".Login required
router.delete('/deletenote/:id', fetchuser, async (req, res) => {
    try {
    //find the note to be delete and delete it.
    let note =  await Note.findById(req.params.id);
    if(!note){return res.status(404).send("Not Found")}

    //Allow deletion only if user owns this Note

    if(note.user.toString()!== req.user.id){
        return res.status(401).send("Not Allowed")
    }
    note = await Note.findByIdAndDelete(req.params.id)
    res.json({"Success":"Note has been deleted",note:note});
} catch (error) {
    console.error(error.message);
    res.status(500).send("External server error"); 
}
})
module.exports = router