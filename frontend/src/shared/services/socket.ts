import { io, Socket } from 'socket.io-client';
import type { LayoutItem } from '@shared/types';

class SocketService {
  private socket: Socket | null = null;

  connect(): Socket {
    if (!this.socket) {
      this.socket = io('http://localhost:3001', {
        transports: ['websocket'],
        autoConnect: true,
      });

      this.socket.on('connect', () => {
        console.log('WebSocket connected:', this.socket?.id);
      });

      this.socket.on('disconnect', () => {
        console.log('WebSocket disconnected');
      });
    }
    return this.socket;
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  joinProject(projectId: string): void {
    this.socket?.emit('joinProject', projectId);
  }

  leaveProject(projectId: string): void {
    this.socket?.emit('leaveProject', projectId);
  }

  updateLayout(projectId: string, layout: LayoutItem[]): void {
    this.socket?.emit('updateLayout', { projectId, layout });
  }

  addComponent(projectId: string, item: LayoutItem): void {
    this.socket?.emit('addComponent', { projectId, item });
  }

  updateComponent(projectId: string, item: LayoutItem): void {
    this.socket?.emit('updateComponent', { projectId, item });
  }

  removeComponent(projectId: string, itemId: string): void {
    this.socket?.emit('removeComponent', { projectId, itemId });
  }

  onLayoutUpdated(callback: (layout: LayoutItem[]) => void): void {
    this.socket?.on('layoutUpdated', callback);
  }

  onComponentAdded(callback: (item: LayoutItem) => void): void {
    this.socket?.on('componentAdded', callback);
  }

  onComponentUpdated(callback: (item: LayoutItem) => void): void {
    this.socket?.on('componentUpdated', callback);
  }

  onComponentRemoved(callback: (itemId: string) => void): void {
    this.socket?.on('componentRemoved', callback);
  }
}

export const socketService = new SocketService();
