import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../auth/entities/user.entity';

export interface LayoutItem {
  id: string;
  componentType: string;
  x: number;
  y: number;
  w: number;
  h: number;
  props?: Record<string, unknown>;
  children?: LayoutItem[];
}

export interface Project {
  id: string;
  name: string;
  layout: LayoutItem[];
  createdAt: Date;
  updatedAt: Date;
  ownerId?: string;
}

