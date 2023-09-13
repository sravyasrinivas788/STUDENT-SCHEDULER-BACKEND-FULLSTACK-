const express = require("express");
const fetchUser = require("../middleware/fetchUser");
const router = express.Router();
const List = require("../models/List");
const { body, validationResult } = require('express-validator');
const Task = require("../models/Task");

// ROUTES FOR LISTS

// ROUTE-1---->getting all the lists of the user

router.get('/getlists', fetchUser, async (req, res) => {
    try {
        const lists = await List.find({ user: req.user.id });
        res.json(lists);
    } catch (error) {
        res.status(500).send("Internal server error")
    }
})

// ROUTE-2---->adding a list 

router.post('/addlist', fetchUser, [
    body('title', 'Enter a valid title').isLength({ min: 2 }),
], async (req, res) => {
    try {
        const { title } = req.body;  //destructuring 
        const errors = validationResult(req);    //validating using express validator
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const list = new List({
            title, user: req.user.id   //Creating a new object of Lis model 
        })
        const savedList = await list.save();
        res.json(savedList);


    } catch (error) {
        res.status(500).send("Internal server error");
    }
})

//ROUTE-3----->updating a list

router.put('/updatelist/:id', fetchUser, async (req, res) => {   //put request is usually used for updating

    const { title } = req.body;  //destructuring

    try {

        const newList = {};  //Creating a new note
        if (title) { newList.title = title };  //if user has given title in the request then insert that title in the newNote

        //Finding the notes to be updated
        let list = await List.findById(req.params.id);   //finding the note using findById method 

        if (!list) {  //checking if the note exist or not
            return res.status(404).send("Not found");
        }

        //Validating the user so that the logged in user can only update his or her note and can't tamper the notes of other people

        if (req.user.id !== list.user.toString()) {  //Matching the existing user id with the logged in user id
            return res.status(401).send("Not allowed");
        }

        //if both the above conditions are checked then we will update the note

        list = await List.findByIdAndUpdate(req.params.id, { $set: newList }, { new: true });
        res.json(list);
    } catch (error) {
        res.status(500).send("Internal server error");
    }
})


//ROUTE-4----->deleting a list

router.delete('/deletelist/:id', fetchUser, async (req, res) => {

    try {

        //first deleting all the tasks of the list 

        //finding the tasks 
        const tasks = await Task.find({ listId: req.params.id });
       


        //deleting the tasks
        for(let i=0;i<tasks.length;i++){
            let task=await Task.findByIdAndDelete(tasks[i]._id);
            res.json("The task deleted of the list",task);
        }



        //Finding the list to be updated
        let list = await List.findById(req.params.id);   //finding the note using findById method 

        if (!list) {  //checking if the list exist or not
            return res.status(404).send("Not found")
        }

        //Validating the user so that the logged in user can only delete his or her list and can't tamper the list of other people

        if (req.user.id !== list.user.toString()) {  //Matching the existing user id with the logged in user id
            return res.status(401).send("Not allowed");
        }

        list = await List.findByIdAndDelete(req.params.id);
        res.json({ "Success": "List successfully deleted", list: list });
    } catch (error) {
        res.status(500).send("Internal server error");
    }

})

//ROUTES FOR TASKS

router.get('/:id/gettasks', async (req, res) => {
    try {
        const tasks = await Task.find({ listId: req.params.id });
        res.json(tasks);

    } catch (error) {
        res.status(500).send("Internal server error");
    }
})

router.post('/:id/addtask', [
    body('description', 'Enter a valid description of the task').isLength({ min: 5 }),
    body('dueDate', 'Enter a valid due date of the task').isDate()
], async (req, res) => {
    try {
        const { description, dueDate } = req.body;  //destructuring 
        const errors = validationResult(req);    //validating using express validator
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const task = new Task({
            description, dueDate, listId: req.params.id   //Creating a new object of Task model 
        })
        const savedTask = await task.save();
        res.json(savedTask);

    } catch (error) {
        res.status(500).send("Internal server error");
    }
})


router.put('/:id/updatetask/:taskId',async(req,res)=>{   //put request is usually used for updating

    const {description,dueDate}=req.body;  //destructuring

    try {
        
        const newTask={};  //Creating a new task

        if(description){newTask.description=description};
        if(dueDate){newTask.dueDate=dueDate};
    
        //Finding the task to be updated
        let task=await Task.findById(req.params.taskId);   //finding the task using findById method 
    
        if(!task){  //checking if the task exist or not
            return res.status(404).send("Not found") 
        }
    
        task=await Task.findByIdAndUpdate(req.params.taskId,{$set:newTask},{new:true});
        res.json(task);
    } catch (error) {
        res.status(500).send("Internal server error");
    }
})

router.delete('/deletetask/:taskId',async(req,res)=>{ 

    try {
        
        //Finding the task to be deleted
        let task=await Task.findById(req.params.taskId);   //finding the task using findById method 
    
        if(!task){  //checking if the task exist or not
            return res.status(404).send("Not found") 
        }
    
    
        task=await Task.findByIdAndDelete(req.params.taskId);
        res.json({"Success":"Task successfully deleted",task:task});
    } catch (error) {
        res.status(500).send("Internal server error");
    }

})

router.patch('/updatetaskstatus/:taskId',async(req,res)=>{ 

    try {
        
        //Finding the task
        let task=await Task.findById(req.params.taskId);   //finding the task using findById method 
    
        if(!task){  //checking if the task exist or not
            return res.status(404).send("Not found") 
        }
    
    
        task=await Task.findByIdAndUpdate(req.params.taskId,req.body,{
            new:true
        });
        res.json(task);
    } catch (error) {
        res.status(500).send("Internal server error");
    }

})

module.exports = router