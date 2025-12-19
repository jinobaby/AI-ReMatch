var express = require('express');
var mongoose = require('mongoose');
var dotenv = require('dotenv');
var cors = require('cors');
var { testOpenAIConnection } = require('./src/services/openaiService');

var app = express();

dotenv.config();

var serverStartTime = Date.now();

// MongoDB connection state tracking
var dbConnectionState = {
    status: 'disconnected',
    readyState: 0,
    lastConnected: null,
    lastError: null
};

// MongoDB connection event listeners
mongoose.connection.on('connected', () => {
    dbConnectionState.status = 'connected';
    dbConnectionState.readyState = mongoose.connection.readyState;
    dbConnectionState.lastConnected = new Date().toISOString();
    console.log('MongoDB connected successfully');
});

mongoose.connection.on('error', (err) => {
    dbConnectionState.status = 'error';
    dbConnectionState.readyState = mongoose.connection.readyState;
    dbConnectionState.lastError = err.message;
    console.error('MongoDB connection error:', err);
});

mongoose.connection.on('disconnected', () => {
    dbConnectionState.status = 'disconnected';
    dbConnectionState.readyState = mongoose.connection.readyState;
    console.log('MongoDB disconnected');
});

mongoose.connection.on('connecting', () => {
    dbConnectionState.status = 'connecting';
    dbConnectionState.readyState = mongoose.connection.readyState;
    console.log('MongoDB connecting...');
});

mongoose.connection.on('reconnected', () => {
    dbConnectionState.status = 'connected';
    dbConnectionState.readyState = mongoose.connection.readyState;
    dbConnectionState.lastConnected = new Date().toISOString();
    console.log('MongoDB reconnected');
});

mongoose.connect(process.env.MongoDB_URI)
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch((err) => {
        console.error('Error connecting to MongoDB:', err);
    })

// Middleware
app.use(express.json());
app.use(cors());

// Root-level health check endpoint
app.get('/health', async (req, res) => {
    try {
        // Checking MongoDB connection state
        var mongoStatus = 'disconnected';
        var mongoReadyState = mongoose.connection.readyState;
        
        // Map readyState to status
        if (mongoReadyState === 1) {
            mongoStatus = 'connected';
        } else if (mongoReadyState === 2) {
            mongoStatus = 'connecting';
        } else if (mongoReadyState === 3) {
            mongoStatus = 'disconnecting';
        } else {
            mongoStatus = 'disconnected';
        }

        // Check OpenAI connection
        var openaiStatus = 'unknown';
        var openaiModel = process.env.OPENAI_MODEL || 'gpt-4o-mini';
        
        if (process.env.OPENAI_API_KEY) {
            try {
                var isOpenAIConnected = await testOpenAIConnection();
                openaiStatus = isOpenAIConnected ? 'connected' : 'connection_failed';
            } catch (error) {
                openaiStatus = 'error';
            }
        } else {
            openaiStatus = 'not_configured';
        }

        // Determine overall health status
        var overallStatus = 'healthy';
        var httpStatus = 200;

        if (mongoStatus !== 'connected') {
            overallStatus = 'unhealthy';
            httpStatus = 503;
        } else if (openaiStatus !== 'connected') {
            overallStatus = 'degraded';
            httpStatus = 200;
        }

        var uptimeSeconds = Math.floor((Date.now() - serverStartTime) / 1000);

        var healthResponse = {
            status: overallStatus,
            timestamp: new Date().toISOString(),
            environment: process.env.NODE_ENV || 'development',
            services: {
                mongodb: {
                    status: mongoStatus,
                    readyState: mongoReadyState,
                    lastConnected: dbConnectionState.lastConnected,
                    lastError: dbConnectionState.lastError
                },
                openai: {
                    status: openaiStatus,
                    model: openaiModel
                }
            },
            uptime: uptimeSeconds
        };

        res.status(httpStatus).json(healthResponse);
    } catch (error) {
        res.status(503).json({
            status: 'unhealthy',
            timestamp: new Date().toISOString(),
            error: error.message
        });
    }
});

var AdminRouter = require('./src/routes/AdminRouter');
var UserRouter = require('./src/routes/UserRouter');
var ResumeRouter = require('./src/routes/ResumeRouter'); 

app.use('/Admin', AdminRouter);
app.use('/User', UserRouter);
app.use('/Resume', ResumeRouter); 

// Error handling middleware for multer
app.use((error, req, res, next) => {
    if (error.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ 
            success: false, 
            message: 'File size too large. Maximum 2MB per file.' 
        });
    }
    if (error.code === 'LIMIT_FILE_COUNT') {
        return res.status(400).json({ 
            success: false, 
            message: 'Too many files. Maximum 5 files allowed.' 
        });
    }
    next(error);
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
