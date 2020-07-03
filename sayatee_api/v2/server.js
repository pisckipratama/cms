const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');

// load env vars and initial app
dotenv.config({ path: './lib/config/config.env' });
const app = express();

// import routes
const productRoutes = require('./components/products/productAPI');

// middleware setting
if (process.env.NODE_ENV === "development") {
  app.use(morgan('dev'));
}

// initial routes
app.use('/api/v2/products', productRoutes);

const PORT = process.env.PORT || 1337;

app.listen(PORT, () => console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`));