const express = require("express");
const app = express();
const {port, databaseURL, sessionSecret, baseURL} = require('./config.js');
require('./utils/database_connect');
const logins = require('./models/login');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const cookieParser = require('cookie-parser');
const methodOverride = require('method-override');
const cors = require('cors');
const engine = require('ejs-mate');
const path = require('path');
const {addRoleID} = require("./middlewares/common");
const cron = require('node-cron');
const {clientURL} = require('./config.js');

const isProduction = process.env.NODE_ENV === 'production' || /^https:\/\//i.test(baseURL || '');
const allowedOrigins = [
    clientURL,
    'http://localhost:5173',
    'http://127.0.0.1:5173'
].filter(Boolean);

/* SERVER CONFIGURATIONS */
app.set('trust proxy', 1);
app.use(cors({
    origin: allowedOrigins,
    credentials: true
}));
// app.options('*', cors({
//     origin: [clientURL, 'http://127.0.0.1:5173'],
//     credentials: true
// }));
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());
app.use(methodOverride('_method'));
app.set('view engine', "ejs");
app.engine("ejs", engine);
app.use(express.static(path.join(__dirname, 'public')));


/* SESSION STORE */
const store = new MongoDBStore({
    uri: databaseURL,
    collection: 'sessionStore'
});


/* SESSION & COOKIE SETUP */
app.use(session({
    secret: sessionSecret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week,
        sameSite: isProduction ? 'none' : 'lax',
        secure: isProduction
    },
    store: store
}));


/* PASSPORT SETUP */
const passport = require('passport');
const LocalStrategy = require('passport-local');

passport.use('passport-local', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'pass'
}, logins.authenticate()));
app.use(passport.initialize({}));
app.use(passport.session({}));
passport.serializeUser(logins.serializeUser());
passport.deserializeUser(logins.deserializeUser());


/* MIDDLEWARES */
app.use(addRoleID);
app.use((req, res, next) => {
    res.locals.userRoleID = req.session.userRoleID || null;
    res.locals.userDet = req.session.userDet || null;
    res.locals.user = req.user;
    next();
});


/* HOME ROUTE */
app.get('/', (req, res) => {
    res.json({
        message: "Jai shree ram!",
        user: req.user || null,
        userRoleID: req.session.userRoleID || null,
        userDet: req.session.userDet || null,
    });
});

const {stateUTList, cityMap} = require('./utils/state_city_provider');
app.get('/state-list', (req, res) => {
    res.json(stateUTList);
});

app.get('/city/:state', (req, res) => {
    const {state} = req.params;
    res.json(cityMap[state] || []);
});

app.get('/terms', (req, res) => {
    res.json({
        title: 'Terms and Conditions',
        message: 'Terms content should be served by the React frontend.'
    });
});


/* ROUTER CONFIGURATION */
const authRouter = require('./routes/auth');
const riderRouter = require('./routes/rider');
const providerRouter = require('./routes/provider');
const propertyRouter = require('./routes/property');
const bookingRouter = require('./routes/booking');
const reviewRouter = require('./routes/review');
const adminRouter = require('./routes/admin');
const contactRouter = require('./routes/contact');
const messagesRouter = require('./routes/messages');

    app.use('/auth', authRouter);
    app.use('/rider', riderRouter);
    app.use('/provider', providerRouter);
    app.use('/property', propertyRouter);
    app.use('/booking', bookingRouter);
    app.use('/review', reviewRouter);
    app.use('/admin', adminRouter);
    app.use('/contact', contactRouter);
    app.use('/messages', messagesRouter);

app.use((req, res) => {
    res.status(404).json({error: 'Route not found'});
});

app.use((err, req, res, next) => {
    console.error(err);
    res.status(err.status || 500).json({
        error: err.message || 'Internal server error'
    });
});


/* LISTENING TO PORT */
app.listen (port, () => {
    console.log("Listening to port : " + port);
});

/* CRON JOBS */
const {fetchTopProperties} = require('./utils/cron_jobs');

cron.schedule('0 0 * * * *', () => {
    fetchTopProperties();
}, {});
