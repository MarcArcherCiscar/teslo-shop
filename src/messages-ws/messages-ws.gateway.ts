import { OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer, WsException } from '@nestjs/websockets';
import { MessagesWsService } from './messages-ws.service';
import { Server, Socket } from 'socket.io';
import { NewMessageDto } from './dto/new-message.dto';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from 'src/auth/interfaces';

@WebSocketGateway({ cors: true })
export class MessagesWsGateway implements OnGatewayConnection, OnGatewayDisconnect {

  @WebSocketServer() wss: Server;

  constructor(
    private readonly messagesWsService: MessagesWsService,
    private readonly jwtService: JwtService
  ) {}

  async handleConnection(client: Socket) {
    const token = client.handshake.headers.authentication as string;
    let payload: JwtPayload;
    try {
      payload = this.jwtService.verify<JwtPayload>(token);

      await this.messagesWsService.registerClient( client, payload.id );
    } catch (error) {
      client.disconnect();
      return;
    }

    //console.log({ payload });

    //console.log('Client connected', client.id);


    this.wss.emit('clients-updated', this.messagesWsService.getConnectedClients());
    //console.log('Clients connected', this.messagesWsService.getConnectedClients());
  }

  handleDisconnect(client: Socket) {
    //console.log('Client disconnected', client.id);
    this.messagesWsService.removeClient(client.id);

    //console.log('Clients connected', this.messagesWsService.getConnectedClients());
  }

  @SubscribeMessage('message-from-client')
  handleMessageFromClient( client: Socket, payload: NewMessageDto ) {
    //console.log(client.id, payload);

    //! Emite unicamente al cliente
/*     client.emit('message-from-server', {
      fullName: 'Soy yo!',
      message: payload.message,
    }); */

    //! Emite a todos los clientes, menos al que lo emitió
/*     client.broadcast.emit('message-from-server', {
      fullName: 'Soy yo!',
      message: payload.message,
    }); */

    //! Emite a todos los clientes
    this.wss.emit('message-from-server', {
      fullName: this.messagesWsService.getUserFullName(client.id),
      message: payload.message,
    });

  }

}
