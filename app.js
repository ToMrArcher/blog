// Setup
const { response } = require('express');
var express = require('express');
var app = express();

var bodyParser = require('body-parser');

var urlencodedParser = bodyParser.urlencoded({ extended: false })

var mysql = require('mysql');
const { json } = require('body-parser');

var con = mysql.createConnection({
  host: "127.0.0.1",
  user: "root",
  password: "Narnia12321232!",
  database: "blog"
});

app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

con.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
});


// Routes
app.get("/", (req, res) => {
    res.render("index");
});

app.get("/blog", (req, res) => {
    var output = "";
    con.query("SELECT * FROM posts", function (err, result, fields) {
        if (err) throw err;
        for(var i = 0; i < result.length; i++){
            output += result[i].Title + "<br>" + result[i].Body + "<br>" + result[i].Date + "<br><br>";
        }
        res.render("blog", {output: output});
    });
});

app.get("/newblog", (req, res) => { 
    res.render("newblog");
});

app.post("/newblog", urlencodedParser, (req, res) =>{
    var title = req.body.title;
    var body = req.body.text;
    con.query(`INSERT INTO posts (Title, Body, Date) VALUES ("${title}", "${body}", CURDATE())`);
    res.redirect("blog");
});

// Listen
app.listen(3000, () => {
    console.log('Server listing on 3000');
});