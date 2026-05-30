const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// CONEXIÓN A LA BASE DE DATOS
const db = mysql.createConnection({
  host: "zephyr.proxy.rlwy.net",
  user: "root",
  password: "NWroHYpEgNGIQNMlUbPTnMiSUxTPvgfS",
  database: "railway",
  port: 16200
});

// ==========================================
// 1. RUTA: LOGIN
// ==========================================
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

// ==========================================
// 2. RUTA: MOSTRAR PRODUCTOS (GET)
// ==========================================
app.get("/productos", (req, res) => {
  db.query("SELECT * FROM productos", (err, results) => {
    if (err) return res.json([]);
    res.json(results);
  });
});

// ==========================================
// 3. RUTA: AGREGAR PRODUCTO NUEVO (POST) - ACTUALIZADO CON CATEGORÍA
// ==========================================
app.post("/productos", (req, res) => {
  // Aquí ya incluimos la categoria que viene de tu Flutter
  const { nombre, precio, stock, imagen, categoria } = req.body; 
  db.query(
    "INSERT INTO productos (nombre, precio, stock, imagen, categoria) VALUES (?, ?, ?, ?, ?)",
    [nombre, precio, stock, imagen, categoria],
    (err, result) => {
      if (err) return res.json({ success: false, error: err });
      res.json({ success: true, id: result.insertId });
    }
  );
});

// ==========================================
// 4. RUTA: EDITAR PRODUCTO EXISTENTE (PUT) - ACTUALIZADO CON CATEGORÍA
// ==========================================
app.put("/productos/:id", (req, res) => {
  const { id } = req.params;
  const { nombre, precio, stock, imagen, categoria } = req.body;
  db.query(
    "UPDATE productos SET nombre=?, precio=?, stock=?, imagen=?, categoria=? WHERE id=?",
    [nombre, precio, stock, imagen, categoria, id],
    (err, result) => {
      if (err) return res.json({ success: false, error: err });
      res.json({ success: true });
    }
  );
});
// ==========================================
// 5. RUTA: ELIMINAR PRODUCTO (DELETE)
// ==========================================
app.delete("/productos/:id", (req, res) => {
  const { id } = req.params;
  db.query("DELETE FROM productos WHERE id = ?", [id], (err, result) => {
    if (err) return res.json({ success: false });
    res.json({ success: true });
  });
});

// ==========================================
// CONFIGURACIÓN DEL SERVIDOR (SIEMPRE VA AL FINAL)
// ==========================================
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Servidor corriendo en puerto " + PORT);
});
