const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const app = express();
const port = 3000;

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.set("view engine", "ejs");

const mysql = require("mysql2");

const con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "rootroot",
  database: "review_db",
});

// cssファイルの取得
app.use(express.static("assets"));

// index.ejsで使用
app.get("/", (req, res) => {
  const sql = "select * from personas";
  con.query(sql, function (err, result, fields) {
    if (err) throw err;
    res.render("index", {
      users: result
    });
  });
});

// データ新規追加
app.post('/', (req, res) => {
  const sql = "INSERT INTO personas SET ?"
  con.query(
    "INSERT INTO personas(username, age, rating, reason) VALUES (?, ?, ?, ?)",
    [
      req.body.username,
      req.body.age,
      req.body.rating,
      req.body.reason
    ],
    function (err, result, fields) {
    if (err) throw err;
    console.log(result);
    res.send('追加されました');
  });
});

// 更新フォームへ移動・edit.ejsで使用
app.get('/edit/:id', (req, res) => {
  const sql = "SELECT * FROM personas WHERE id = ?";
  con.query(sql, [req.params.id], function (err, result, fields) {
    if (err) throw err;
    res.render('edit', {
      users: result
    });
  });
});

// データ更新
app.post('/update/:id', (req, res) => {
  const sql = "UPDATE personas SET ? WHERE id = " + req.params.id;
  con.query(sql, req.body, function (err, result, fields) {
    if (err) throw err;
    console.log(result);
    res.redirect('/');
  });
});


app.listen(port, () => console.log(`Example app listening on port ${port}!`));
