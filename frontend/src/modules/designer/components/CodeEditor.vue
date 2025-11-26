<template>
  <div class="code-editor panel">
    <div class="panel-header">
      <span>Generated Code</span>
      <div class="editor-actions">
        <select v-model="codeFormat" class="format-select">
          <option value="vue">Vue</option>
          <option value="html">HTML</option>
        </select>
        <button class="action-btn" @click="regenerate" title="Regenerate">🔄</button>
        <button class="action-btn" @click="copyCode" title="Copy">📋</button>
      </div>
    </div>
    <div class="editor-container">
      <codemirror
        v-model="code"
        :style="{ height: '100%' }"
        :extensions="extensions"
        :autofocus="false"
        :indent-with-tab="true"
        :tab-size="2"
      />
    </div>
    <div v-if="copied" class="copy-toast">Copied to clipboard!</div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, shallowRef } from 'vue';
import { Codemirror } from 'vue-codemirror';
import { html } from '@codemirror/lang-html';
import { javascript } from '@codemirror/lang-javascript';
import { oneDark } from '@codemirror/theme-one-dark';
import { useDesignerStore } from '../stores/designer.store';

const store = useDesignerStore();
const codeFormat = ref<'vue' | 'html'>('vue');
const copied = ref(false);

const code = computed({
  get: () => store.generatedCode,
  set: () => {}, // Read-only for now
});

const extensions = shallowRef([html(), javascript(), oneDark]);

watch(codeFormat, async (format) => {
  await store.generateCode(format);
});

async function regenerate() {
  await store.generateCode(codeFormat.value);
}

async function copyCode() {
  try {
    await navigator.clipboard.writeText(code.value);
    copied.value = true;
    setTimeout(() => {
      copied.value = false;
    }, 2000);
  } catch (e) {
    console.error('Failed to copy', e);
  }
}
</script>

<style scoped>
.code-editor {
  height: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
}

.editor-actions {
  display: flex;
  gap: 8px;
  align-items: center;
}

.format-select {
  padding: 4px 8px;
  font-size: 12px;
}

.action-btn {
  padding: 4px 8px;
  font-size: 14px;
  background: transparent;
  border: 1px solid var(--border-color);
  border-radius: 4px;
}

.action-btn:hover {
  background: var(--hover-bg);
}

.editor-container {
  flex: 1;
  overflow: hidden;
}

:deep(.cm-editor) {
  height: 100%;
}

:deep(.cm-scroller) {
  overflow: auto;
}

.copy-toast {
  position: absolute;
  bottom: 16px;
  right: 16px;
  background: var(--primary-color);
  color: white;
  padding: 8px 16px;
  border-radius: 4px;
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
