import { Request, Response, NextFunction } from "express";

export function errorMiddleware(
    err: any,
    req: Request,
    res: Response,
    next: NextFunction
) {
    console.error("❌ Error occurred:");
    console.error(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    console.error(err.stack || err);

    res.status(err.status || 500).json({
        message: err.message || "Internal Server Error",
    });
}