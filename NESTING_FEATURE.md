# Component Nesting Feature Documentation

## Overview

The component nesting/composition feature allows users to create hierarchical component structures by adding child components to container elements. This enables building more complex UI layouts with proper parent-child relationships.

---

## Features

### 1. Container Components

The following components support nesting:
- `div` - Generic container
- `section` - Section container
- `article` - Article container
- `main` - Main content area
- `aside` - Sidebar content
- `nav` - Navigation container
- `header` - Header section
- `footer` - Footer section
- `form` - Form container

**Visual Indicators:**
- Container components have **dashed borders**
- Hover effect shows light green background
- **+ button** appears in the header for adding children

---

## How to Use

### Adding Nested Components

**Method 1: Drag and Drop**
1. Drag a container component (e.g., `div`) onto the canvas
2. Drag another component from the palette
3. Drop it **onto the container** (not on empty canvas)
4. The component becomes a child of the container

**Method 2: Add Child Button**
1. Select a container component on the canvas
2. Click the **+ button** in the top-right of the container
3. A default `div` child is added automatically
4. Edit the child's properties in the Properties Panel

### Viewing Nested Children

**In Canvas:**
- Nested children appear inside the parent container
- Each child has its own header with component type
- Children are displayed in a light gray bordered area
- Selected child has a green border

**In Properties Panel:**
- Select a container component
- Scroll down to see "Nested Children" section
- Shows count and list of all children
- Each child displays its type and ID

### Managing Nested Components

**Selecting:**
- Click on a child component to select it
- Selected child shows green border
- Properties Panel displays child's properties

**Deleting:**
- Hover over a child component
- Click the **× button** that appears
- Child is removed from parent

**Editing:**
- Select the child component
- Use Properties Panel to edit its properties
- Changes are saved automatically

---

## Technical Details

### Data Structure

```typescript
interface LayoutItem {
  id: string;
  componentType: string;
  x: number;
  y: number;
  w: number;
  h: number;
  i: string;
  props?: Record<string, unknown>;
  children?: LayoutItem[];  // Nested children array
}
```

### Store Actions

**addChildComponent(parentId, component)**
- Adds a child component to a parent container
- Creates new LayoutItem with unique ID
- Pushes to parent's `children` array
- Saves to history for undo/redo
- Auto-saves to database

**removeChildComponent(parentId, childId)**
- Removes a specific child from parent
- Filters out the child from `children` array
- Updates selection if child was selected
- Saves to history
- Auto-saves to database

**updateChildComponent(parentId, childId, updates)**
- Updates properties of a nested child
- Merges updates with existing child data
- Saves to history
- Auto-saves to database

---

## UI Components

### DesignCanvas.vue Changes

**Template:**
- Added recursive rendering for children
- Drag-over detection for containers
- Drop handler for adding children
- Visual indicators (dashed borders, + button)
- Nested item display with mini headers

**Functions:**
- `isContainerType(type)` - Checks if component can have children
- `onDragOverItem(event, item)` - Highlights drop target
- `onDropIntoItem(event, parent)` - Handles drop into container
- `showAddChildMenu(item)` - Quick-add child component
- `removeChildItem(parentId, childId)` - Delete child handler

**CSS:**
- `.is-container` - Dashed border for containers
- `.drop-target:hover` - Green highlight on drag-over
- `.nested-children` - Gray bordered area for children
- `.nested-item` - Individual child styling
- `.add-child-btn` - Green + button
- `.nested-delete-btn` - Red × button for children

### PropertiesPanel.vue Changes

**Template:**
- Added "Nested Children" section
- Lists all children with type and ID
- Shows child count in section header

**CSS:**
- `.children-section` - Section styling
- `.child-item` - Individual child display
- `.child-info` - Type and ID layout

---

## Usage Examples

### Example 1: Form with Inputs

```
┌─ Form (container) ────────────────┐
│  + Add Child                    × │
│                                   │
│  ┌─ div ─────────────────────┐   │
│  │ Label: Name              × │   │
│  │ [Text Input]               │   │
│  └────────────────────────────┘   │
│                                   │
│  ┌─ div ─────────────────────┐   │
│  │ Label: Email             × │   │
│  │ [Email Input]              │   │
│  └────────────────────────────┘   │
│                                   │
│  ┌─ button ───────────────────┐  │
│  │ Submit                     × │  │
│  └────────────────────────────┘   │
└───────────────────────────────────┘
```

### Example 2: Navigation Menu

