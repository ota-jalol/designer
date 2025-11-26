<template>
  <div class="projects-page">
    <header class="page-header">
      <div class="header-content">
        <router-link to="/" class="back-link">← Back to Designer</router-link>
        <h1>Projects</h1>
      </div>
      <button @click="createNewProject" class="new-project-btn">+ New Project</button>
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
          @click="openProject(project.id)"
        >
          <div class="project-preview">
            <span class="preview-icon">🎨</span>
          </div>
          <div class="project-info">
            <h3 class="project-name">{{ project.name }}</h3>
            <p class="project-meta">
              {{ project.layout?.length || 0 }} components
            </p>
            <p class="project-date">
              Updated: {{ formatDate(project.updatedAt) }}
            </p>
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
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useDesignerStore } from '../stores/designer.store';

const store = useDesignerStore();
const router = useRouter();

const showNewProjectModal = ref(false);
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
  cursor: pointer;
  transition: border-color 0.2s, transform 0.2s;
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
}

.project-info {
  padding: 16px;
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
</style>
