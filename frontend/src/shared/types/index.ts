export interface LayoutItem {
  id: string;
  componentType: string;
  x: number;
  y: number;
  w: number;
  h: number;
  i: string; // Required by vue-grid-layout
  props?: Record<string, unknown>;
  children?: LayoutItem[];
}

export interface Project {
  id: string;
  name: string;
  layout: LayoutItem[];
  createdAt: string;
  updatedAt: string;
}

export interface ComponentDefinition {
  id: string;
  name: string;
  category: string;
  tag: string;
  icon: string;
  defaultProps: Record<string, unknown>;
  editableProps: PropDefinition[];
  defaultSize: { w: number; h: number };
}

export interface PropDefinition {
  name: string;
  type: 'string' | 'number' | 'boolean' | 'select' | 'color';
  default: unknown;
  options?: string[];
  label: string;
}

export type CodeFormat = 'vue' | 'html';
