import express from "express";
import cors from "cors";

const app = express();

app.use(cors({ methods: ["GET"], origin: "https://localhost:443" }));
app.use(express.json());

app.get("/", (req, res) => {
  console.log("Request Received! on 5002");
  res.send({ msg: "5002" });
});

app.get("/other", (req, res) => {
  console.log("Request Received! on 5002");
  res.json({ msg: "5002 - other" });
});

app.get("/health", (req, res) => {
  res.sendStatus(200);
});

app.listen(5002, () => {
  console.log("Server started on PORT 5002");
});
