const express = require('express');
const AppRoutes = require('./routes/index.js');

const app = express();
const port = process.env.port || 5000;

app.use(express.json());
app.use(AppRoutes); 

app.listen(port , console.log(`App is running in the port ${port}`));