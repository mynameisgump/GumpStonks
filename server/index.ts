import express from "express";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("Express + TypeScript Server");
});

app.get("/about", (req, res) => {
  res.send("about");
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
