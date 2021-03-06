const express = require("express");
const { default: helmet } = require("helmet");
const morgan = require("morgan");
const cors = require("cors");
const { notFoundError, generalError } = require("./middlewares/errors");
const userRouter = require("./routers/userRouter");
const { corsOptions } = require("../utils/cors");
const dishesRouter = require("./routers/dishesRouter");

const app = express();

app.use(cors(corsOptions));
app.use(morgan("dev"));
app.use("/uploads/images", express.static("images"));
app.use(express.json());
app.use(helmet({ crossOriginResourcePolicy: false }));

app.use("/user", userRouter);
app.use("/dishes", dishesRouter);

app.use(notFoundError);
app.use(generalError);

module.exports = app;
