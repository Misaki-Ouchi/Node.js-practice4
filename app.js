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
  multipleStatements: true,
});

// cssファイルの取得
app.use(express.static("assets"));

// データ取得
app.get("/", (req, res) => {
  // デフォルトデータ
  const def = "SELECT * from personas ORDER BY id;";

  // ソート機能（星の数） DESC: 降順、ASC: 昇順（デフォルト）
  const desc = "SELECT * from personas ORDER BY rating DESC;";
  const asc = "SELECT * from personas ORDER BY rating ASC;";

  // 絞り込み機能（星の数）
  const rate5 = "SELECT * from personas WHERE 5 = rating;";
  const rate4 = "SELECT * from personas WHERE 4 = rating;";
  const rate3 = "SELECT * from personas WHERE 3 = rating;";
  const rate2 = "SELECT * from personas WHERE 2 = rating;";
  const rate1 = "SELECT * from personas WHERE 1 = rating;";

  con.query(
    def + desc + asc + rate5 + rate4 + rate3 + rate2 + rate1,
    function (err, results, fields) {
      if (err) throw err;
      res.render("index", {
        users: results[0],
        usersDesc: results[1],
        usersAsc: results[2],
        usersRate5: results[3],
        usersRate4: results[4],
        usersRate3: results[5],
        usersRate2: results[6],
        usersRate1: results[7]
      });
    }
  );
});

// データ新規追加
app.post("/", (req, res) => {
  const sql = "INSERT INTO personas SET ?";
  con.query(
    "INSERT INTO personas(username, age, rating, reason) VALUES (?, ?, ?, ?)",
    [req.body.username, req.body.age, req.body.rating, req.body.reason],
    function (err, result, fields) {
      if (err) throw err;
      console.log(result);
      res.send("追加されました");
    }
  );
});

// 更新フォームへ移動・edit.ejsで使用
app.get("/edit/:id", (req, res) => {
  const sql = "SELECT * FROM personas WHERE id = ?";
  con.query(sql, [req.params.id], function (err, result, fields) {
    if (err) throw err;
    res.render("edit", {
      users: result,
    });
  });
});

// データ更新
app.post("/update/:id", (req, res) => {
  const sql = "UPDATE personas SET ? WHERE id = " + req.params.id;
  con.query(sql, req.body, function (err, result, fields) {
    if (err) throw err;
    console.log(result);
    res.redirect("/");
  });
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
