<template>
  <div class="properties-panel panel">
    <div class="panel-header">
      <span>Properties</span>
    </div>
    <div class="panel-content" v-if="selectedItem">
      <div class="property-group">
        <label class="property-label">ID</label>
        <input
          type="text"
          :value="selectedItem.id"
          disabled
          class="property-input"
        />
      </div>

      <div class="property-group">
        <label class="property-label">Component Type</label>
        <input
          type="text"
          :value="selectedItem.componentType"
          disabled
          class="property-input"
        />
      </div>

      <div class="property-group">
        <label class="property-label">Position X</label>
        <input
          type="number"
          :value="selectedItem.x"
          @input="updateProp('x', Number(($event.target as HTMLInputElement).value))"
          class="property-input"
        />
      </div>

      <div class="property-group">
        <label class="property-label">Position Y</label>
        <input
          type="number"
          :value="selectedItem.y"
          @input="updateProp('y', Number(($event.target as HTMLInputElement).value))"
          class="property-input"
        />
      </div>

      <div class="property-group">
        <label class="property-label">Width</label>
        <input
          type="number"
          :value="selectedItem.w"
          @input="updateProp('w', Number(($event.target as HTMLInputElement).value))"
          min="1"
          max="12"
          class="property-input"
        />
      </div>

      <div class="property-group">
        <label class="property-label">Height</label>
        <input
          type="number"
          :value="selectedItem.h"
          @input="updateProp('h', Number(($event.target as HTMLInputElement).value))"
          min="1"
          class="property-input"
        />
      </div>

      <div v-if="selectedItem.props" class="props-section">
        <h4 class="section-title">Component Props</h4>
        <div v-for="(value, key) in selectedItem.props" :key="key" class="property-group">
          <label class="property-label">{{ formatLabel(String(key)) }}</label>
          <input
            v-if="typeof value === 'string'"
            type="text"
            :value="value"
            @input="updateComponentProp(String(key), ($event.target as HTMLInputElement).value)"
            class="property-input"
          />
          <input
            v-else-if="typeof value === 'number'"
            type="number"
            :value="value"
            @input="updateComponentProp(String(key), Number(($event.target as HTMLInputElement).value))"
            class="property-input"
          />
          <input
            v-else-if="typeof value === 'boolean'"
            type="checkbox"
            :checked="value"
            @change="updateComponentProp(String(key), ($event.target as HTMLInputElement).checked)"
            class="property-checkbox"
          />
        </div>
      </div>

      <div v-if="selectedItem.children && selectedItem.children.length > 0" class="children-section">
        <h4 class="section-title">Nested Children ({{ selectedItem.children.length }})</h4>
        <div class="children-list">
          <div 
            v-for="child in selectedItem.children" 
            :key="child.id"
            class="child-item"
          >
            <div class="child-info">
              <span class="child-type">{{ child.componentType }}</span>
              <span class="child-id">{{ child.id.substring(0, 8) }}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="actions">
        <button class="delete-btn" @click="deleteItem">Delete Component</button>
      </div>
    </div>
    <div class="panel-content empty" v-else>
      <p>Select a component to edit its properties</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useDesignerStore } from '../stores/designer.store';

const store = useDesignerStore();

const selectedItem = computed(() => store.selectedItem);

function updateProp(prop: 'x' | 'y' | 'w' | 'h', value: number) {
  if (!selectedItem.value) return;
  
  const updated = { ...selectedItem.value, [prop]: value };
  store.updateItem(updated);
}

function updateComponentProp(key: string, value: unknown) {
  if (!selectedItem.value) return;
  
  const updated = {
    ...selectedItem.value,
    props: {
      ...selectedItem.value.props,
      [key]: value,
    },
  };
  store.updateItem(updated);
}

function deleteItem() {
  if (selectedItem.value) {
    store.removeItem(selectedItem.value.id);
  }
}

function formatLabel(key: string): string {
  return key
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, str => str.toUpperCase())
    .trim();
}
</script>

<style scoped>
.properties-panel {
  height: 100%;
  overflow-y: auto;
}

.property-group {
  margin-bottom: 12px;
}

.property-label {
  display: block;
  font-size: 12px;
  color: var(--text-muted);
  margin-bottom: 4px;
}

.property-input {
  width: 100%;
}

.property-checkbox {
  width: 18px;
  height: 18px;
}

.props-section {
  margin-top: 20px;
  padding-top: 16px;
  border-top: 1px solid var(--border-color);
}

.children-section {
  margin-top: 20px;
  padding-top: 16px;
  border-top: 1px solid var(--border-color);
}

.children-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.child-item {
  background: var(--bg-color);
  border: 1px solid var(--border-color);
  border-radius: 4px;
  padding: 8px;
}

.child-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.child-type {
  font-size: 12px;
  font-weight: 600;
  color: var(--text-color);
}

.child-id {
  font-size: 10px;
  color: var(--text-muted);
  font-family: monospace;
}

.section-title {
  font-size: 13px;
  font-weight: 600;
  margin-bottom: 12px;
  color: var(--text-color);
}

.actions {
  margin-top: 24px;
  padding-top: 16px;
  border-top: 1px solid var(--border-color);
}

.delete-btn {
  width: 100%;
  background: #e74c3c;
  padding: 10px;
}

.delete-btn:hover {
  background: #c0392b;
}

.empty {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 200px;
  color: var(--text-muted);
  text-align: center;
}
</style>
