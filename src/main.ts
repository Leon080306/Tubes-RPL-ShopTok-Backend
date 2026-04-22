import "reflect-metadata"
import path from "path"
import express from "express";
import { Sequelize } from "sequelize-typescript";
import { appConfig } from "../config/appConfig";
import cors from 'cors'
import productsRoutes from "./routes/products.routes";
import ratingsRoutes from "./routes/ratings.routes";
import cartRoutes from "./routes/cart.routes"
import wishlistRoutes from "./routes/wishlist.routes"
import voucherRoutes from "./routes/voucher.routes"

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


app.use("/cart", cartRoutes)
app.use("/wishlist", wishlistRoutes)
app.use("/voucher", voucherRoutes)


app.get("/", async (req, res) => {
    res.send("Hello World!");
});

app.use("/products", productsRoutes);
app.use("/ratings", ratingsRoutes);

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