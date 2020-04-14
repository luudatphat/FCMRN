var express     = require("express");
var path        = require('path');
var dotenv      = require('dotenv').config();
var webpush     = require('web-push');
var bodyPares   = require('body-parser');

var app     = express();
app.set("view engine", "ejs");
app.set("views", "./views"); 
app.use(express.static(path.join(__dirname, 'public'))); 

app.get("/", function(req, res){
    
    res.render("index", {title: 'Push App'});
});


const port = process.env.POST;
app.listen(port, () => console.log(`Serve connet port ${port}`));