import "reflect-metadata";
import express from "express";
import { Sequelize } from "sequelize-typescript";
import { appConfig } from "../config/appConfig";

import cartRoutes from "./routes/cart.routes"
import wishlistRoutes from "./routes/wishlist.routes"
import voucherRoutes from "./routes/voucher.routes"
import shopsRoutes from "./routes/shops.routes";
import userRoutes from "./routes/user.routes"
import authRoutes from "./routes/auth.routes"
import addressRoutes from "./routes/address.routes"
import chatRouter from "./routes/chat.routes";
import categoryRouter from "./routes/category.routes";
import productRoutes from "./routes/products.routes";
import ratingsRoutes from "./routes/ratings.routes";
import orderRoutes from "./routes/order.routes"

import cors from 'cors'
import path from "path"
import { loggerMiddleware } from "./middlewares/logger.middleware";
import { errorMiddleware } from "./middlewares/error.middleware";

export const sequelize = new Sequelize({
    logging: false,
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

app.use(loggerMiddleware);

app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));
app.use("/cart", cartRoutes)
app.use("/wishlist", wishlistRoutes)
app.use("/voucher", voucherRoutes)
app.use("/user", userRoutes)
app.use("/auth", authRoutes)
app.use("/address", addressRoutes)
app.use("/chats", chatRouter);
app.use("/category", categoryRouter);
app.use("/products", productRoutes);
app.use("/ratings", ratingsRoutes);
app.use("/shops", shopsRoutes);
app.use("/orders", orderRoutes);

app.get("/", async (req, res) => {
    res.send("Hello World!");
});

const start = async () => {
    let connected = false;

    while (!connected) {
        try {
            console.log("TRY DB CONNECT...");
            await sequelize.authenticate();
            connected = true;
            console.log("DB CONNECT SUCCESS");
        } catch (err) {
            console.log("DB NOT READY, RETRYING IN 3s...");
            await new Promise(r => setTimeout(r, 3000));
        }
    }
}

app.use(errorMiddleware);

start().then(() => {
    const PORT = appConfig.port || 5005;
    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
    });
});
