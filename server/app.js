const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const routes = require("./routes");

app.set("port", process.env.API_PORT || 3000);
app.use("/assets", express.static("./www/assets/"));
app.use(bodyParser.json({ limit: '5mb' }));
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,PATCH,OPTIONS");
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization, Content-Length, X-Requested-With, X-Session-Id, X-Interface-Id");
    res.sendStatus(200);
  } else {
    next();
  }
});

routes(app);

app.listen(app.get("port"), () => {
  console.log(`Server started: http://localhost:${app.get("port")}/`);
});
