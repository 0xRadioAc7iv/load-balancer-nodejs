import express from "express";

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  console.log("Request Received! on 5002");
  res.send({ msg: "5002" });
});

app.listen(5002, () => {
  console.log("Server started on PORT 5002");
});
