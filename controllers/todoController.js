const Todo = require('../models/todo');
const { validateTodoInput } = require('../utils/validation');

class TodoController {
  static async createTodo(req, res) {
    try {
      validateTodoInput(req.body);
      const todo = await Todo.create(req.body);
      res.status(201).json(todo);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  static async getTodo(req, res) {
    try {
      const todo = await Todo.findByPk(req.params.id);
      if (!todo) {
        return res.status(404).json({ error: 'Todo not found' });
      }
      res.json(todo);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async updateTodo(req, res) {
    try {
      const todo = await Todo.findByPk(req.params.id);
      if (!todo) {
        return res.status(404).json({ error: 'Todo not found' });
      }
      const updated = await todo.update(req.body);
      res.json(updated);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
}

module.exports = TodoController;
