const mongoose = require('mongoose');

class DatabaseConfig {
    constructor() {
        this.uri = process.env.MONGODB_URI;
        this.options = {
            useNewUrlParser: true,
            useUnifiedTopology: true
        };
    }

    async connect() {
        try {
            await mongoose.connect(this.uri, this.options);
            console.log('Connected to MongoDB');
        } catch (error) {
            console.error('MongoDB connection error:', error);
            throw error;
        }
    }

    async disconnect() {
        await mongoose.disconnect();
        console.log('Disconnected from MongoDB');
    }
}

module.exports = DatabaseConfig;
