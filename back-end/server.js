const express = require("express");
const session = require("express-session");
const app = express();
const { MongoClient } = require("mongodb");
const MongoStore = require("connect-mongo")(session);
const flash = require("connect-flash");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();

//db connect
let client;
async function main() {
  client = new MongoClient(process.env.DATABASE, {
    useUnifiedTopology: true,
  });

  try {
    // Connect to the MongoDB cluster
    await client.connect();
    // Make the appropriate DB calls
    exports.dbfunc = client.db();
    const PORT = process.env.PORT || 9000;
    app.listen(PORT, () => {
      console.log(`connected to port ${PORT}`);
    });
  } catch (e) {
    console.error(e);
  }
}
main().catch(console.error);

//for showing flash messages
app.use(flash());

//user routes
const userRoute = require("./routes/userRoute");

//middlewares
app.use(morgan("dev"));
//to be able to work with form data and json data
app.use(express.json());
app.use(bodyParser.json());
app.use(cors());

//session //maxAge is milliseconds*60seconds*60minutes*24hrs= 1day
let sessionOptions = session({
  secret: "jfldjfldfjeirueohkdhfkdf",
  store: new MongoStore({ client: client }),
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 1000 * 60 * 60 * 24, httpOnly: true },
});
app.use(sessionOptions);

//user routes
app.use("/api", userRoute);

module.exports = app;