```
┌─ nav (container) ─────────────────┐
│  + Add Child                    × │
│                                   │
│  ┌─ a ───────┐ ┌─ a ───────┐    │
│  │ Home    × │ │ About   × │    │
│  └───────────┘ └───────────┘    │
│                                   │
│  ┌─ a ───────┐ ┌─ a ───────┐    │
│  │ Contact × │ │ Blog    × │    │
│  └───────────┘ └───────────┘    │
└───────────────────────────────────┘
```

---

## Keyboard Shortcuts

- **Ctrl+Z** - Undo (including child additions/removals)
- **Ctrl+Y** - Redo (restores nested structure)
- **Delete** - Remove selected component (parent or child)

---

## History & Undo/Redo

✅ **Fully Supported**
- Adding children saves to history
- Removing children saves to history
- Undo/Redo preserves nested structure
- 50-step history buffer

---

## Database Persistence

✅ **Fully Supported**
- Children stored in JSONB layout column
- Nested structure preserved in database
- Export includes full nested hierarchy
- Import recreates nested structure

**Database Schema:**
```sql
projects.layout (JSONB):
[
  {
    "id": "parent-1",
    "componentType": "div",
    "children": [
      {
        "id": "child-1",
        "componentType": "button",
        ...
      }
    ]
  }
]
```

---

## Real-time Collaboration

✅ **Fully Supported**
- Child additions/removals broadcast via WebSocket
- All users see nested structure updates
- Nested changes debounced (300ms)

---

## Limitations

### Current Version

1. **Single-level nesting only**
   - Children cannot have their own children (yet)
   - Prevents deeply nested structures
   - Simplifies UI and state management

2. **Grid layout positioning**
   - Children don't use grid layout (yet)
   - Children stack vertically in parent
   - Fixed ordering (no drag-to-reorder)

3. **Visual editing**
   - Children edited via Properties Panel only
   - No inline property editing for children
   - No visual drag-to-resize for children

### Future Enhancements

- [ ] Multi-level nesting (children of children)
- [ ] Drag-to-reorder children
- [ ] Inline child property editing
- [ ] Visual resize handles for children
- [ ] Collapse/expand nested sections
- [ ] Copy/paste nested structures
- [ ] Templates for common nested patterns

---

## Code Generation

The nesting feature integrates with code generation:

**Vue Template:**
```vue
<div>
  <button>Submit</button>
  <input type="text" />
</div>
```

**HTML:**
```html
<div>
  <button>Submit</button>
  <input type="text" />
</div>
```

✅ Nested structure preserved in generated code
✅ Proper indentation and formatting
✅ Children rendered inside parent tags

---

## Testing

### Manual Testing Checklist

- [x] Drag component onto container → child added
- [x] Click + button → child added
- [x] Click × on child → child removed
- [x] Select child → properties shown
- [x] Edit child properties → changes saved
- [x] Undo child addition → child removed
- [x] Redo → child restored
- [x] Export project → children included
- [x] Import project → children recreated
- [x] Real-time sync → children synced

### Unit Tests

Location: `backend/src/__tests__/designer.service.spec.ts`

Tests include:
- Creating projects with nested components
- Saving layouts with children
- Retrieving nested structures
- Code generation with children

---

## Performance Considerations

### Optimizations
- ✅ Debounced auto-save (300ms)
- ✅ JSON.parse/stringify for deep cloning
- ✅ Virtual scrolling for large child lists (future)

### Known Issues
- ⚠️ Large numbers of children (100+) may slow rendering
- ⚠️ Deep nesting (3+ levels) not tested

---

## Troubleshooting

### Children not appearing?
- Check component type is a container (`div`, `section`, etc.)
- Verify `children` array exists in data
- Check browser console for errors

### Can't select child?
- Make sure you're clicking directly on the child
- Use `.stop` modifier on child click events
- Check z-index of nested elements

### Changes not saving?
- Wait for 300ms debounce to trigger
- Check network tab for PUT request
- Verify database connection

---

## API Changes

### New Endpoints (None)
The feature uses existing endpoints:
- `PUT /designer/projects/:id/layout` - Saves nested structure

### Updated Responses
Layout items now include optional `children` array:
```json
{
  "id": "parent-1",
  "componentType": "div",
  "x": 0,
  "y": 0,
  "w": 4,
  "h": 4,
  "i": "parent-1",
  "props": {},
  "children": [
    {
      "id": "child-1",
      "componentType": "button",
      "x": 0,
      "y": 0,
      "w": 2,
      "h": 1,
      "i": "child-1",
      "props": {
        "label": "Submit"
      }
    }
  ]
}
```

---

## Summary

✅ **Status**: Fully Implemented
✅ **Testing**: Manual testing complete
✅ **Documentation**: Complete
✅ **Integration**: Seamless with existing features

**Version**: 1.1.0
**Feature Complete**: December 3, 2025
