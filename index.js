const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();

/* configure body-parser */
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

const { auth_route, user_route, product_route, cart_route, order_route } = require('./routes');

app.use('/api/auth', auth_route);
app.use('/api/users', user_route);
app.use('/api/products', product_route);
app.use('/api/carts', cart_route);
app.use('/api/orders', order_route);

const dbConfig = require('./config/db-config');

mongoose.connect(dbConfig.url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => {
    console.log("Successfully connected to the database");
}).catch(err => {
    console.log('Could not connect to the database. Exiting now...', err);
    process.exit();
});

port = 8000



app.listen(port, () => {
    console.log("Server is listening on port" + port);
});