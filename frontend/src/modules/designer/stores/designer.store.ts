import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { LayoutItem, Project, ComponentDefinition } from '../types';
import { api } from '@shared/services/api';
import { socketService } from '@shared/services/socket';
import { generateUniqueId } from '@shared/utils/id';

// Debounce utility
function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null;
  return function (this: any, ...args: Parameters<T>) {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}

interface HistoryState {
  layout: LayoutItem[];
  timestamp: number;
}

export const useDesignerStore = defineStore('designer', () => {
  // State
  const currentProject = ref<Project | null>(null);
  const projects = ref<Project[]>([]);
  const layout = ref<LayoutItem[]>([]);
  const selectedItem = ref<LayoutItem | null>(null);
  const components = ref<ComponentDefinition[]>([]);
  const categories = ref<string[]>([]);
  const generatedCode = ref<string>('');
  const isLoading = ref(false);
  const error = ref<string | null>(null);
  
  // History for undo/redo
  const history = ref<HistoryState[]>([]);
  const historyIndex = ref(-1);
  const maxHistorySize = 50;

  // Auth state
  const isAuthenticated = ref(false);
  const currentUser = ref<any>(null);

  // Getters
  const hasProject = computed(() => currentProject.value !== null);
  const selectedItemId = computed(() => selectedItem.value?.id ?? null);
  const canUndo = computed(() => historyIndex.value > 0);
  const canRedo = computed(() => historyIndex.value < history.value.length - 1);

  // History management
  function saveToHistory() {
    // Remove any history after current index (when making new changes after undo)
    if (historyIndex.value < history.value.length - 1) {
      history.value = history.value.slice(0, historyIndex.value + 1);
    }

    // Add current state to history
    history.value.push({
      layout: JSON.parse(JSON.stringify(layout.value)),
      timestamp: Date.now(),
    });

    // Limit history size
    if (history.value.length > maxHistorySize) {
      history.value.shift();
    } else {
      historyIndex.value++;
    }
  }

  function undo() {
    if (!canUndo.value) return;
    
    historyIndex.value--;
    const state = history.value[historyIndex.value];
    layout.value = JSON.parse(JSON.stringify(state.layout));
    
    if (currentProject.value) {
      saveLayoutDebounced(currentProject.value.id, layout.value);
    }
  }

  function redo() {
    if (!canRedo.value) return;
    
    historyIndex.value++;
    const state = history.value[historyIndex.value];
    layout.value = JSON.parse(JSON.stringify(state.layout));
    
    if (currentProject.value) {
      saveLayoutDebounced(currentProject.value.id, layout.value);
    }
  }

  // Debounced save function
  const saveLayoutDebounced = debounce(async (projectId: string, layoutData: LayoutItem[]) => {
    try {
      await api.saveLayout(projectId, layoutData);
      socketService.updateLayout(projectId, layoutData);
    } catch (e) {
      error.value = 'Failed to save layout';
    }
  }, 300);

  // Auth actions
  async function login(email: string, password: string) {
    isLoading.value = true;
    try {
      const response = await api.login(email, password);
      currentUser.value = response.user;
      isAuthenticated.value = true;
      localStorage.setItem('token', response.access_token);
      return true;
    } catch (e: any) {
      error.value = e.response?.data?.message || 'Login failed';
      return false;
    } finally {
      isLoading.value = false;
    }
  }

  async function register(name: string, email: string, password: string) {
    isLoading.value = true;
    try {
      const response = await api.register(name, email, password);
      currentUser.value = response.user;
      isAuthenticated.value = true;
      localStorage.setItem('token', response.access_token);
      return true;
    } catch (e: any) {
      error.value = e.response?.data?.message || 'Registration failed';
      return false;
    } finally {
      isLoading.value = false;
    }
  }

  function logout() {
    currentUser.value = null;
    isAuthenticated.value = false;
    localStorage.removeItem('token');
    currentProject.value = null;
    layout.value = [];
    projects.value = [];
  }

  // Project actions
  async function loadProjects() {
    isLoading.value = true;
    error.value = null;
    try {
      projects.value = await api.getProjects();
    } catch (e: any) {
      error.value = e.response?.data?.message || 'Failed to load projects';
    } finally {
      isLoading.value = false;
    }
  }

  async function createProject(name: string) {
    isLoading.value = true;
    error.value = null;
    try {
      const project = await api.createProject(name);
      projects.value.push(project);
      await selectProject(project.id);
      return project;
    } catch (e: any) {
      error.value = e.response?.data?.message || 'Failed to create project';
      return null;
    } finally {
      isLoading.value = false;
    }
  }

  async function selectProject(projectId: string) {
    isLoading.value = true;
    error.value = null;
    try {
      const project = await api.getProject(projectId);
      currentProject.value = project;
      layout.value = project.layout || [];
      
      // Initialize history with current state
      history.value = [{
        layout: JSON.parse(JSON.stringify(layout.value)),
        timestamp: Date.now(),
      }];
      historyIndex.value = 0;
      
      socketService.joinProject(projectId);
    } catch (e: any) {
      error.value = e.response?.data?.message || 'Failed to load project';
    } finally {
      isLoading.value = false;
    }
  }

  async function deleteProject(projectId: string) {
    isLoading.value = true;
    error.value = null;
    try {
      await api.deleteProject(projectId);
      projects.value = projects.value.filter(p => p.id !== projectId);
      if (currentProject.value?.id === projectId) {
        currentProject.value = null;
        layout.value = [];
      }
      return true;
    } catch (e: any) {
      error.value = e.response?.data?.message || 'Failed to delete project';
      return false;
    } finally {
      isLoading.value = false;
    }
  }

  async function exportProject(projectId: string) {
    try {
      const data = await api.exportProject(projectId);
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${data.name}-${Date.now()}.json`;
      a.click();
      URL.revokeObjectURL(url);
      return true;
    } catch (e: any) {
      error.value = e.response?.data?.message || 'Failed to export project';
      return false;
    }
  }

  async function importProject(file: File) {
    isLoading.value = true;
    error.value = null;
    try {
      const text = await file.text();
      const data = JSON.parse(text);
      const project = await api.importProject(data);
      projects.value.push(project);
      await selectProject(project.id);
      return true;
    } catch (e: any) {
      error.value = e.response?.data?.message || 'Failed to import project';
      return false;
    } finally {
      isLoading.value = false;
    }
  }

  // Layout actions with history
  function addComponent(component: ComponentDefinition, x: number, y: number) {
    const id = generateUniqueId();
    const item: LayoutItem = {
      id,
      componentType: component.tag,
      x,
      y,
      w: component.defaultSize.w,
      h: component.defaultSize.h,
      i: id, // Required by vue-grid-layout
      props: { ...component.defaultProps },
    };
    
    layout.value.push(item);
    saveToHistory();
    
    if (currentProject.value) {
      saveLayoutDebounced(currentProject.value.id, layout.value);
    }
    
    return item;
  }

  function updateLayoutItem(item: LayoutItem) {
    const index = layout.value.findIndex(i => i.id === item.id);
    if (index >= 0) {
      layout.value[index] = { ...item };
      saveToHistory();
      
      if (currentProject.value) {
        saveLayoutDebounced(currentProject.value.id, layout.value);
      }
    }
  }

  function removeLayoutItem(itemId: string) {
    layout.value = layout.value.filter(i => i.id !== itemId);
    if (selectedItem.value?.id === itemId) {
      selectedItem.value = null;
    }
    saveToHistory();
    
    if (currentProject.value) {
      saveLayoutDebounced(currentProject.value.id, layout.value);
    }
  }

  // Child component management
  function addChildComponent(parentId: string, component: ComponentDefinition) {
    const parent = layout.value.find(i => i.id === parentId);
    if (!parent) return;

    if (!parent.children) {
      parent.children = [];
    }

    const childItem: LayoutItem = {
      id: generateUniqueId(),
      componentType: component.tag,
      x: 0,
      y: 0,
      w: component.defaultSize.w,
      h: component.defaultSize.h,
      i: generateUniqueId(),
      props: { ...component.defaultProps },
    };

    parent.children.push(childItem);
    saveToHistory();

    if (currentProject.value) {
      saveLayoutDebounced(currentProject.value.id, layout.value);
    }

    return childItem;
  }

  function removeChildComponent(parentId: string, childId: string) {
    const parent = layout.value.find(i => i.id === parentId);
    if (!parent || !parent.children) return;

    parent.children = parent.children.filter(c => c.id !== childId);
    
    if (selectedItem.value?.id === childId) {
      selectedItem.value = null;
    }
    
    saveToHistory();

    if (currentProject.value) {
      saveLayoutDebounced(currentProject.value.id, layout.value);
    }
  }

  function updateChildComponent(parentId: string, childId: string, updates: Partial<LayoutItem>) {
    const parent = layout.value.find(i => i.id === parentId);
    if (!parent || !parent.children) return;

    const childIndex = parent.children.findIndex(c => c.id === childId);
    if (childIndex >= 0) {
      parent.children[childIndex] = { ...parent.children[childIndex], ...updates };
      saveToHistory();

      if (currentProject.value) {
        saveLayoutDebounced(currentProject.value.id, layout.value);
      }
    }
  }

  function selectLayoutItem(item: LayoutItem | null) {
    selectedItem.value = item;
  }

  function updateLayout(newLayout: LayoutItem[]) {
    layout.value = newLayout;
    saveToHistory();
    
    if (currentProject.value) {
      saveLayoutDebounced(currentProject.value.id, layout.value);
    }
  }

  // Component library actions
  async function loadComponents() {
    isLoading.value = true;
    error.value = null;
    try {
      components.value = await api.getComponents();
      const uniqueCategories = [...new Set(components.value.map(c => c.category))];
      categories.value = uniqueCategories;
    } catch (e: any) {
      error.value = e.response?.data?.message || 'Failed to load components';
    } finally {
      isLoading.value = false;
    }
  }

  async function generateCode(format: 'vue' | 'html' = 'vue') {
    if (!currentProject.value) return;
    
    isLoading.value = true;
    error.value = null;
    try {
      const result = await api.generateCode(currentProject.value.id, format);
      generatedCode.value = result.code;
    } catch (e: any) {
      error.value = e.response?.data?.message || 'Failed to generate code';
    } finally {
      isLoading.value = false;
    }
  }

  // Initialize from localStorage
  function initializeAuth() {
    const token = localStorage.getItem('token');
    if (token) {
      isAuthenticated.value = true;
      // TODO: Verify token and load user info
    }
  }

  return {
    // State
    currentProject,
    projects,
    layout,
    selectedItem,
    components,
    categories,
    generatedCode,
    isLoading,
    error,
    isAuthenticated,
    currentUser,
    
    // Getters
    hasProject,
    selectedItemId,
    canUndo,
    canRedo,
    
    // Actions
    login,
    register,
    logout,
    initializeAuth,
    loadProjects,
    createProject,
    selectProject,
    deleteProject,
    exportProject,
    importProject,
    addComponent,
    updateLayoutItem,
    removeLayoutItem,
    addChildComponent,
    removeChildComponent,
    updateChildComponent,
    selectLayoutItem,
    updateLayout,
    loadComponents,
    generateCode,
    undo,
    redo,
  };
});
