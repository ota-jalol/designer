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
