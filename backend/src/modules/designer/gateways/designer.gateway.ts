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
  async handleJoinProject(
    @ConnectedSocket() client: Socket,
    @MessageBody() projectId: string,
  ) {
    client.join(projectId);
    const project = await this.designerService.getProject(projectId);
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
  async handleUpdateLayout(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { projectId: string; layout: LayoutItem[] },
  ) {
    const project = await this.designerService.saveLayout(data.projectId, data.layout);
    client.to(data.projectId).emit('layoutUpdated', project?.layout);
    return { event: 'layoutSaved', data: project };
  }

  @SubscribeMessage('addComponent')
  async handleAddComponent(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { projectId: string; item: LayoutItem },
  ) {
    const project = await this.designerService.updateLayoutItem(data.projectId, data.item);
    client.to(data.projectId).emit('componentAdded', data.item);
    return { event: 'componentAdded', data: project };
  }

  @SubscribeMessage('updateComponent')
  async handleUpdateComponent(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { projectId: string; item: LayoutItem },
  ) {
    const project = await this.designerService.updateLayoutItem(data.projectId, data.item);
    client.to(data.projectId).emit('componentUpdated', data.item);
    return { event: 'componentUpdated', data: project };
  }

  @SubscribeMessage('removeComponent')
  async handleRemoveComponent(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { projectId: string; itemId: string },
  ) {
    const project = await this.designerService.removeLayoutItem(data.projectId, data.itemId);
    client.to(data.projectId).emit('componentRemoved', data.itemId);
    return { event: 'componentRemoved', data: project };
  }

  broadcastLayoutUpdate(projectId: string, layout: LayoutItem[]) {
    this.server.to(projectId).emit('layoutUpdated', layout);
  }
}

