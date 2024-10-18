import express from "express";

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  console.log("Request Received! on 5003");
  res.send({ msg: "5003" });
});

app.listen(5003, () => {
  console.log("Server started on PORT 5003");
});
