const express = require("express");
const http = require("http");
const path = require("path");

const {notFound, expressErrorHandler} = require("./modules/errorHandler");
const Routes = require('./routes/router')
const app = express();
app.use(express.static(path.join(__dirname, 'public')))

app.use(express.json({limit: "50mb"}));
app.use(express.urlencoded({extended: false, limit: "50mb"}));

app.use(Routes)

const mongoose = require('mongoose')
mongoose.connect('mongodb://127.0.0.1:27017/TaskManager', (error) => {
    if (!error) console.log('connect to db')
})

app.use(notFound)
app.use(expressErrorHandler)

http.createServer(app).listen(3500, () => {
    console.log("server is run");
});
