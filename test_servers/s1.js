import express from "express";

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  console.log("Request Received! on 5001");
  res.json({ msg: "5001" });
});

app.get("/other", (req, res) => {
  console.log("Request Received! on 5001");
  res.json({ msg: "5001 - other" });
});

app.listen(5001, () => {
  console.log("Server started on PORT 5001");
});
