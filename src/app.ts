import { Server, Socket } from "socket.io";
import express from "express";
import http from 'http';
import session from "express-session";
import {Request, Response, NextFunction} from 'express';
import helmet from "helmet";
import RegisterExampleSocketHandler from "./Handlers/SocketIo/RegisterExampleSocketHandler";
import SocketMiddlewareExample from "./Middlewares/SocketIo/SocketMiddlewareExample";
import ExpressMiddlewareExample from "./Middlewares/ExpressJs/ExpressMiddlewareExample";
import ExampleExpressRouter from './Routers/ExampleExpressRouter';

const port = 1991;
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: process.env.NODE_ENV === 'production' ? false : "*",
        methods: ['GET', 'POST'],
        credentials: false,
    },
    httpCompression: {
        // Engine.IO options
        threshold: 2048, // defaults to 1024
        // Node.js zlib options
        chunkSize: 8 * 1024, // defaults to 16 * 1024
        windowBits: 14, // defaults to 15
        memLevel: 7, // defaults to 8
    },
    maxHttpBufferSize: 1e8
});

//  initial_headers: will be emitted just before writing the response headers of the first HTTP request of the session (the handshake), allowing you to customize them.
io.engine.on("initial_headers", (headers, req) => {
    console.log('initial_headers');
    headers["test"] = "123";
    headers["set-cookie"] = "mycookie=456";
});

//  connection_error: will be emitted when a connection is abnormally closed
io.engine.on("connection_error", (err) => {
    console.log(err.req);      // the request object
    console.log(err.code);     // the error code, for example 1
    console.log(err.message);  // the error message, for example "Session ID unknown"
    console.log(err.context);  // some additional error context

    switch (err.code) {
        case 0:
            console.log('Transport unknown')
            break;
        case 1:
            console.log("Session ID unknown");
            break;
        case 2:
            console.log("Bad handshake method");
            break;
        case 3:
            console.log("Bad request");
            break;
        case 4:
            console.log("Forbidden");
            break;
        case 5:
            console.log("Unsupported protocol version");
            break;
        default:
            break;
    }
});

//
io.engine.use(
    session({
        secret: "keyboard cat",
        resave: false,
        saveUninitialized: true,
        cookie: { secure: true }
    })
);

//
io.engine.use(helmet());

//  Express middlewares are now supported by the underlying engine
io.engine.use(async (req: Request, res: Response, next: NextFunction) => await ExpressMiddlewareExample(req, res, next));

//  socket middleware
io.use(async (socket: Socket, next) => await SocketMiddlewareExample(socket, next));

//  register listeners
io.on('connection', (socket: Socket) => {
    
    console.log('onConnection, register handlers', socket);
    RegisterExampleSocketHandler(io, socket);
});

//  router
app.use('/api/edith',ExampleExpressRouter);

//
server.listen(port);