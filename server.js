const express = require('express');
const mongoose = require('mongoose');
const app = express();
const cors = require('cors');
app.use(express.json());
app.use(cors()); 

mongoose.connect('mongodb://localhost:27017/')
.then(() => {
    console.log('Connected to MongoDB');
})
.catch((error) => {
    console.error('Error connecting to MongoDB:', error);
});

const todoSchema = new mongoose.Schema({
    title: {
        required: true,
        type: String
    },

    description: String
});


const todoModel = mongoose.model('Todo', todoSchema);


app.post('/todos', async(req, res) => {
    const {title, description} = req.body;

    try {
        const newTodo = new todoModel({title, description});
        await newTodo.save();
        res.status(201).json(newTodo);
    } catch (error) {
       console.log(error);
        res.status(500).json({ message: 'Error creating todo' }); 
    }
    
    
})  



app.get('/todos', async(req, res) => {
    const todos = await todoModel.find().then((todos) => {
        res.status(200).json(todos);
    }).catch((error) => {
        console.log(error);
        res.status(500).json({ message: 'Error getting todos' });
    })
})

app .put('/todos/:id', async(req, res) => {
    try {
    const id = req.params.id;
    const {title, description} = req.body;
    const updatedTodo = await todoModel.findByIdAndUpdate(id, {title, description}, {new: true});
    if(!updatedTodo){
        return res.status(404).json({ message: 'Todo not found' });
    }
    
    
        res.json(updatedTodo);
 } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Error updating todo' });
    }
})

app.delete('/todos/:id', async(req, res) => {
    try {
        const id = req.params.id;
        const deletedTodo = await todoModel.findByIdAndDelete(id);
        if(!deletedTodo){
            return res.status(404).json({ message: 'Todo not found' });
        }
        res.json(deletedTodo);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Error deleting todo' });
    }
})



const port = 1800;
app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});