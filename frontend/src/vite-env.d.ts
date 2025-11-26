/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<object, object, unknown>
  export default component
}

declare module 'vue3-grid-layout-next' {
  import { DefineComponent } from 'vue';
  export const GridLayout: DefineComponent<{
    layout: unknown[];
    colNum?: number;
    rowHeight?: number;
    isDraggable?: boolean;
    isResizable?: boolean;
    verticalCompact?: boolean;
    useCssTransforms?: boolean;
  }>;
  export const GridItem: DefineComponent<{
    x: number;
    y: number;
    w: number;
    h: number;
    i: string;
  }>;
}

declare module 'vuedraggable' {
  import { DefineComponent } from 'vue';
  const Draggable: DefineComponent;
  export default Draggable;
}
