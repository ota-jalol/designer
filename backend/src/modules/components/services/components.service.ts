import { Injectable } from '@nestjs/common';
import { ComponentDefinition, NpmPackageInfo } from '../entities/component.entity';

// Predefined component mappings for popular Vue UI libraries
const NPM_PACKAGE_COMPONENTS: Record<string, ComponentDefinition[]> = {
  'vuetify': [
    {
      id: 'v-btn',
      name: 'V-Button',
      category: 'vuetify',
      tag: 'v-btn',
      icon: 'cursor-click',
      defaultProps: { color: 'primary' },
      editableProps: [
        { name: 'color', type: 'string', default: 'primary', label: 'Color' },
        { name: 'variant', type: 'select', default: 'elevated', options: ['elevated', 'flat', 'tonal', 'outlined', 'text', 'plain'], label: 'Variant' },
        { name: 'size', type: 'select', default: 'default', options: ['x-small', 'small', 'default', 'large', 'x-large'], label: 'Size' },
        { name: 'disabled', type: 'boolean', default: false, label: 'Disabled' },
      ],
      defaultSize: { w: 2, h: 1 },
      packageName: 'vuetify',
    },
    {
      id: 'v-text-field',
      name: 'V-Text Field',
      category: 'vuetify',
      tag: 'v-text-field',
      icon: 'edit',
      defaultProps: { label: 'Label', variant: 'outlined' },
      editableProps: [
        { name: 'label', type: 'string', default: 'Label', label: 'Label' },
        { name: 'placeholder', type: 'string', default: '', label: 'Placeholder' },
        { name: 'variant', type: 'select', default: 'outlined', options: ['outlined', 'filled', 'underlined', 'solo', 'plain'], label: 'Variant' },
        { name: 'disabled', type: 'boolean', default: false, label: 'Disabled' },
      ],
      defaultSize: { w: 3, h: 1 },
      packageName: 'vuetify',
    },
    {
      id: 'v-card',
      name: 'V-Card',
      category: 'vuetify',
      tag: 'v-card',
      icon: 'box',
      defaultProps: { title: 'Card Title' },
      editableProps: [
        { name: 'title', type: 'string', default: 'Card Title', label: 'Title' },
        { name: 'subtitle', type: 'string', default: '', label: 'Subtitle' },
        { name: 'variant', type: 'select', default: 'elevated', options: ['elevated', 'flat', 'tonal', 'outlined', 'text', 'plain'], label: 'Variant' },
      ],
      defaultSize: { w: 4, h: 3 },
      packageName: 'vuetify',
    },
    {
      id: 'v-select',
      name: 'V-Select',
      category: 'vuetify',
      tag: 'v-select',
      icon: 'chevron-down',
      defaultProps: { label: 'Select', items: [] },
      editableProps: [
        { name: 'label', type: 'string', default: 'Select', label: 'Label' },
        { name: 'variant', type: 'select', default: 'outlined', options: ['outlined', 'filled', 'underlined', 'solo', 'plain'], label: 'Variant' },
        { name: 'disabled', type: 'boolean', default: false, label: 'Disabled' },
      ],
      defaultSize: { w: 3, h: 1 },
      packageName: 'vuetify',
    },
    {
      id: 'v-checkbox',
      name: 'V-Checkbox',
      category: 'vuetify',
      tag: 'v-checkbox',
      icon: 'box',
      defaultProps: { label: 'Checkbox' },
      editableProps: [
        { name: 'label', type: 'string', default: 'Checkbox', label: 'Label' },
        { name: 'color', type: 'string', default: 'primary', label: 'Color' },
        { name: 'disabled', type: 'boolean', default: false, label: 'Disabled' },
      ],
      defaultSize: { w: 2, h: 1 },
      packageName: 'vuetify',
    },
  ],
  'element-plus': [
    {
      id: 'el-button',
      name: 'El-Button',
      category: 'element-plus',
      tag: 'el-button',
      icon: 'cursor-click',
      defaultProps: { type: 'primary' },
      editableProps: [
        { name: 'type', type: 'select', default: 'primary', options: ['primary', 'success', 'warning', 'danger', 'info'], label: 'Type' },
        { name: 'size', type: 'select', default: 'default', options: ['large', 'default', 'small'], label: 'Size' },
        { name: 'plain', type: 'boolean', default: false, label: 'Plain' },
        { name: 'round', type: 'boolean', default: false, label: 'Round' },
        { name: 'disabled', type: 'boolean', default: false, label: 'Disabled' },
      ],
      defaultSize: { w: 2, h: 1 },
      packageName: 'element-plus',
    },
    {
      id: 'el-input',
      name: 'El-Input',
      category: 'element-plus',
      tag: 'el-input',
      icon: 'edit',
      defaultProps: { placeholder: 'Please input' },
      editableProps: [
        { name: 'placeholder', type: 'string', default: 'Please input', label: 'Placeholder' },
        { name: 'type', type: 'select', default: 'text', options: ['text', 'password', 'textarea'], label: 'Type' },
        { name: 'size', type: 'select', default: 'default', options: ['large', 'default', 'small'], label: 'Size' },
        { name: 'disabled', type: 'boolean', default: false, label: 'Disabled' },
      ],
      defaultSize: { w: 3, h: 1 },
      packageName: 'element-plus',
    },
    {
      id: 'el-card',
      name: 'El-Card',
      category: 'element-plus',
      tag: 'el-card',
      icon: 'box',
      defaultProps: { header: 'Card Header' },
      editableProps: [
        { name: 'header', type: 'string', default: 'Card Header', label: 'Header' },
        { name: 'shadow', type: 'select', default: 'always', options: ['always', 'hover', 'never'], label: 'Shadow' },
      ],
      defaultSize: { w: 4, h: 3 },
      packageName: 'element-plus',
    },
    {
      id: 'el-select',
      name: 'El-Select',
      category: 'element-plus',
      tag: 'el-select',
      icon: 'chevron-down',
      defaultProps: { placeholder: 'Select' },
      editableProps: [
        { name: 'placeholder', type: 'string', default: 'Select', label: 'Placeholder' },
        { name: 'size', type: 'select', default: 'default', options: ['large', 'default', 'small'], label: 'Size' },
        { name: 'disabled', type: 'boolean', default: false, label: 'Disabled' },
      ],
      defaultSize: { w: 3, h: 1 },
      packageName: 'element-plus',
    },
  ],
  'primevue': [
    {
      id: 'p-button',
      name: 'P-Button',
      category: 'primevue',
      tag: 'Button',
      icon: 'cursor-click',
      defaultProps: { label: 'Button' },
      editableProps: [
        { name: 'label', type: 'string', default: 'Button', label: 'Label' },
        { name: 'severity', type: 'select', default: 'primary', options: ['primary', 'secondary', 'success', 'info', 'warning', 'help', 'danger'], label: 'Severity' },
        { name: 'size', type: 'select', default: 'normal', options: ['small', 'normal', 'large'], label: 'Size' },
        { name: 'outlined', type: 'boolean', default: false, label: 'Outlined' },
        { name: 'disabled', type: 'boolean', default: false, label: 'Disabled' },
      ],
      defaultSize: { w: 2, h: 1 },
      packageName: 'primevue',
    },
    {
      id: 'p-inputtext',
      name: 'P-InputText',
      category: 'primevue',
      tag: 'InputText',
      icon: 'edit',
      defaultProps: { placeholder: 'Enter text' },
      editableProps: [
        { name: 'placeholder', type: 'string', default: 'Enter text', label: 'Placeholder' },
        { name: 'disabled', type: 'boolean', default: false, label: 'Disabled' },
      ],
      defaultSize: { w: 3, h: 1 },
      packageName: 'primevue',
    },
    {
      id: 'p-card',
      name: 'P-Card',
      category: 'primevue',
      tag: 'Card',
      icon: 'box',
      defaultProps: {},
      editableProps: [],
      defaultSize: { w: 4, h: 3 },
      packageName: 'primevue',
    },
    {
      id: 'p-dropdown',
      name: 'P-Dropdown',
      category: 'primevue',
      tag: 'Dropdown',
      icon: 'chevron-down',
      defaultProps: { placeholder: 'Select' },
      editableProps: [
        { name: 'placeholder', type: 'string', default: 'Select', label: 'Placeholder' },
        { name: 'disabled', type: 'boolean', default: false, label: 'Disabled' },
      ],
      defaultSize: { w: 3, h: 1 },
      packageName: 'primevue',
    },
  ],
  'ant-design-vue': [
    {
      id: 'a-button',
      name: 'A-Button',
      category: 'ant-design-vue',
      tag: 'a-button',
      icon: 'cursor-click',
      defaultProps: { type: 'primary' },
      editableProps: [
        { name: 'type', type: 'select', default: 'primary', options: ['primary', 'default', 'dashed', 'text', 'link'], label: 'Type' },
        { name: 'size', type: 'select', default: 'middle', options: ['large', 'middle', 'small'], label: 'Size' },
        { name: 'danger', type: 'boolean', default: false, label: 'Danger' },
        { name: 'disabled', type: 'boolean', default: false, label: 'Disabled' },
      ],
      defaultSize: { w: 2, h: 1 },
      packageName: 'ant-design-vue',
    },
    {
      id: 'a-input',
      name: 'A-Input',
      category: 'ant-design-vue',
      tag: 'a-input',
      icon: 'edit',
      defaultProps: { placeholder: 'Please input' },
      editableProps: [
        { name: 'placeholder', type: 'string', default: 'Please input', label: 'Placeholder' },
        { name: 'size', type: 'select', default: 'middle', options: ['large', 'middle', 'small'], label: 'Size' },
        { name: 'disabled', type: 'boolean', default: false, label: 'Disabled' },
      ],
      defaultSize: { w: 3, h: 1 },
      packageName: 'ant-design-vue',
    },
    {
      id: 'a-card',
      name: 'A-Card',
      category: 'ant-design-vue',
      tag: 'a-card',
      icon: 'box',
      defaultProps: { title: 'Card Title' },
      editableProps: [
        { name: 'title', type: 'string', default: 'Card Title', label: 'Title' },
        { name: 'bordered', type: 'boolean', default: true, label: 'Bordered' },
        { name: 'hoverable', type: 'boolean', default: false, label: 'Hoverable' },
      ],
      defaultSize: { w: 4, h: 3 },
      packageName: 'ant-design-vue',
    },
    {
      id: 'a-select',
      name: 'A-Select',
      category: 'ant-design-vue',
      tag: 'a-select',
      icon: 'chevron-down',
      defaultProps: { placeholder: 'Select' },
      editableProps: [
        { name: 'placeholder', type: 'string', default: 'Select', label: 'Placeholder' },
        { name: 'size', type: 'select', default: 'middle', options: ['large', 'middle', 'small'], label: 'Size' },
        { name: 'disabled', type: 'boolean', default: false, label: 'Disabled' },
      ],
      defaultSize: { w: 3, h: 1 },
      packageName: 'ant-design-vue',
    },
  ],
  'naive-ui': [
    {
      id: 'n-button',
      name: 'N-Button',
      category: 'naive-ui',
      tag: 'n-button',
      icon: 'cursor-click',
      defaultProps: { type: 'primary' },
      editableProps: [
        { name: 'type', type: 'select', default: 'primary', options: ['default', 'tertiary', 'primary', 'info', 'success', 'warning', 'error'], label: 'Type' },
        { name: 'size', type: 'select', default: 'medium', options: ['tiny', 'small', 'medium', 'large'], label: 'Size' },
        { name: 'ghost', type: 'boolean', default: false, label: 'Ghost' },
        { name: 'disabled', type: 'boolean', default: false, label: 'Disabled' },
      ],
      defaultSize: { w: 2, h: 1 },
      packageName: 'naive-ui',
    },
    {
      id: 'n-input',
      name: 'N-Input',
      category: 'naive-ui',
      tag: 'n-input',
      icon: 'edit',
      defaultProps: { placeholder: 'Please input' },
      editableProps: [
        { name: 'placeholder', type: 'string', default: 'Please input', label: 'Placeholder' },
        { name: 'type', type: 'select', default: 'text', options: ['text', 'password', 'textarea'], label: 'Type' },
        { name: 'size', type: 'select', default: 'medium', options: ['tiny', 'small', 'medium', 'large'], label: 'Size' },
        { name: 'disabled', type: 'boolean', default: false, label: 'Disabled' },
      ],
      defaultSize: { w: 3, h: 1 },
      packageName: 'naive-ui',
    },
    {
      id: 'n-card',
      name: 'N-Card',
      category: 'naive-ui',
      tag: 'n-card',
      icon: 'box',
      defaultProps: { title: 'Card Title' },
      editableProps: [
        { name: 'title', type: 'string', default: 'Card Title', label: 'Title' },
        { name: 'bordered', type: 'boolean', default: true, label: 'Bordered' },
        { name: 'hoverable', type: 'boolean', default: false, label: 'Hoverable' },
      ],
      defaultSize: { w: 4, h: 3 },
      packageName: 'naive-ui',
    },
    {
      id: 'n-select',
      name: 'N-Select',
      category: 'naive-ui',
      tag: 'n-select',
      icon: 'chevron-down',
      defaultProps: { placeholder: 'Select' },
      editableProps: [
        { name: 'placeholder', type: 'string', default: 'Select', label: 'Placeholder' },
        { name: 'size', type: 'select', default: 'medium', options: ['tiny', 'small', 'medium', 'large'], label: 'Size' },
        { name: 'disabled', type: 'boolean', default: false, label: 'Disabled' },
      ],
      defaultSize: { w: 3, h: 1 },
      packageName: 'naive-ui',
    },
  ],
};

