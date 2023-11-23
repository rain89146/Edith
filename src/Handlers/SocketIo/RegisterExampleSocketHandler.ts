import { Server, Socket } from "socket.io";

export default function RegisterExampleSocketHandler(io: Server, socket: Socket) {
    const createOrder = (payload: any) => {
        // ...
      }
    
      const readOrder = (orderId: string, callback: Function) => {
        // ...
      }
    
    socket.on("order:create", createOrder);
    socket.on("order:read", readOrder);
}