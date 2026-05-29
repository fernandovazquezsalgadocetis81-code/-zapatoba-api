const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// 🔥 CONEXIÓN A RAILWAY (usa tus datos)
const db = mysql.createConnection({
  host: "zephyr.proxy.rlwy.net",
  user: "root",
  password: "TU_PASSWORD",
  database: "railway",
  port: 16200
});

// LOGIN
app.post("/login", (req, res) => {
  const { correo, password } = req.body;

  db.query(
    "SELECT * FROM usuarios WHERE correo=? AND password=?",
    [correo, password],
    (err, results) => {
      if (err) return res.json({ success: false });

      if (results.length > 0) {
        res.json({ success: true, usuario: results[0] });
      } else {
        res.json({ success: false });
      }
    }
  );
});

// PRODUCTOS
app.get("/productos", (req, res) => {
  db.query("SELECT * FROM productos", (err, results) => {
    if (err) return res.json([]);
    res.json(results);
  });
});

// SERVER
app.listen(3000, () => {
  console.log("Servidor corriendo en puerto 3000");
});