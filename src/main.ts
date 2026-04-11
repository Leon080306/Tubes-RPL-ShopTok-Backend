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
    models: [__dirname + "/models/**/*.ts"]
});

const app = express();

app.use(express.json());

app.get("/", async (req, res) => {
    res.send("Hello World!");
});

app.listen(appConfig.port, () => {
});

// START SERVER

async function start() {
  try {
    await sequelize.authenticate();
    console.log("DB CONNECT");

    const PORT = appConfig.port;

    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("DB GA CONNECT:", error);
  }
}

start();