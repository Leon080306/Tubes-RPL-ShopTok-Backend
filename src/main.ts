import express from "express";
import { Sequelize } from "sequelize-typescript";
import { appConfig } from "./models/appConfig";
import cors from 'cors'

const sequelize = new Sequelize({
    username: appConfig.username,
    password: appConfig.password,
    database: appConfig.database,
    host: appConfig.host,
    port: Number(appConfig.dbPort),
    dialect: appConfig.dialect,
});

const app = express();

app.use(cors({
    origin: "http://localhost:3000",
    credentials: true
}))

app.use(express.json());

app.get("/", async (req, res) => {
    res.send("Hello World!");
});

app.listen(appConfig.port as number, "0.0.0.0", () => {
    console.log(`Server running on port ${appConfig.port}`);
});