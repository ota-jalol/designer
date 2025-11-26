import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { DesignerService } from '../services/designer.service';
import { LayoutItem } from '../entities/designer.entity';

@WebSocketGateway({
  cors: {
    origin: ['http://localhost:5173', 'http://localhost:3000'],
    credentials: true,
  },
})
export class DesignerGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(private readonly designerService: DesignerService) {}

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('joinProject')
  handleJoinProject(
    @ConnectedSocket() client: Socket,
    @MessageBody() projectId: string,
  ) {
    client.join(projectId);
    const project = this.designerService.getProject(projectId);
    return { event: 'projectJoined', data: project };
  }

  @SubscribeMessage('leaveProject')
  handleLeaveProject(
    @ConnectedSocket() client: Socket,
    @MessageBody() projectId: string,
  ) {
    client.leave(projectId);
    return { event: 'projectLeft', data: projectId };
  }

  @SubscribeMessage('updateLayout')
  handleUpdateLayout(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { projectId: string; layout: LayoutItem[] },
  ) {
    const project = this.designerService.saveLayout(data.projectId, data.layout);
    client.to(data.projectId).emit('layoutUpdated', project?.layout);
    return { event: 'layoutSaved', data: project };
  }

  @SubscribeMessage('addComponent')
  handleAddComponent(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { projectId: string; item: LayoutItem },
  ) {
    const project = this.designerService.updateLayoutItem(data.projectId, data.item);
    client.to(data.projectId).emit('componentAdded', data.item);
    return { event: 'componentAdded', data: project };
  }

  @SubscribeMessage('updateComponent')
  handleUpdateComponent(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { projectId: string; item: LayoutItem },
  ) {
    const project = this.designerService.updateLayoutItem(data.projectId, data.item);
    client.to(data.projectId).emit('componentUpdated', data.item);
    return { event: 'componentUpdated', data: project };
  }

  @SubscribeMessage('removeComponent')
  handleRemoveComponent(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { projectId: string; itemId: string },
  ) {
    const project = this.designerService.removeLayoutItem(data.projectId, data.itemId);
    client.to(data.projectId).emit('componentRemoved', data.itemId);
    return { event: 'componentRemoved', data: project };
  }

  broadcastLayoutUpdate(projectId: string, layout: LayoutItem[]) {
    this.server.to(projectId).emit('layoutUpdated', layout);
  }
}
