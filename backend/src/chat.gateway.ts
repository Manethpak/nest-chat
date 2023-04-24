import { Logger } from '@nestjs/common';
import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({ cors: true })
export class ChatGateway {
  @WebSocketServer()
  server: Server;

  @SubscribeMessage('send')
  handleMessage(
    @MessageBody()
    body: {
      id: string;
      message: string;
      sender: string;
    },
  ): void {
    const newMessage = {
      ...body,
      timestamp: new Date(),
    };

    Logger.log(`${body.sender}(${body.id}): ${body.message}`, 'ChatGateway');
    this.server.emit('receive', newMessage);
  }
}
