# Stickerbook -- Product Requirements Document

## 1. Overview

Stickerbook is a lightweight interactive web app for designing a custom
laptop cover using digital stickers.

Users drag stickers onto a MacBook screen, arrange them, and export the
final result as a high-quality PNG.

### Goals

-   Fast interaction with zero learning curve\
-   Visually clean and satisfying UI\
-   Reliable save and export flow\
-   Shareable output

------------------------------------------------------------------------

## 2. Core Features

### 2.1 Canvas Experience

-   Centered MacBook Pro mockup\
-   Screen area is the only valid drop zone\
-   Subtle grid background inside screen\
-   Label: "Drop stickers here" (hidden after first sticker)

#### Constraints

-   Stickers cannot leave screen bounds\
-   Drop outside screen cancels action\
-   All transforms must clamp within screen

------------------------------------------------------------------------

### 2.2 Sticker Library

Left sidebar (\~320px)

#### Contents

-   Title: "Stickers"\
-   Search input: "Search stickers..."\
-   Category chips:
    -   All\
    -   Emoji\
    -   Travel\
    -   Food\
    -   Icons\
    -   Shapes\
-   Grid of 24 sticker thumbnails

#### Sticker Format

-   Inline SVG only\
-   No remote images (prevents canvas tainting)

#### Data Model

``` ts
export type StickerCategory =
  | "Emoji"
  | "Travel"
  | "Food"
  | "Icons"
  | "Shapes"

export type StickerLibraryItem = {
  id: string
  name: string
  category: StickerCategory
  svg: string
}
```

------------------------------------------------------------------------

### 2.3 Sticker Interactions

Users can:

-   Drag from library → drop on canvas\
-   Select sticker (click)\
-   Move (drag)\
-   Resize (corner handles)\
-   Rotate (rotation handle)\
-   Duplicate\
-   Delete\
-   Change layer order

#### Constraints

-   Min size: 24px\
-   Max size: 240px\
-   Movement constrained to screen bounds\
-   Rotation snaps every 15° when Shift is held

#### Duplicate Behavior

-   Offset by (12px, 12px)\
-   New sticker gets highest zIndex

------------------------------------------------------------------------

### 2.4 Selection UI

When a sticker is selected:

-   Show bounding box\
-   Show resize handles\
-   Show rotate handle

#### Floating Toolbar

-   Bring forward\
-   Send backward\
-   Duplicate\
-   Delete

Toolbar follows selected sticker position.

------------------------------------------------------------------------

### 2.5 Clear Canvas

-   Bottom-right button\
-   Opens confirmation dialog

#### Behavior

-   Confirm → removes all stickers\
-   Reset internal state\
-   Clear saved state (optional toggle)

------------------------------------------------------------------------

## 3. State Management

### 3.1 Canvas State Model

``` ts
export type PlacedSticker = {
  id: string
  name: string
  category: string
  x: number
  y: number
  width: number
  height: number
  rotation: number
  zIndex: number
}
```

------------------------------------------------------------------------

### 3.2 Global Store (Zustand)

State domains:

-   placedStickers: PlacedSticker\[\]\
-   selectedStickerId: string \| null\
-   activeCategory: string\
-   searchQuery: string\
-   isDragging: boolean\
-   toastMessage: string \| null

------------------------------------------------------------------------

### 3.3 Derived State

-   sortedStickers (by zIndex)\
-   filteredLibraryItems (search + category)\
-   hasSavedState

------------------------------------------------------------------------

## 4. Save System

### 4.1 Save Action

Top bar button: "Save"

#### Behavior

-   Serialize placedStickers\
-   Store in localStorage

Key: stickerbook:canvas:v1

-   Show toast: "Saved"

------------------------------------------------------------------------

### 4.2 Restore State

On app load:

If saved state exists:

-   Show prompt: "Restore last design?"

Actions: - Restore → hydrate state\
- Dismiss → ignore

------------------------------------------------------------------------

