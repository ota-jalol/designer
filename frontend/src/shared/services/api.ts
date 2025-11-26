import type { Project, LayoutItem, ComponentDefinition, CodeFormat } from '@shared/types';

const API_BASE = '/api';

export interface NpmPackageInfo {
  name: string;
  components: ComponentDefinition[];
  installed: boolean;
}

export interface PackageInstallResult {
  success: boolean;
  message: string;
  package?: NpmPackageInfo;
}

export const api = {
  // Designer API
  async createProject(name: string): Promise<Project> {
    const response = await fetch(`${API_BASE}/designer/projects`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name }),
    });
    return response.json();
  },

  async getProjects(): Promise<Project[]> {
    const response = await fetch(`${API_BASE}/designer/projects`);
    return response.json();
  },

  async getProject(id: string): Promise<Project> {
    const response = await fetch(`${API_BASE}/designer/projects/${id}`);
    return response.json();
  },

  async saveLayout(projectId: string, layout: LayoutItem[]): Promise<Project> {
    const response = await fetch(`${API_BASE}/designer/projects/${projectId}/layout`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ projectId, layout }),
    });
    return response.json();
  },

  async generateCode(projectId: string, format: CodeFormat = 'vue'): Promise<string> {
    const response = await fetch(`${API_BASE}/designer/generate-code`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ projectId, format }),
    });
    const data = await response.json();
    return data.code;
  },

  // Components API
  async getComponents(category?: string): Promise<ComponentDefinition[]> {
    const url = category 
      ? `${API_BASE}/components?category=${category}`
      : `${API_BASE}/components`;
    const response = await fetch(url);
    return response.json();
  },

  async getCategories(): Promise<string[]> {
    const response = await fetch(`${API_BASE}/components/categories`);
    return response.json();
  },

  // Package Management API
  async getSupportedPackages(): Promise<string[]> {
    const response = await fetch(`${API_BASE}/components/packages/supported`);
    return response.json();
  },

  async getInstalledPackages(): Promise<NpmPackageInfo[]> {
    const response = await fetch(`${API_BASE}/components/packages/installed`);
    return response.json();
  },

  async installPackage(packageName: string): Promise<PackageInstallResult> {
    const response = await fetch(`${API_BASE}/components/packages/install`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ packageName }),
    });
    return response.json();
  },

  async uninstallPackage(packageName: string): Promise<{ success: boolean; message: string }> {
    const response = await fetch(`${API_BASE}/components/packages/${encodeURIComponent(packageName)}`, {
      method: 'DELETE',
    });
    return response.json();
  },
};
