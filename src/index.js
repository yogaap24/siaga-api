const express = require("express");
const bodyParser = require("body-parser");
const pg = require("pg");
const router = require("./routes/routes.js");

const { Pool } = pg;
const app = express();
const PORT = 3000;

const pool = new Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: "siaga-db",
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 5432,
  connectionString: process.env.DB_URL,
});

app.get("/", async (req, res) => {
  try {
    const client = await pool.connect();
    const result = await client.query("SELECT $1::text as message", [
      "Ini siaga-api",
    ]);
    const message = result.rows[0].message;
    res.send(message);
    client.release();
  } catch (err) {
    console.error(err);
    res.send("Error: " + err);
  }
});
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", router);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