### 4.3 Storage Format

``` json
{
  "version": 1,
  "stickers": []
}
```

------------------------------------------------------------------------

## 5. Export System

### 5.1 Export PNG

Top bar button: "Export PNG"

#### Output

-   File: `my-ideal-laptop-cover.png`

Includes: - Background (#F6F7F9)\
- Laptop body\
- Screen content (stickers)

------------------------------------------------------------------------

### 5.2 Rendering Pipeline

Use offscreen canvas.

#### Steps

1.  Create canvas at 2x resolution\
2.  Scale context\
3.  Draw background\
4.  Draw laptop mock\
5.  Draw each sticker:
    -   Apply translation\
    -   Apply rotation\
    -   Draw SVG\
6.  Export

------------------------------------------------------------------------

### 5.3 Export Implementation

Preferred:

``` ts
canvas.toBlob()
```

Fallback:

``` ts
canvas.toDataURL("image/png")
```

------------------------------------------------------------------------

### 5.4 Download Flow

-   Create temporary `<a>`\
-   Assign object URL\
-   Set `download` attribute\
-   Trigger click\
-   Revoke object URL

------------------------------------------------------------------------

### 5.5 Clipboard (Optional)

Feature: "Copy PNG to clipboard"

-   Use Clipboard API\
-   Hide if unsupported

------------------------------------------------------------------------

## 6. Layout

### 6.1 Global

-   Background: #F6F7F9\
-   Soft shadows\
-   Rounded corners\
-   Consistent spacing

------------------------------------------------------------------------

### 6.2 Sidebar

Width: \~320px

Sections: - Title\
- Search\
- Categories\
- Sticker grid

------------------------------------------------------------------------

### 6.3 Main Stage

-   Centered MacBook mock\
-   Screen clearly defined\
-   Highlight on drag-over

------------------------------------------------------------------------

### 6.4 Top Bar

Actions:

-   Save\
-   Export PNG\
-   Copy PNG (optional)

------------------------------------------------------------------------

## 7. Interaction Rules

### Drag & Drop

-   Only valid inside screen\
-   Highlight screen on drag-over\
-   Cancel on invalid drop

------------------------------------------------------------------------

### Movement

-   Clamp position inside bounds\
-   Prevent overflow

------------------------------------------------------------------------

### Resize

-   Maintain aspect ratio\
-   Clamp min/max size\
-   Adjust position if near edge

------------------------------------------------------------------------

### Rotation

-   Free rotation\
-   Snap to 15° when Shift held

------------------------------------------------------------------------

### Selection

-   Click selects\
-   Click outside deselects

------------------------------------------------------------------------

## 8. Technical Considerations

### Rendering Strategy

-   DOM elements for interaction\
-   Canvas only for export

------------------------------------------------------------------------

### Performance

-   Max \~50 stickers\
-   Use transform instead of layout\
-   Avoid re-renders

------------------------------------------------------------------------

### Asset Safety

-   Inline SVG only\
-   Avoid cross-origin images

------------------------------------------------------------------------

### Event System

-   Pointer events (not mouse events)\
-   Support future touch gestures

------------------------------------------------------------------------

## 9. Edge Cases

-   Empty canvas export still works\
-   Resize near edges clamps properly\
-   Rotation does not break bounds\
-   Large sticker count remains stable

------------------------------------------------------------------------

## 10. Future Enhancements

-   Upload custom stickers\
-   Sticker packs marketplace\
-   Shareable URL state\
-   Mobile touch gestures\
-   Snap-to-grid toggle\
-   Undo / redo system

------------------------------------------------------------------------

## 11. Success Criteria

-   User places stickers within 10 seconds\
-   Export is sharp and accurate\
-   Save and restore works reliably\
-   No UI breaking across common screen sizes

------------------------------------------------------------------------

## 12. Non-Goals (For Now)

-   No backend storage\
-   No authentication\
-   No real-time collaboration\
-   No mobile-first optimization (desktop priority first)
