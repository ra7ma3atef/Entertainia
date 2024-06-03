const path = require('path');
const compression = require("compression")
const cookieParser = require('cookie-parser');
const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const cors = require('cors');

dotenv.config({ path: 'config.env' });
const ApiError = require('./utils/apiError');
const globalError = require('./middlewares/errorMiddleware');
const dbConnection = require('./config/database');
// Routes
const categoryRoute = require('./routes/categoryRoute');
const subCategoryRoute = require('./routes/subCategoryRoute');
const newsRoute = require('./routes/newsRoute');
const eventRoute = require('./routes/eventRoute');
const userRoute = require('./routes/userRoute');
const authRoute = require('./routes/authRoute');
const cartRoute = require('./routes/cartRoute');
const favoriteRoute = require('./routes/favoriteRoute');
//const bookingRoute = require('./routes/bookingRoute');
const couponRoute = require('./routes/couponRoute');
const reqRoute = require('./routes/requestRoutes');
const notRoute = require('./routes/noticeRoute');



// Connect with db
dbConnection();
//Vgc8FKgfNQGl3rEn
// express app
const app = express();
app.use(cors());
app.options('*', cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());



app.use(compression())


// Middlewares
app.use(express.static(path.join(__dirname, 'uploads')));

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
  console.log(`mode: ${process.env.NODE_ENV}`);
}

// Mount Routes
app.use('/api/v1/categories', categoryRoute);
app.use('/api/v1/subcategories', subCategoryRoute);
app.use('/api/v1/news', newsRoute);
app.use('/api/v1/events', eventRoute);
app.use('/api/v1/users', userRoute);
app.use('/api/v1/auth', authRoute);
app.use('/api/v1/cart',cartRoute);
app.use('/api/v1/favorite', favoriteRoute);
//app.use('/api/v1/booking', bookingRoute);
app.use('/api/v1/coupons', couponRoute);
app.use('/api/v1/booking', reqRoute);
app.use('/api/v1/notice', notRoute);




app.all('*', (req, res, next) => {
  next(new ApiError(`Can't find this route: ${req.originalUrl}`, 400));
});

// Global error handling middleware for express
app.use(globalError);

const PORT = process.env.PORT || 8000;
const server = app.listen(PORT, () => {
  console.log(`App running running on port ${PORT}`);
});

// Handle rejection outside express
process.on('unhandledRejection', (err) => {
  console.error(`UnhandledRejection Errors: ${err.name} | ${err.message}`);
  server.close(() => {
    console.error(`Shutting down....`);
    process.exit(1);
  });
});
