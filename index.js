// Imports
const express = require("express");
const { Client } = require("pg");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 4000;
const db = {
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
};
const client = new Client(db);

// Connect to db
client.connect();

app.use(express.json());
app.post("/log", (req, res) => {
    let { hours, entryDate } = req.body;

    if (!entryDate) {
        entryDate = new Date();
    }

    const query = "insert into work_logs(hours, entry_date) values($1, $2)";
    const params = [hours, entryDate];
    client.query(query, params, (err, _) => {
        if (err) {
            console.log("Error: ", err);
            res.status(500).send({
                message:
                    "An Error Occurred, Please note the log somewhere and try again",
            });
        } else {
            res.status(201).send({
                message: `Log for date: ${entryDate} created`,
            });
        }
    });
});

app.listen(port, () =>
    console.log(`Server is up and running on port: ${port}`)
);
