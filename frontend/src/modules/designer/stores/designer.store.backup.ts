import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { LayoutItem, Project, ComponentDefinition } from '../types';
import { api } from '@shared/services/api';
import { socketService } from '@shared/services/socket';
import { generateUniqueId } from '@shared/utils/id';

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

  // Getters
  const hasProject = computed(() => currentProject.value !== null);
  const selectedItemId = computed(() => selectedItem.value?.id ?? null);

  // Actions
  async function loadProjects() {
    isLoading.value = true;
    try {
      projects.value = await api.getProjects();
    } catch (e) {
      error.value = 'Failed to load projects';
    } finally {
      isLoading.value = false;
    }
  }

  async function createProject(name: string) {
    isLoading.value = true;
    try {
      const project = await api.createProject(name);
      projects.value.push(project);
      await selectProject(project.id);
      return project;
    } catch (e) {
      error.value = 'Failed to create project';
      return null;
    } finally {
      isLoading.value = false;
    }
  }

  async function selectProject(projectId: string) {
    if (currentProject.value) {
      socketService.leaveProject(currentProject.value.id);
    }
    
    try {
      const project = await api.getProject(projectId);
      currentProject.value = project;
      layout.value = project.layout || [];
      socketService.connect();
      socketService.joinProject(projectId);
      setupSocketListeners();
    } catch (e) {
      error.value = 'Failed to load project';
    }
  }

  function setupSocketListeners() {
    socketService.onLayoutUpdated((newLayout) => {
      layout.value = newLayout;
    });

    socketService.onComponentAdded((item) => {
      const exists = layout.value.find(i => i.id === item.id);
      if (!exists) {
        layout.value.push(item);
      }
    });

    socketService.onComponentUpdated((item) => {
      const index = layout.value.findIndex(i => i.id === item.id);
      if (index >= 0) {
        layout.value[index] = item;
      }
    });

    socketService.onComponentRemoved((itemId) => {
      layout.value = layout.value.filter(i => i.id !== itemId);
      if (selectedItem.value?.id === itemId) {
        selectedItem.value = null;
      }
    });
  }

  async function loadComponents() {
    try {
      components.value = await api.getComponents();
      categories.value = await api.getCategories();
    } catch (e) {
      error.value = 'Failed to load components';
    }
  }

  function addComponent(component: ComponentDefinition) {
    if (!currentProject.value) return;

    const itemId = generateUniqueId('item');
    const newItem: LayoutItem = {
      id: itemId,
      i: itemId,
      componentType: component.tag,
      x: 0,
      y: layout.value.length * 2,
      w: component.defaultSize.w,
      h: component.defaultSize.h,
      props: { ...component.defaultProps },
    };

    layout.value.push(newItem);
    socketService.addComponent(currentProject.value.id, newItem);
    selectItem(newItem);
  }

  function updateItem(item: LayoutItem) {
    if (!currentProject.value) return;

    const index = layout.value.findIndex(i => i.id === item.id);
    if (index >= 0) {
      layout.value[index] = item;
      socketService.updateComponent(currentProject.value.id, item);
    }
  }

  function removeItem(itemId: string) {
    if (!currentProject.value) return;

    layout.value = layout.value.filter(i => i.id !== itemId);
    socketService.removeComponent(currentProject.value.id, itemId);

    if (selectedItem.value?.id === itemId) {
      selectedItem.value = null;
    }
  }

  function selectItem(item: LayoutItem | null) {
    selectedItem.value = item;
  }

  async function saveLayout() {
    if (!currentProject.value) return;

    try {
      await api.saveLayout(currentProject.value.id, layout.value);
    } catch (e) {
      error.value = 'Failed to save layout';
    }
  }

  async function generateCode(format: 'vue' | 'html' = 'vue') {
    if (!currentProject.value) return;

    try {
      generatedCode.value = await api.generateCode(currentProject.value.id, format);
    } catch (e) {
      error.value = 'Failed to generate code';
    }
  }

  function updateLayoutFromGrid(newLayout: LayoutItem[]) {
    layout.value = newLayout;
    if (currentProject.value) {
      socketService.updateLayout(currentProject.value.id, newLayout);
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
    // Getters
    hasProject,
    selectedItemId,
    // Actions
    loadProjects,
    createProject,
    selectProject,
    loadComponents,
    addComponent,
    updateItem,
    removeItem,
    selectItem,
    saveLayout,
    generateCode,
    updateLayoutFromGrid,
  };
});
