<template>
  <div class="projects-page">
    <header class="page-header">
      <div class="header-content">
        <h1>Projects</h1>
        <p class="user-info" v-if="store.currentUser">{{ store.currentUser.name }}</p>
      </div>
      <div class="header-actions">
        <button @click="showImportModal = true" class="import-btn">📥 Import</button>
        <button @click="createNewProject" class="new-project-btn">+ New Project</button>
        <button @click="handleLogout" class="logout-btn">Logout</button>
      </div>
    </header>

    <main class="page-content">
      <div v-if="isLoading" class="loading">Loading projects...</div>
      
      <div v-else-if="projects.length === 0" class="empty-state">
        <p>No projects yet. Create your first project!</p>
        <button @click="createNewProject" class="create-btn">Create Project</button>
      </div>

      <div v-else class="projects-grid">
        <div
          v-for="project in projects"
          :key="project.id"
          class="project-card"
        >
          <div class="project-preview" @click="openProject(project.id)">
            <span class="preview-icon">🎨</span>
          </div>
          <div class="project-info" @click="openProject(project.id)">
            <h3 class="project-name">{{ project.name }}</h3>
            <p class="project-meta">
              {{ project.layout?.length || 0 }} components
            </p>
            <p class="project-date">
              Updated: {{ formatDate(project.updatedAt) }}
            </p>
          </div>
          <div class="project-actions">
            <button @click.stop="handleExport(project.id)" class="action-btn" title="Export">📤</button>
            <button @click.stop="handleDelete(project.id)" class="action-btn danger" title="Delete">🗑️</button>
          </div>
        </div>
      </div>
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

    <!-- Import Project Modal -->
    <div v-if="showImportModal" class="modal-overlay" @click.self="showImportModal = false">
      <div class="modal">
        <h3>Import Project</h3>
        <input
          type="file"
          accept=".json"
          @change="handleImportFile"
          class="file-input"
        />
        <div class="modal-actions">
          <button @click="showImportModal = false" class="cancel-btn">Cancel</button>
        </div>
      </div>
    </div>

    <!-- Error Message -->
    <div v-if="store.error" class="error-toast">{{ store.error }}</div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useDesignerStore } from '../stores/designer.store';

const store = useDesignerStore();
const router = useRouter();

const showNewProjectModal = ref(false);
const showImportModal = ref(false);
const newProjectName = ref('');

const isLoading = computed(() => store.isLoading);
const projects = computed(() => store.projects);

onMounted(async () => {
  await store.loadProjects();
});

function openProject(projectId: string) {
  router.push(`/designer/${projectId}`);
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

async function handleExport(projectId: string) {
  await store.exportProject(projectId);
}

async function handleDelete(projectId: string) {
  if (confirm('Are you sure you want to delete this project?')) {
    await store.deleteProject(projectId);
    await store.loadProjects();
  }
}

async function handleImportFile(event: Event) {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];
  if (file) {
    const success = await store.importProject(file);
    if (success) {
      showImportModal.value = false;
      await store.loadProjects();
    }
  }
}

function handleLogout() {
  if (confirm('Are you sure you want to logout?')) {
    store.logout();
    router.push('/login');
  }
}

function formatDate(dateStr: string): string {
  try {
    return new Date(dateStr).toLocaleDateString();
  } catch {
    return 'Unknown';
  }
}
</script>

<style scoped>
.projects-page {
  min-height: 100vh;
  padding: 24px;
}

.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 32px;
}

.header-content {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.header-actions {
  display: flex;
  gap: 12px;
  align-items: center;
}

.import-btn, .logout-btn {
  padding: 8px 16px;
  border-radius: 6px;
  border: 1px solid var(--border-color);
  background: var(--panel-bg);
  color: var(--text-color);
  cursor: pointer;
  font-size: 14px;
  transition: background 0.2s;
}

.import-btn:hover {
  background: var(--bg-color);
}

.logout-btn {
  background: #dc3545;
  border-color: #dc3545;
  color: white;
}

.logout-btn:hover {
  background: #c82333;
  border-color: #c82333;
}

.back-link {
  color: var(--text-muted);
  text-decoration: none;
  font-size: 14px;
}

.back-link:hover {
  color: var(--primary-color);
}

h1 {
  font-size: 28px;
  font-weight: 600;
}

.new-project-btn {
  padding: 10px 20px;
}

.page-content {
  max-width: 1200px;
  margin: 0 auto;
}

.loading, .empty-state {
  text-align: center;
  padding: 60px 20px;
  color: var(--text-muted);
}

.create-btn {
  margin-top: 16px;
}

.projects-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 24px;
}

.project-card {
  background: var(--panel-bg);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  overflow: hidden;
  transition: border-color 0.2s, transform 0.2s;
  position: relative;
}

.project-card:hover {
  border-color: var(--primary-color);
  transform: translateY(-2px);
}

.project-preview {
  height: 140px;
  background: var(--bg-color);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 48px;
  cursor: pointer;
}

.project-info {
  padding: 16px;
  cursor: pointer;
}

.project-name {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 8px;
}

.project-meta, .project-date {
  font-size: 13px;
  color: var(--text-muted);
  margin-bottom: 4px;
}

.project-actions {
  display: flex;
  gap: 8px;
  padding: 0 16px 16px;
}

.action-btn {
  flex: 1;
  padding: 6px 12px;
  border-radius: 4px;
  border: 1px solid var(--border-color);
  background: var(--panel-bg);
  color: var(--text-color);
  cursor: pointer;
  font-size: 13px;
  transition: background 0.2s;
}

.action-btn:hover {
  background: var(--bg-color);
}

.action-btn.delete-btn {
  color: #dc3545;
  border-color: #dc3545;
}

.action-btn.delete-btn:hover {
  background: #dc3545;
  color: white;
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

.file-input {
  width: 100%;
  padding: 8px;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  background: var(--bg-color);
  color: var(--text-color);
  cursor: pointer;
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
