import express from "express";
import { Pool } from "pg";
import router from "./routes/routes";
import bodyParser from "body-parser";
import cors from "cors";

const app = express();
const PORT = 8082;

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
      "Hello world!",
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

app.use(express.json());

app.use("/api", router);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
