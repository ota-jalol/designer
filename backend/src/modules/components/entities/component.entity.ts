import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export interface ComponentDefinition {
  id: string;
  name: string;
  category: string;
  tag: string;
  icon: string;
  defaultProps: Record<string, unknown>;
  editableProps: PropDefinition[];
  defaultSize: { w: number; h: number };
  packageName?: string; // npm package this component belongs to
}

export interface PropDefinition {
  name: string;
  type: 'string' | 'number' | 'boolean' | 'select' | 'color';
  default: unknown;
  options?: string[];
  label: string;
}

export interface NpmPackageInfo {
  name: string;
  version?: string;
  components: ComponentDefinition[];
  installed: boolean;
}

@Entity('custom_components')
export class CustomComponent {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  category: string;

  @Column()
  tag: string;

  @Column({ nullable: true })
  icon: string;

  @Column('jsonb', { default: {} })
  defaultProps: Record<string, unknown>;

  @Column('jsonb', { default: [] })
  editableProps: PropDefinition[];

  @Column('jsonb')
  defaultSize: { w: number; h: number };

  @Column({ nullable: true })
  packageName: string;

  @Column({ nullable: true })
  ownerId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

