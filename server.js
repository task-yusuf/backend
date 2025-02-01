require('dotenv').config();
const express = require('express');
const cors = require('cors');
const sequelizePromise = require('./config/database');
const todoRoutes = require('./routes/todos');

// Error handling middleware
const errorHandler = (err, res) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something broke!' });
};

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use('/api/todos', todoRoutes);
app.use(errorHandler);

async function startServer() {
    try {
        const sequelize = await sequelizePromise;
        await sequelize.sync();
        console.log('Database connected successfully');

        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (error) {
        console.error('Unable to start server:', error);
    }
}

// Only start the server if we're not testing
if (process.env.NODE_ENV !== 'test') {
    startServer();
}

module.exports = app;