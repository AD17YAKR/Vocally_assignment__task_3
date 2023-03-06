const express = require('express');
const dotenv = require('dotenv');
const path = require('path');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const connectDB = require('./config/db');
const errorHandler = require('./middlewares/err');
const fileupload = require('express-fileupload');

// API Documentation
const swaggerUi = require('swagger-ui-express');
const swagerJSDoc = require('swagger-jsdoc');

// const swaggerDocument = require('./swagger.json');

//Security Enhancer Packages
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
const xss = require('xss-clean');
const rateLimit = require('express-rate-limit');
const hpp = require('hpp');
const cors = require('cors');

//Env Path
dotenv.config({ path: '.env' });

const app = express();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

//Cookie Parser
app.use(cookieParser());

//TODO: Import your controllers here
const user = require('./routes/auth');
const swaggerJSDoc = require('swagger-jsdoc');

//Connection to Database
connectDB();

if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

//File upload middleware
app.use(fileupload());

//Sanitize data
app.use(mongoSanitize());

//Set Security Headers
app.use(helmet());

//Prevent XSS attacks
app.use(xss());

//Rate Limiting
const limiter = rateLimit({
    windowMs: 10 * 60 * 1000, //10 mins
    max: 100
});
app.use(limiter);

//Prevent Param Pollution
app.use(hpp());

//Enable CORS
app.use(cors());

//set static folder to use to store QR while in dev environment
app.use(express.static(path.join(__dirname, 'public')));

//TODO: Create your Routers here
app.use('/api/v1/auth', user);
app.use(errorHandler);

// app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

const port = process.env.PORT || 7979;

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'ExpressJS ZAPPY task_3   ',
            version: '1.0.0'
        },
        servers: [
            {
                url: `http://localhost:${port}/api/v1`
            }
        ]
    },
    apis: ['./routes/auth.js']
};

const swaggerSpec = swaggerJSDoc(options);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get('/', (req, res) => {
    res.send('Welcome to the server');
});

const server = app.listen(
    port,
    console.log(
        `Server running in ${process.env.NODE_ENV} mode on ${port}`
    )
);

//Handle Unhandled promise rejection
process.on('unhandledRejection', (err, promise) => {
    console.log('Error : ', err.message);
    //Close Server and Exit Process
    server.close(() => process.exit(1));
});
