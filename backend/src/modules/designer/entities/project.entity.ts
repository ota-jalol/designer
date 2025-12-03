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

@Entity('projects')
export class Project {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column('jsonb', { default: [] })
  layout: LayoutItem[];

  @Column({ nullable: true })
  ownerId: string;

  @ManyToOne(() => User, (user) => user.projects, { nullable: true })
  @JoinColumn({ name: 'ownerId' })
  owner: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
