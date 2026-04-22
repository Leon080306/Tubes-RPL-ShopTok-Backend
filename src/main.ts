import "reflect-metadata";
import express from "express";
import { Sequelize } from "sequelize-typescript";
import { appConfig } from "../config/appConfig";

import cartRoutes from "./routes/cart.routes"
import wishlistRoutes from "./routes/wishlist.routes"
import voucherRoutes from "./routes/voucher.routes"
import userRoutes from "./routes/user.routes"
import authRoutes from "./routes/auth.routes"
import adressRoutes from "./routes/address.routes"
import chatRouter from "./routes/chat.routes";
import categoryRouter from "./routes/category.routes";

import cors from 'cors'
import path from "path"

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
    origin: "http://localhost:5173",
    credentials: true
}))

app.use(express.json());


app.use("/cart", cartRoutes)
app.use("/wishlist", wishlistRoutes)
app.use("/voucher", voucherRoutes)
app.use("/user", userRoutes)
app.use("/auth", authRoutes)
app.use("/address", adressRoutes)
app.use("/chats", chatRouter);
app.use("/category", categoryRouter);

app.get("/", async (req, res) => {
    res.send("Hello World!");
});

// app.listen(appConfig.port, () => {
// });

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