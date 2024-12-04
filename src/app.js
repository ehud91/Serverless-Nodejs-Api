const serverless = require("serverless-http");
const express = require("express");
const crud = require('./db/crud');
const validators = require('./db/validators');
const { getDbClient } = require('./db/clients');
const app = express();

app.use(express.json());


app.get("/", async (req, res, next) => {
    const sql = await dbClient(); 
    const now = Data.now();
    const [dbNowResult] = await sql`select now();`;
    const delta = (dbNowResult.now.getTime() - now) / 1000;
    return res.status(200).json({
        delta: delta,
        //DEBUG: process.env.DEBUG === 1 || `${process.env.DEBUG}` === `1`,        
    });
});

app.get("/path", (req, res, next) => {
    return res.status(200).json({
        message: "Hello from path!",
    });
});

app.get("/leads", async (req, res, next) => {
    const results = await crud.listLead();
    return res.status(200).json({
        results: results,
    });
});

app.post("/leads", async (req, res, next) => {
    // POST -> create data
    const postData = await req.body;
    // validation ???
    const { data, hasError } = await validators.validateLead(postData);
    if (hasError === true) {
        return res.status(400).json({
            message: message ? message : "Invalid request, please try again",
        });
    } else if (hasError === undefined) {
        return res.status(500).json({
            message: "Server Error",
        });
    }
    const { email } = data;
    const result = await crud.newLead(email);
    // insert data to the database
    return res.status(201).json({
        results: result,
    });
});

app.use((req, res, next) => {
    return res.status(404).json({
        error: "Not found",
    });
});

module.exports.app = app
module.exports.handler = serverless(app);