@Injectable()
export class ComponentsService {
  private installedPackages: Set<string> = new Set();
  
  private components: ComponentDefinition[] = [
    // HTML Basic Elements
    {
      id: 'div',
      name: 'Div Container',
      category: 'html',
      tag: 'div',
      icon: 'box',
      defaultProps: { class: 'container' },
      editableProps: [
        { name: 'class', type: 'string', default: 'container', label: 'CSS Class' },
      ],
      defaultSize: { w: 4, h: 2 },
    },
    {
      id: 'button',
      name: 'Button',
      category: 'html',
      tag: 'button',
      icon: 'cursor-click',
      defaultProps: { type: 'button' },
      editableProps: [
        { name: 'type', type: 'select', default: 'button', options: ['button', 'submit', 'reset'], label: 'Type' },
        { name: 'disabled', type: 'boolean', default: false, label: 'Disabled' },
      ],
      defaultSize: { w: 2, h: 1 },
    },
    {
      id: 'input',
      name: 'Input',
      category: 'html',
      tag: 'input',
      icon: 'edit',
      defaultProps: { type: 'text', placeholder: 'Enter text...' },
      editableProps: [
        { name: 'type', type: 'select', default: 'text', options: ['text', 'password', 'email', 'number'], label: 'Type' },
        { name: 'placeholder', type: 'string', default: 'Enter text...', label: 'Placeholder' },
        { name: 'disabled', type: 'boolean', default: false, label: 'Disabled' },
      ],
      defaultSize: { w: 3, h: 1 },
    },
    {
      id: 'heading',
      name: 'Heading',
      category: 'html',
      tag: 'h1',
      icon: 'heading',
      defaultProps: {},
      editableProps: [
        { name: 'level', type: 'select', default: '1', options: ['1', '2', '3', '4', '5', '6'], label: 'Level' },
      ],
      defaultSize: { w: 4, h: 1 },
    },
    {
      id: 'paragraph',
      name: 'Paragraph',
      category: 'html',
      tag: 'p',
      icon: 'align-left',
      defaultProps: {},
      editableProps: [],
      defaultSize: { w: 4, h: 2 },
    },
    {
      id: 'image',
      name: 'Image',
      category: 'html',
      tag: 'img',
      icon: 'image',
      defaultProps: { src: '', alt: 'Image' },
      editableProps: [
        { name: 'src', type: 'string', default: '', label: 'Source URL' },
        { name: 'alt', type: 'string', default: 'Image', label: 'Alt Text' },
      ],
      defaultSize: { w: 3, h: 3 },
    },
    {
      id: 'link',
      name: 'Link',
      category: 'html',
      tag: 'a',
      icon: 'link',
      defaultProps: { href: '#' },
      editableProps: [
        { name: 'href', type: 'string', default: '#', label: 'URL' },
        { name: 'target', type: 'select', default: '_self', options: ['_self', '_blank'], label: 'Target' },
      ],
      defaultSize: { w: 2, h: 1 },
    },
    // Form Elements
    {
      id: 'form',
      name: 'Form',
      category: 'form',
      tag: 'form',
      icon: 'document',
      defaultProps: {},
      editableProps: [
        { name: 'action', type: 'string', default: '', label: 'Action' },
        { name: 'method', type: 'select', default: 'post', options: ['get', 'post'], label: 'Method' },
      ],
      defaultSize: { w: 6, h: 4 },
    },
    {
      id: 'select',
      name: 'Select',
      category: 'form',
      tag: 'select',
      icon: 'chevron-down',
      defaultProps: {},
      editableProps: [
        { name: 'disabled', type: 'boolean', default: false, label: 'Disabled' },
      ],
      defaultSize: { w: 3, h: 1 },
    },
    {
      id: 'textarea',
      name: 'Textarea',
      category: 'form',
      tag: 'textarea',
      icon: 'document-text',
      defaultProps: { placeholder: 'Enter text...' },
      editableProps: [
        { name: 'placeholder', type: 'string', default: 'Enter text...', label: 'Placeholder' },
        { name: 'rows', type: 'number', default: 4, label: 'Rows' },
      ],
      defaultSize: { w: 4, h: 3 },
    },
    // Layout Elements
    {
      id: 'flex-container',
      name: 'Flex Container',
      category: 'layout',
      tag: 'div',
      icon: 'view-horizontal',
      defaultProps: { class: 'flex' },
      editableProps: [
        { name: 'direction', type: 'select', default: 'row', options: ['row', 'column'], label: 'Direction' },
        { name: 'justify', type: 'select', default: 'start', options: ['start', 'center', 'end', 'between', 'around'], label: 'Justify' },
        { name: 'align', type: 'select', default: 'stretch', options: ['start', 'center', 'end', 'stretch'], label: 'Align' },
      ],
      defaultSize: { w: 6, h: 3 },
    },
    {
      id: 'grid-container',
      name: 'Grid Container',
      category: 'layout',
      tag: 'div',
      icon: 'view-grid',
      defaultProps: { class: 'grid' },
      editableProps: [
        { name: 'columns', type: 'number', default: 3, label: 'Columns' },
        { name: 'gap', type: 'string', default: '1rem', label: 'Gap' },
      ],
      defaultSize: { w: 6, h: 4 },
    },
  ];

