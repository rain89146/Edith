import { NextFunction, Request, Response } from "express";

export default async function ExpressMiddlewareExample(req: Request, res: Response, next: NextFunction): Promise<void>
{
    try {
        console.log('express_middleware1');
        next();
    } catch (error: any) {
        const err = new Error(error.message);
        next(err);
    }
}