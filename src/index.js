import express from "express";

const app = express();
const PORT = 8082;
app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET,PUT,POST,DELETE,PATCH,OPTIONS"
  );
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