  getAllComponents(): ComponentDefinition[] {
    return this.components;
  }

  getComponentsByCategory(category: string): ComponentDefinition[] {
    return this.components.filter(c => c.category === category);
  }

  getComponentById(id: string): ComponentDefinition | undefined {
    return this.components.find(c => c.id === id);
  }

  getCategories(): string[] {
    return [...new Set(this.components.map(c => c.category))];
  }

  registerComponent(component: ComponentDefinition): void {
    const existing = this.components.findIndex(c => c.id === component.id);
    if (existing >= 0) {
      this.components[existing] = component;
    } else {
      this.components.push(component);
    }
  }

  // NPM Package Management
  getSupportedPackages(): string[] {
    return Object.keys(NPM_PACKAGE_COMPONENTS);
  }

  getInstalledPackages(): NpmPackageInfo[] {
    return Array.from(this.installedPackages).map(name => ({
      name,
      components: NPM_PACKAGE_COMPONENTS[name] || [],
      installed: true,
    }));
  }

  installPackage(packageName: string): NpmPackageInfo | null {
    const normalizedName = packageName.toLowerCase().trim();
    
    // Check if package is supported
    if (!NPM_PACKAGE_COMPONENTS[normalizedName]) {
      return null;
    }

    // Check if already installed
    if (this.installedPackages.has(normalizedName)) {
      return {
        name: normalizedName,
        components: NPM_PACKAGE_COMPONENTS[normalizedName],
        installed: true,
      };
    }

    // Add package components
    const packageComponents = NPM_PACKAGE_COMPONENTS[normalizedName];
    packageComponents.forEach(component => {
      this.registerComponent(component);
    });

    this.installedPackages.add(normalizedName);

    return {
      name: normalizedName,
      components: packageComponents,
      installed: true,
    };
  }

  uninstallPackage(packageName: string): boolean {
    const normalizedName = packageName.toLowerCase().trim();
    
    if (!this.installedPackages.has(normalizedName)) {
      return false;
    }

    // Remove package components
    this.components = this.components.filter(c => c.packageName !== normalizedName);
    this.installedPackages.delete(normalizedName);

    return true;
  }

  getPackageComponents(packageName: string): ComponentDefinition[] {
    const normalizedName = packageName.toLowerCase().trim();
    return NPM_PACKAGE_COMPONENTS[normalizedName] || [];
  }
}
