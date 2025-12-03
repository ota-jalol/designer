<template>
  <div class="component-palette panel">
    <div class="panel-header">
      <span>Components</span>
      <button class="add-package-btn" @click="showPackageModal = true" title="Add NPM Package">
        📦+
      </button>
    </div>
    <div class="panel-content">
      <div v-for="category in categories" :key="category" class="category">
        <div class="category-header" @click="toggleCategory(category)">
          <span class="category-icon">{{ expandedCategories[category] ? '▼' : '▶' }}</span>
          <span class="category-name">{{ formatCategory(category) }}</span>
          <span v-if="isPackageCategory(category)" class="package-badge">📦</span>
        </div>
        <div v-show="expandedCategories[category]" class="category-items">
          <div
            v-for="component in getComponentsByCategory(category)"
            :key="component.id"
            class="component-item"
            draggable="true"
            @dragstart="onDragStart($event, component)"
            @click="onComponentClick(component)"
          >
            <span class="component-icon">{{ getIcon(component.icon) }}</span>
            <span class="component-name">{{ component.name }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Package Manager Modal -->
    <div v-if="showPackageModal" class="modal-overlay" @click.self="showPackageModal = false">
      <div class="modal package-modal">
        <h3>📦 NPM Package Manager</h3>
        
        <div class="package-input-section">
          <label>Enter package name:</label>
          <div class="package-input-row">
            <input
              v-model="packageNameInput"
              type="text"
              placeholder="e.g., vuetify, element-plus, primevue"
              class="modal-input"
              @keyup.enter="installPackage"
            />
            <button @click="installPackage" class="install-btn" :disabled="!packageNameInput.trim() || isInstalling">
              {{ isInstalling ? '...' : 'Install' }}
            </button>
          </div>
          <div v-if="installMessage" :class="['install-message', installSuccess ? 'success' : 'error']">
            {{ installMessage }}
          </div>
        </div>

        <div class="supported-packages-section">
          <label>Supported packages (click to install):</label>
          <div class="package-chips">
            <button
              v-for="pkg in supportedPackages"
              :key="pkg"
              class="package-chip"
              :class="{ installed: installedPackageNames.includes(pkg) }"
              @click="quickInstall(pkg)"
              :disabled="installedPackageNames.includes(pkg)"
            >
              {{ pkg }}
              <span v-if="installedPackageNames.includes(pkg)" class="check">✓</span>
            </button>
          </div>
        </div>

        <div v-if="installedPackages.length > 0" class="installed-packages-section">
          <label>Installed packages:</label>
          <div class="installed-list">
            <div v-for="pkg in installedPackages" :key="pkg.name" class="installed-package">
              <span class="pkg-name">{{ pkg.name }}</span>
              <span class="pkg-count">{{ pkg.components.length }} components</span>
              <button class="uninstall-btn" @click="uninstallPackage(pkg.name)" title="Uninstall">×</button>
            </div>
          </div>
        </div>

        <div class="modal-actions">
          <button @click="showPackageModal = false" class="close-btn">Close</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import type { ComponentDefinition } from '../types';
import { useDesignerStore } from '../stores/designer.store';
import { api, type NpmPackageInfo } from '@shared/services/api';

const store = useDesignerStore();

const categories = computed(() => store.categories);
const expandedCategories = ref<Record<string, boolean>>({
  html: true,
  form: true,
  layout: true,
});

// Package management state
const showPackageModal = ref(false);
const packageNameInput = ref('');
const isInstalling = ref(false);
const installMessage = ref('');
const installSuccess = ref(false);
const supportedPackages = ref<string[]>([]);
const installedPackages = ref<NpmPackageInfo[]>([]);

const installedPackageNames = computed(() => installedPackages.value.map(p => p.name));

const iconMap: Record<string, string> = {
  box: '📦',
  'cursor-click': '🖱️',
  edit: '✏️',
  heading: '📰',
  'align-left': '📄',
  image: '🖼️',
  link: '🔗',
  document: '📋',
  'chevron-down': '⬇️',
  'document-text': '📝',
  'view-horizontal': '↔️',
  'view-grid': '🔲',
};

// Load package info on mount
onMounted(async () => {
  await loadPackageInfo();
});

// Auto-expand new categories when packages are installed
watch(installedPackages, (newPackages) => {
  newPackages.forEach(pkg => {
    if (pkg.name && !expandedCategories.value[pkg.name]) {
      expandedCategories.value[pkg.name] = true;
    }
  });
});

async function loadPackageInfo() {
  try {
    supportedPackages.value = await api.getSupportedPackages();
    installedPackages.value = await api.getInstalledPackages();
  } catch (e) {
    console.error('Failed to load package info:', e);
  }
}

function toggleCategory(category: string) {
  expandedCategories.value[category] = !expandedCategories.value[category];
}

function formatCategory(category: string): string {
  return category.charAt(0).toUpperCase() + category.slice(1);
}

function isPackageCategory(category: string): boolean {
  return supportedPackages.value.includes(category);
}

function getComponentsByCategory(category: string): ComponentDefinition[] {
  return store.components.filter(c => c.category === category);
}

function getIcon(iconName: string): string {
  return iconMap[iconName] || '📦';
}

function onDragStart(event: DragEvent, component: ComponentDefinition) {
  event.dataTransfer?.setData('application/json', JSON.stringify(component));
  event.dataTransfer!.effectAllowed = 'copy';
}

function onComponentClick(component: ComponentDefinition) {
  store.addComponent(component);
}

async function installPackage() {
  if (!packageNameInput.value.trim() || isInstalling.value) return;

  isInstalling.value = true;
  installMessage.value = '';

  try {
    const result = await api.installPackage(packageNameInput.value.trim());
    installSuccess.value = result.success;
    installMessage.value = result.message;

    if (result.success) {
      packageNameInput.value = '';
      await loadPackageInfo();
      await store.loadComponents();
    }
  } catch (e) {
    installSuccess.value = false;
    installMessage.value = 'Failed to install package';
  } finally {
    isInstalling.value = false;
  }
}

async function quickInstall(packageName: string) {
  packageNameInput.value = packageName;
  await installPackage();
}

async function uninstallPackage(packageName: string) {
  try {
    const result = await api.uninstallPackage(packageName);
    if (result.success) {
      await loadPackageInfo();
      await store.loadComponents();
    }
  } catch (e) {
    console.error('Failed to uninstall package:', e);
  }
}
</script>

<style scoped>
.component-palette {
  height: 100%;
  overflow-y: auto;
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.add-package-btn {
  background: transparent;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  padding: 4px 8px;
  cursor: pointer;
  font-size: 14px;
}

.add-package-btn:hover {
  background: var(--hover-bg);
}

.category {
  margin-bottom: 8px;
}

.category-header {
  display: flex;
  align-items: center;
  padding: 8px;
  cursor: pointer;
  background: var(--hover-bg);
  border-radius: 4px;
  font-weight: 500;
}

.category-header:hover {
  background: var(--border-color);
}

.category-icon {
  font-size: 10px;
  margin-right: 8px;
  color: var(--text-muted);
}

.category-name {
  text-transform: capitalize;
  flex: 1;
}

.package-badge {
  font-size: 12px;
  margin-left: 4px;
}

.category-items {
  padding: 4px 0 4px 16px;
}

.component-item {
  display: flex;
  align-items: center;
  padding: 8px;
  cursor: grab;
  border-radius: 4px;
  margin: 2px 0;
  transition: background 0.2s;
}

.component-item:hover {
  background: var(--hover-bg);
}

.component-item:active {
  cursor: grabbing;
}

.component-icon {
  margin-right: 8px;
  font-size: 16px;
}

.component-name {
  font-size: 13px;
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

.package-modal {
  background: var(--panel-bg);
  border-radius: 8px;
  padding: 24px;
  width: 500px;
  max-width: 90%;
  max-height: 80vh;
  overflow-y: auto;
}

.package-modal h3 {
  margin-bottom: 20px;
  font-size: 18px;
}

.package-modal label {
  display: block;
  font-size: 13px;
  color: var(--text-muted);
  margin-bottom: 8px;
}

.package-input-section {
  margin-bottom: 20px;
}

.package-input-row {
  display: flex;
  gap: 8px;
}

.modal-input {
  flex: 1;
}

.install-btn {
  padding: 8px 16px;
  background: var(--primary-color);
  white-space: nowrap;
}

.install-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.install-message {
  margin-top: 8px;
  padding: 8px 12px;
  border-radius: 4px;
  font-size: 13px;
}

.install-message.success {
  background: rgba(66, 184, 131, 0.2);
  color: var(--primary-color);
}

.install-message.error {
  background: rgba(231, 76, 60, 0.2);
  color: #e74c3c;
}

.supported-packages-section {
  margin-bottom: 20px;
}

.package-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.package-chip {
  padding: 6px 12px;
  background: var(--hover-bg);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  cursor: pointer;
  font-size: 13px;
  transition: all 0.2s;
}

.package-chip:hover:not(:disabled) {
  background: var(--border-color);
  border-color: var(--primary-color);
}

.package-chip.installed {
  background: rgba(66, 184, 131, 0.2);
  border-color: var(--primary-color);
  cursor: default;
}

.package-chip .check {
  margin-left: 4px;
  color: var(--primary-color);
}

.installed-packages-section {
  margin-bottom: 20px;
}

.installed-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.installed-package {
  display: flex;
  align-items: center;
  padding: 8px 12px;
  background: var(--hover-bg);
  border-radius: 4px;
}

.pkg-name {
  flex: 1;
  font-weight: 500;
}

.pkg-count {
  font-size: 12px;
  color: var(--text-muted);
  margin-right: 12px;
}

.uninstall-btn {
  width: 24px;
  height: 24px;
  padding: 0;
  background: rgba(231, 76, 60, 0.6);
  border-radius: 4px;
  font-size: 16px;
  line-height: 1;
}

.uninstall-btn:hover {
  background: #e74c3c;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
}

.close-btn {
  background: var(--border-color);
}
</style>
