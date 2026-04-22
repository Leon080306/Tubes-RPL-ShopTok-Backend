import path from "path"
import express from "express";
import { Sequelize } from "sequelize-typescript";
import { appConfig } from "../config/appConfig";
import productsRoutes from "./routes/products.routes";
import cors from 'cors'
import ratingsRoutes from "./routes/ratings.routes";

const sequelize = new Sequelize({
    username: appConfig.username,
    password: appConfig.password as string,
    database: appConfig.database,
    host: appConfig.host,
    port: Number(appConfig.dbPort),
    dialect: appConfig.dialect,
    models: [path.join(__dirname, "models")]
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

app.use("/products", productsRoutes);
app.use("/ratings", ratingsRoutes);

app.listen(appConfig.port as number, "0.0.0.0", () => {
    console.log(`Server running on port ${appConfig.port}`);
});