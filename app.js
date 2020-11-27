// Setup
const { response } = require('express');
var express = require('express');
var app = express();
var methodOverride = require('method-override');

var bodyParser = require('body-parser');

app.use(methodOverride("_method"));

var urlencodedParser = bodyParser.urlencoded({ extended: false })

var mysql = require('mysql');

var con = mysql.createConnection({
  host: "127.0.0.1",
  user: "root",
  password: "Narnia12321232!",
  database: "blog"
});

app.use(express.static('views'));

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
    con.query("SELECT * FROM posts ORDER BY id desc", function (err, result, fields) {
        if (err) throw err;
        res.render("blog", {result: result});
    });
});

app.get("/newblog", (req, res) => { 
    res.render("newblog");
});

app.post("/newblog", urlencodedParser, (req, res) =>{
    var title = req.body.title;
    var body = req.body.text;
    con.query(`INSERT INTO posts (Title, Body, Date) VALUES ("${title}", "${body}", CURDATE())`);
    res.redirect("/blog");
});

app.get("/posts/:id", (req, res) => {
    con.query(`SELECT * FROM posts WHERE ID = ${req.params.id}`, function(err, result, fields){
        if (err) throw err;
        res.render("post", {result: result[0]});
    });
});

app.delete("/posts/:id", (req, res) => {
    con.query(`DELETE FROM posts WHERE ID = ${req.params.id}`)
    res.redirect("/blog")
});

// Listen
app.listen(3000, () => {
    console.log('Server listing on 3000');
});