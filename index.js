// Imports
const express = require("express");
const Time = require("./api/routes/Time");
require("dotenv").config();

const port = process.env.PORT || 4000;
const app = express();

app.use(express.json());
app.use("/time", Time);

app.listen(port, () =>
    console.log(`Server is up and running on port: ${port}`)
);
