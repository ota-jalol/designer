import type { Project, LayoutItem, ComponentDefinition, CodeFormat } from '@shared/types';

const API_BASE = '/api';

function getAuthHeaders(): HeadersInit {
  const token = localStorage.getItem('token');
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'An error occurred' }));
    throw new Error(error.message || `HTTP ${response.status}`);
  }
  return response.json();
}

export interface AuthResponse {
  access_token: string;
  user: {
    id: string;
    email: string;
    name: string;
  };
}

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
  // Auth API
  async login(email: string, password: string): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    return handleResponse<AuthResponse>(response);
  },

  async register(name: string, email: string, password: string): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    });
    return handleResponse<AuthResponse>(response);
  },

  // Designer API
  async createProject(name: string): Promise<Project> {
    const response = await fetch(`${API_BASE}/designer/projects`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ name }),
    });
    return handleResponse<Project>(response);
  },

  async getProjects(): Promise<Project[]> {
    const response = await fetch(`${API_BASE}/designer/projects`, {
      headers: getAuthHeaders(),
    });
    return handleResponse<Project[]>(response);
  },

  async getProject(id: string): Promise<Project> {
    const response = await fetch(`${API_BASE}/designer/projects/${id}`, {
      headers: getAuthHeaders(),
    });
    return handleResponse<Project>(response);
  },

  async deleteProject(id: string): Promise<void> {
    const response = await fetch(`${API_BASE}/designer/projects/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    if (!response.ok) {
      throw new Error('Failed to delete project');
    }
  },

  async saveLayout(projectId: string, layout: LayoutItem[]): Promise<Project> {
    const response = await fetch(`${API_BASE}/designer/projects/${projectId}/layout`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ layout }),
    });
    return handleResponse<Project>(response);
  },

  async exportProject(id: string): Promise<any> {
    const response = await fetch(`${API_BASE}/designer/projects/${id}/export`, {
      headers: getAuthHeaders(),
    });
    return handleResponse<any>(response);
  },

  async importProject(data: any): Promise<Project> {
    const response = await fetch(`${API_BASE}/designer/projects/import`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse<Project>(response);
  },

  async generateCode(projectId: string, format: CodeFormat = 'vue'): Promise<{ code: string }> {
    const response = await fetch(`${API_BASE}/designer/generate-code`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ projectId, format }),
    });
    return handleResponse<{ code: string }>(response);
  },

  // Components API
  async getComponents(): Promise<ComponentDefinition[]> {
    const response = await fetch(`${API_BASE}/components`, {
      headers: getAuthHeaders(),
    });
    return handleResponse<ComponentDefinition[]>(response);
  },

  async getComponentsByCategory(category: string): Promise<ComponentDefinition[]> {
    const response = await fetch(`${API_BASE}/components/category/${category}`, {
      headers: getAuthHeaders(),
    });
    return handleResponse<ComponentDefinition[]>(response);
  },

  async getAvailablePackages(): Promise<NpmPackageInfo[]> {
    const response = await fetch(`${API_BASE}/components/packages`, {
      headers: getAuthHeaders(),
    });
    return handleResponse<NpmPackageInfo[]>(response);
  },

  async installPackage(packageName: string): Promise<PackageInstallResult> {
    const response = await fetch(`${API_BASE}/components/packages/install`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ packageName }),
    });
    return handleResponse<PackageInstallResult>(response);
  },

  async uninstallPackage(packageName: string): Promise<void> {
    const response = await fetch(`${API_BASE}/components/packages/${packageName}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    if (!response.ok) {
      throw new Error('Failed to uninstall package');
    }
  },
};
