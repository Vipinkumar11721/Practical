require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const ExpressError = require('./utils/ExpressError.js');
const session = require('express-session');
const { MongoStore } = require('connect-mongo');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user.js');

const listingRouter = require('./routes/listing.js');
const reviewRouter = require('./routes/review.js');
const userRouter = require('./routes/user.js');

const app = express();

const dbUrl = process.env.ATLUSDB_URL;
if (!dbUrl) {
  console.error('FATAL: ATLUSDB_URL is not set in .env. Set it to your MongoDB Atlas connection string.');
  process.exit(1);
}

 const mongooseOptions = { serverSelectionTimeoutMS: 5000 };

async function connectWithRetry(maxAttempts = 2, delayMs = 3000) {
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      console.log(`MongoDB Atlas connection attempt ${attempt}/${maxAttempts}...`);
      await mongoose.connect(dbUrl, mongooseOptions);
      console.log('Connected to MongoDB Atlas');
      return;
    } catch (err) {
      console.error(`MongoDB connect attempt ${attempt} failed: ${err.message}`);
      if (attempt < maxAttempts) await new Promise((r) => setTimeout(r, delayMs));
    }
  }
  throw new Error(`Failed to connect to MongoDB Atlas after ${maxAttempts} attempts`);
}

connectWithRetry().then(() => {
  const store = new MongoStore({ 
    mongoUrl: dbUrl, 
    touchAfter: 24 * 3600 
  });
  store.on('error', (e) => console.error('SESSION STORE ERROR', e));

  app.set('view engine', 'ejs');
  app.set('views', path.join(__dirname, 'views'));
  app.engine('ejs', ejsMate);
  app.use(express.urlencoded({ extended: true }));
  app.use(methodOverride('_method'));
  app.use(express.static(path.join(__dirname, 'public')));

  app.use(session({ store, secret: process.env.SECRET || 'change_me', resave: false, saveUninitialized: true, cookie: { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000 } }));
  app.use(flash());

  app.use(passport.initialize());
  app.use(passport.session());
  passport.use(new LocalStrategy(User.authenticate()));
  passport.serializeUser(User.serializeUser());
  passport.deserializeUser(User.deserializeUser());

  app.use((req, res, next) => {
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    res.locals.currentUser = req.user;
    next();
  });

  app.use('/listings', listingRouter);
  app.use('/listings/:id/reviews', reviewRouter);
  app.use('/', userRouter);

  app.get('/', (req, res) => res.render('index', { what: 'best', who: 'me' }));

  app.use((req, res, next) => next(new ExpressError(404, 'Page not found')));

  app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    res.status(statusCode).render('error', { message: err.message || 'Something went wrong!' });
  });

  const PORT = process.env.PORT || 8080;
  app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
}).catch((err) => {
  console.error('FATAL: Unable to connect to MongoDB Atlas');
  console.error(err.message || err);
  console.error('Ensure ATLUSDB_URL is correct and your IP is whitelisted in Atlas Network Access.');
  process.exit(1);
});