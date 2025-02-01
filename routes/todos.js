const express = require('express');
const router = express.Router();
const todoPromise = require('../models/todo');
const Redis = require('redis');

// Create Redis client with proper error handling
const client = Redis.createClient({
    url: 'redis://localhost:6379'
});

// Connect to Redis
(async () => {
    try {
        await client.connect();
        console.log('Redis connected successfully');
    } catch (error) {
        console.error('Redis connection error:', error);
    }
})();

// Get all todos
router.get('/', async (req, res) => {
    try {
        // Check cache first
        const cachedTodos = await client.get('todos');
        if (cachedTodos) {
            return res.json(JSON.parse(cachedTodos));
        }

        const Todo = await todoPromise;
        const todos = await Todo.findAll();
        
        // Set cache
        await client.setEx('todos', 3600, JSON.stringify(todos));
        res.json(todos);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Create todo
router.post('/', async (req, res) => {
    try {
        const Todo = await todoPromise;
        const todo = await Todo.create(req.body);
        await client.del('todos'); // Invalidate cache
        res.status(201).json(todo);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Update todo
router.put('/:id', async (req, res) => {
    try {
        const Todo = await todoPromise;
        const todo = await Todo.findByPk(req.params.id);
        if (todo) {
            await todo.update(req.body);
            await client.del('todos'); // Invalidate cache
            res.json(todo);
        } else {
            res.status(404).json({ error: 'Todo not found' });
        }
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Delete todo
router.delete('/:id', async (req, res) => {
    try {
        const Todo = await todoPromise;
        const todo = await Todo.findByPk(req.params.id);
        if (todo) {
            await todo.destroy();
            await client.del('todos'); // Invalidate cache
            res.json({ message: 'Todo deleted' });
        } else {
            res.status(404).json({ error: 'Todo not found' });
        }
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;