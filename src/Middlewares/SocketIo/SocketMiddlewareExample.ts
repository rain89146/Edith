import {Socket} from 'socket.io';

//  socket middleware
//  As long as you do not overwrite any existing attribute, you can attach any attribute to the Socket instance and use it later
export default async function SocketMiddlewareExample (socket: Socket, next: Function): Promise<void>
{
    //
    try {
        console.log('socket_middleware');
        
        //
        const sessionId = socket.handshake.auth.sessionID;
        console.log(sessionId)
        
        //
        const token = socket.handshake.auth.token;
        console.log(token);

        next();
    } catch (error: any) {
        const err: any = new Error(error.message);
        err.data = {content: "some custom shit"}
        next(err);
    }
}