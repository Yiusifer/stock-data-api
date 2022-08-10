const app = require("express")();
const port = process.env.PORT || 8000;

app.get("/", (req, res) => {
  res.status(200).send("<h1>Hello World!</h1>");
})

app.get("/:ticker", (req, res) => {
  
})

app.listen(port, () => console.log(`Server is now running on port: ${port}`));