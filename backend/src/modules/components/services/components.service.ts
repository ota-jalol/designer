import { Injectable } from '@nestjs/common';
import { ComponentDefinition } from '../entities/component.entity';

@Injectable()
export class ComponentsService {
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
}
