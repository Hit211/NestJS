// socket.gateway.ts
import {
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
    OnGatewayConnection,
    OnGatewayDisconnect
  } from '@nestjs/websockets';
  import { Server, Socket } from 'socket.io';
  import cors from "cors"
import { set } from 'mongoose';

  
  @WebSocketGateway({
    cors:{
        origin:'http://localhost:5173',
        credentials:true
    }
  })
  export class SocketGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer() server: Server;
  

    private activeUsers = new Map<string, Set<string>>();
    private recentlyUnblockedUsers = new Set<string>();
    handleConnection(client: Socket) {
        const userIdRaw = client.handshake.query['userId'];

        const userId = Array.isArray(userIdRaw) ? userIdRaw[0] : userIdRaw;
      
        if (typeof userId === 'string') {
          if (!this.activeUsers.has(userId)) {
            this.activeUsers.set(userId, new Set());
          }
          this.activeUsers.get(userId)?.add(client.id);
          if(this.recentlyUnblockedUsers.has(userId)){
            this.server.to(client.id).emit('user-unblocked',{
                message:"You have been unblocked"
            });
            this.recentlyUnblockedUsers.delete(userId)
          }
        }
      }
      
  
      handleDisconnect(client: Socket) {
        const userIdRaw = client.handshake.query['userId'];
        const userId = Array.isArray(userIdRaw) ? userIdRaw[0] : userIdRaw;
      
        if (typeof userId === 'string' && this.activeUsers.has(userId)) {
          const userSockets = this.activeUsers.get(userId);
          userSockets?.delete(client.id);
          if (userSockets && userSockets.size === 0) {
            this.activeUsers.delete(userId);
          }
        }
      }
      
  
    blockUser(userId: string) {
      const sockets = this.activeUsers.get(userId);
      if (sockets) {
        for (const socketId of sockets) {
          this.server.to(socketId).emit('force-logout', { reason: 'blocked' });
          this.server.sockets.sockets.get(socketId)?.disconnect();
        }
        this.activeUsers.delete(userId);
      }
    }

    notifyUserUnbloked(userId:string){
     this.recentlyUnblockedUsers.add(userId);
    }
  }
  