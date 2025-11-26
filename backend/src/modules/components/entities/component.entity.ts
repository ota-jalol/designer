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
