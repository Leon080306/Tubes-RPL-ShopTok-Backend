import express from "express";
import { Sequelize } from "sequelize-typescript";
import { appConfig } from "./models/appConfig";

const sequelize = new Sequelize({
    username: appConfig.username,
    password: appConfig.password,
    database: appConfig.database,
    host: appConfig.host,
    port: Number(appConfig.dbPort),
    dialect: appConfig.dialect,
});

const app = express();

app.use(express.json());

app.get("/", async (req, res) => {
    res.send("Hello World!");
});

app.listen(appConfig.port, () => {
});