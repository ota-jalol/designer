<template>
  <div class="designer-page">
    <header class="designer-header">
      <div class="logo">
        <span class="logo-icon">🎨</span>
        <span class="logo-text">Vue UI Builder</span>
      </div>
      <div class="project-info" v-if="hasProject">
        <span class="project-name">{{ currentProject?.name }}</span>
      </div>
      <div class="header-actions">
        <div class="history-controls">
          <button @click="handleUndo" :disabled="!canUndo" class="history-btn" title="Undo (Ctrl+Z)">↶</button>
          <button @click="handleRedo" :disabled="!canRedo" class="history-btn" title="Redo (Ctrl+Y)">↷</button>
        </div>
        <button @click="createNewProject" class="new-project-btn">+ New Project</button>
        <router-link to="/projects" class="projects-link">Projects</router-link>
      </div>
    </header>

    <main class="designer-main">
      <aside class="left-panel">
        <ComponentPalette />
      </aside>

      <section class="center-panel">
        <div class="canvas-wrapper">
          <DesignCanvas />
        </div>
        <div class="code-wrapper">
          <CodeEditor />
        </div>
      </section>

      <aside class="right-panel">
        <PropertiesPanel />
      </aside>
    </main>

    <!-- New Project Modal -->
    <div v-if="showNewProjectModal" class="modal-overlay" @click.self="showNewProjectModal = false">
      <div class="modal">
        <h3>Create New Project</h3>
        <input
          v-model="newProjectName"
          type="text"
          placeholder="Project name"
          class="modal-input"
          @keyup.enter="submitNewProject"
        />
        <div class="modal-actions">
          <button @click="showNewProjectModal = false" class="cancel-btn">Cancel</button>
          <button @click="submitNewProject" class="submit-btn">Create</button>
        </div>
      </div>
    </div>

    <!-- Error Toast -->
    <div v-if="store.error" class="error-toast">
      {{ store.error }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useDesignerStore } from '../stores/designer.store';
import ComponentPalette from '../components/ComponentPalette.vue';
import DesignCanvas from '../components/DesignCanvas.vue';
import PropertiesPanel from '../components/PropertiesPanel.vue';
import CodeEditor from '../components/CodeEditor.vue';

const store = useDesignerStore();
const route = useRoute();
const router = useRouter();

const showNewProjectModal = ref(false);
const newProjectName = ref('');

const hasProject = computed(() => store.hasProject);
const currentProject = computed(() => store.currentProject);
const canUndo = computed(() => store.canUndo);
const canRedo = computed(() => store.canRedo);

onMounted(async () => {
  await store.loadComponents();
  await store.loadProjects();
  
  const projectId = route.params.projectId as string;
  if (projectId) {
    await store.selectProject(projectId);
  } else if (store.projects.length > 0) {
    await store.selectProject(store.projects[0].id);
    router.replace(`/designer/${store.projects[0].id}`);
  } else {
    showNewProjectModal.value = true;
  }

  // Keyboard shortcuts
  window.addEventListener('keydown', handleKeyDown);
});

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyDown);
});

function handleKeyDown(event: KeyboardEvent) {
  // Ctrl+Z for undo
  if (event.ctrlKey && event.key === 'z' && !event.shiftKey) {
    event.preventDefault();
    handleUndo();
  }
  // Ctrl+Y or Ctrl+Shift+Z for redo
  else if (event.ctrlKey && (event.key === 'y' || (event.key === 'z' && event.shiftKey))) {
    event.preventDefault();
    handleRedo();
  }
  // Delete key to remove selected component
  else if (event.key === 'Delete' && store.selectedComponent) {
    event.preventDefault();
    store.removeComponent(store.selectedComponent.id);
  }
}

function handleUndo() {
  store.undo();
}

function handleRedo() {
  store.redo();
}

function createNewProject() {
  newProjectName.value = '';
  showNewProjectModal.value = true;
}

async function submitNewProject() {
  if (!newProjectName.value.trim()) return;
  
  const project = await store.createProject(newProjectName.value.trim());
  if (project) {
    showNewProjectModal.value = false;
    router.push(`/designer/${project.id}`);
  }
}
</script>

<style scoped>
.designer-page {
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
}

.designer-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
  height: 48px;
  background: var(--panel-bg);
  border-bottom: 1px solid var(--border-color);
}

.logo {
  display: flex;
  align-items: center;
  gap: 8px;
}

.logo-icon {
  font-size: 24px;
}

.logo-text {
  font-size: 16px;
  font-weight: 600;
  color: var(--primary-color);
}

.project-info {
  display: flex;
  align-items: center;
}

.project-name {
  font-size: 14px;
  color: var(--text-color);
}

.header-actions {
  display: flex;
  gap: 12px;
  align-items: center;
}

.history-controls {
  display: flex;
  gap: 4px;
  margin-right: 8px;
}

.history-btn {
  padding: 6px 10px;
  font-size: 18px;
  border-radius: 4px;
  border: 1px solid var(--border-color);
  background: var(--panel-bg);
  color: var(--text-color);
  cursor: pointer;
  transition: background 0.2s;
  line-height: 1;
}

.history-btn:hover:not(:disabled) {
  background: var(--bg-color);
  border-color: var(--primary-color);
}

.history-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.new-project-btn {
  padding: 6px 12px;
  font-size: 13px;
}

.projects-link {
  color: var(--text-muted);
  text-decoration: none;
  font-size: 13px;
}

.projects-link:hover {
  color: var(--text-color);
}

.designer-main {
  display: flex;
  flex: 1;
  overflow: hidden;
}

.left-panel {
  width: 250px;
  min-width: 200px;
  border-right: 1px solid var(--border-color);
}

.center-panel {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.canvas-wrapper {
  flex: 1;
  min-height: 0;
}

.code-wrapper {
  height: 300px;
  border-top: 1px solid var(--border-color);
}

.right-panel {
  width: 280px;
  min-width: 200px;
  border-left: 1px solid var(--border-color);
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal {
  background: var(--panel-bg);
  border-radius: 8px;
  padding: 24px;
  width: 400px;
  max-width: 90%;
}

.modal h3 {
  margin-bottom: 16px;
  font-size: 18px;
}

.modal-input {
  width: 100%;
  margin-bottom: 16px;
}

.modal-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
}

.cancel-btn {
  background: var(--border-color);
}

.submit-btn {
  background: var(--primary-color);
}

/* Error Toast */
.error-toast {
  position: fixed;
  bottom: 24px;
  right: 24px;
  background: #dc3545;
  color: white;
  padding: 16px 24px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  z-index: 2000;
  animation: slideIn 0.3s ease-out;
}

@keyframes slideIn {
  from {
    transform: translateX(400px);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}
</style>
