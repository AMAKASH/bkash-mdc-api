//Imports
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });
require("express-async-errors");
const express = require("express");
const bodyParser = require("body-parser");
const cron = require("node-cron");

//extra security packages
const heltmet = require("helmet");
const cors = require("cors");
const xss = require("xss-clean");
const rateLimiter = require("express-rate-limit");
const logger = require("morgan");

const globalConfigurations = {
  submissions_on: true,
  submission_limit: 3,
  login_attempt_per_day: 6,
};

const addGlobalConfigurationsToRequest = (req, res, next) => {
  req.globalConfigurations = globalConfigurations;
  next();
};

//Connect DB
const connectDB = require("./db/connect");

//routers
const authRouter = require("./routes/AuthRoute");
const adminRouter = require("./routes/AdminRoute");
const participantRouter = require("./routes/ParticipantRoute");
const submissionRouter = require("./routes/SubmissionRoute");
const renderRouter = require("./routes/RenderFileRoute.js");

// error handler
const notFoundMiddleware = require("./middleware/not-found");
const errorHandlerMiddleware = require("./middleware/error-handler");

//Cronjobs
const resetLimits = require("./cronjobs/resetLimits");

//app object definitions and configurations
const app = express();

// extra packages

app.use(heltmet());
app.use(cors());
app.use(xss());
app.use(logger("dev"));
app.use(
  rateLimiter({
    windowMs: 1000,
    limit: 10,
  })
);
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json({ limit: "1000mb" }));
app.use(bodyParser.urlencoded({ limit: "100mb", extended: true }));

if (process.env.NGINX_HANDLE_STATIC != "true") {
  console.log("Node handling Static files");
  app.use(express.static(path.join(__dirname, "public")));
}

app.use(addGlobalConfigurationsToRequest);

app.get("/", (req, res) => {
  res.send("Bkash Mothers Day Campaign Server API");
});

//Routes
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/participant", participantRouter);
app.use("/api/v1/submission", submissionRouter);
app.use("/api/v1/admin", adminRouter);
app.use("/api/v1/render", renderRouter);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 8080;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(port, console.log(`Server is listening on port ${port}...`));
  } catch (error) {
    console.log(error);
  }
};

cron.schedule("0 0 * * *", resetLimits, {
  timezone: "Asia/Dhaka",
});

start();
