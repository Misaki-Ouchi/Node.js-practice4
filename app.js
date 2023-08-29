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
  multipleStatements: true
});

// cssファイルの取得
app.use(express.static("assets"));

// データ取得
app.get("/", (req, res) => {
  // デフォルトデータ
  const sql = "SELECT * from personas";
  con.query(sql, function (err, result, fields) {
    if (err) throw err;
    res.render("index", {
      users: result
    });
  });
});

// ソート機能（星の数） DESC: 降順、ASC: 昇順（デフォルト）
app.get("/", (req, res) => {
  const desc = "SELECT * from personas ORDER BY rating DESC";
  const asc = "SELECT * from personas ORDER BY rating asc";
  con.query(desc, function (err, result, fields) {
    if (err) throw err;
    res.render("index", {
      usersDesc: result
    });
  });
  con.query(asc, function (err, result, fields) {
    if (err) throw err;
    res.render("index", {
      usersAsc: result
    });
  });
});

// 絞り込み機能（星の数）
app.get("/", (req, res) => {
  const rate5 = "SELECT * from personas WHERE 5 = rating";
  const rate4 = "SELECT * from personas WHERE 4 = rating";
  const rate3 = "SELECT * from personas WHERE 3 = rating";
  const rate2 = "SELECT * from personas WHERE 2 = rating";
  const rate1 = "SELECT * from personas WHERE 1 = rating";
  con.query(rate5, function (err, result, fields) {
    if (err) throw err;
    res.render("index", {
      usersRate5: result
    });
  });
  con.query(rate4, function (err, result, fields) {
    if (err) throw err;
    res.render("index", {
      usersRate4: result
    });
  });
  con.query(rate3, function (err, result, fields) {
    if (err) throw err;
    res.render("index", {
      usersRate3: result
    });
  });
  con.query(rate2, function (err, result, fields) {
    if (err) throw err;
    res.render("index", {
      usersRate2: result
    });
  });
  con.query(rate1, function (err, result, fields) {
    if (err) throw err;
    res.render("index", {
      usersRate1: result
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
