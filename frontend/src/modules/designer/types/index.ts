import type { LayoutItem, Project, ComponentDefinition } from '@shared/types';

export type { LayoutItem, Project, ComponentDefinition };

export interface DesignerState {
  currentProject: Project | null;
  projects: Project[];
  layout: LayoutItem[];
  selectedItem: LayoutItem | null;
  components: ComponentDefinition[];
  categories: string[];
  generatedCode: string;
  isLoading: boolean;
  error: string | null;
}
