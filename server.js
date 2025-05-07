require('dotenv').config();

const express = require('express');
const { connect } = require('./src/config/db.config');
const indexRouter = require('./src/routes/index.router');
const corsMiddleware = require('./src/middlewares/cors.middleware');
const app = express();

app.use(corsMiddleware);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/**
 * Main entry point for the application.
 */
connect()
    .then(() => {
        app.use('/api', indexRouter);
        
        app.use((req, res) => {
            res.status(404).json({ message: 'Not Found' });
        });
        
        app.use((err, req, res, next) => {
            console.error(err.stack);
            res.status(500).json({ message: 'Internal Server Error' });
        });
        
        const port = process.env.PORT || 3000;
        app.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        });
    })
    .catch((error) => {
        console.error('Error connecting to the database:', error);
        process.exit(1);
    });


process.on('SIGINT', async () => {
    const { disconnect } = require('./src/config/db.config');
    await disconnect();
    process.exit(0);
    });