const router = require("express").Router();
const { Client } = require("pg");
require("dotenv").config();

const db = {
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
};
const client = new Client(db);
client.connect();

router.post("/log", (req, res) => {
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
                err,
            });
        } else {
            res.status(201).send({
                message: `Log for date: ${entryDate} created`,
            });
        }
    });
});

router.get("/list", (_, res) => {
    const query = "select * from work_logs;";
    client.query(query, (err, result) => {
        if (err) {
            console.log("Error: ", err);
            res.status(500).send({
                message: "An Error Occurred, Could not fetch the logs",
                err,
            });
        } else {
            res.status(200).send({
                message: result,
            });
        }
    });
});

router.get("/count", (_, res) => {
    const query =
        "select (select count(*) from work_logs where hours = 8) as full_days, (select count(*) from work_logs where hours != 8) as half_days;";

    client.query(query, (err, result) => {
        if (err) {
            console.log("Error: ", err);
            res.status(500).send({
                message:
                    "Couldn't aggregate, please check the error and try again",
                err,
            });
        } else {
            res.status(200).send({
                message: result,
            });
        }
    });
});

module.exports = router;
