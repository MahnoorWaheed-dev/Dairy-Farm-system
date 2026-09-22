require('dotenv').config();
const express = require('express');
const path = require('path');
const session = require('express-session');
const connectDB = require('./config/db');
const isAuth = require('./middleware/isAuth');
const dashboardController = require('./controllers/dashboardController');
const gardenRoutes = require('./routes/gardenRoutes');
const reportRoutes = require('./routes/reportRoutes');


const app = express();




// Connect Database
connectDB();






// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));



// Express Session
app.use(session({
    secret: process.env.SESSION_SECRET || 'mangrio_secret',
    resave: false,
    saveUninitialized: false
}));

// EJS & Public Setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

// --- MOUNT ROUTES ---
app.use('/', require('./routes/authRoutes'));
app.use('/shops', require('./routes/shopRoutes'));
// Mount routes
app.use('/person', require('./routes/personRoutes'));
// Mount routes
app.use('/garden', gardenRoutes);

app.use('/reports', reportRoutes);


// GET: Dashboard (Dynamic Data from Controller)
app.get('/dashboard', isAuth, dashboardController.getDashboard);

// Default Route
app.get('/', (req, res) => {
    res.redirect('/dashboard');
});

const PORT = process.env.PORT || 5000;  // Use Railway's PORT
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});







