const Environment = require('./config/environment');
const DatabaseConfig = require('./config/database');
const createApp = require('./app');

/**
 * Server Entry Point
 * Initializes database and starts the Express server
 */
async function startServer() {
    try {
        // Validate environment variables
        Environment.validate();

        // Connect to database
        const dbConfig = new DatabaseConfig();
        await dbConfig.connect();

        // Create Express app
        const app = createApp();

        // Start server
        const PORT = Environment.PORT;
        app.listen(PORT, () => {
            console.log(`🚀 Server running on http://localhost:${PORT}`);
            console.log(`📊 Environment: ${Environment.NODE_ENV}`);
            console.log(`✅ Backend ready to accept requests`);
        });

        // Graceful shutdown
        process.on('SIGTERM', async () => {
            console.log('SIGTERM signal received: closing HTTP server');
            await dbConfig.disconnect();
            process.exit(0);
        });

        process.on('SIGINT', async () => {
            console.log('\nSIGINT signal received: closing HTTP server');
            await dbConfig.disconnect();
            process.exit(0);
        });

    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
}

// Start the server
startServer();
