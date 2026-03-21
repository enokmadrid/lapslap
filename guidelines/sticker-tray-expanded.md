# Sticker Tray -- Expanded Interaction System

This document defines the behavior and structure of the sticker tray,
including the expanded interaction mode.

------------------------------------------------------------------------

## 1. Overview

The sticker tray is a bottom-docked, horizontally scrollable UI that
allows users to browse and select stickers.

It supports two modes:

-   Collapsed (default)
-   Expanded (full browsing experience)

The goal is to balance:

-   Fast access (collapsed)
-   Deep exploration (expanded)

------------------------------------------------------------------------

## 2. Tray Modes

### 2.1 Collapsed Mode

Default state.

#### Behavior

-   Fixed at bottom of screen
-   Horizontal scroll
-   Shows:
    -   Category tabs
    -   Sticker rail
    -   Upload tile
    -   Expand button

#### Purpose

-   Quick sticker access
-   Minimal UI footprint
-   Keep focus on laptop

------------------------------------------------------------------------

### 2.2 Expanded Mode

Activated via expand button.

#### Behavior

-   Expands upward into a large overlay panel
-   Covers \~60--80% of screen height
-   Background slightly dims or blurs

#### Purpose

-   Full sticker browsing
-   Discoverability
-   Collection exploration

------------------------------------------------------------------------

## 3. Expand Trigger

### Trigger

-   Click expand icon (top-right of tray)

### Animation

-   Tray grows vertically
-   Smooth easing
-   Duration: \~250ms

### Easing

``` css
cubic-bezier(0.2, 0.8, 0.2, 1)
```

------------------------------------------------------------------------

## 4. Expanded Layout

``` text
Expanded Tray
├── Header
│   ├── Title (Stickers / Category name)
│   ├── Search input
│   └── Close button
│
├── Category Tabs (horizontal)
│
├── Sticker Grid (main content)
│   └── Multiple rows of stickers
│
└── Footer (optional)
    └── Upload / Actions
```

------------------------------------------------------------------------

## 5. Header

### Contents

-   Title (dynamic based on category)
-   Search input
-   Close (collapse) button

### Behavior

-   Sticky at top
-   Always visible while scrolling

------------------------------------------------------------------------

## 6. Category Tabs

### Behavior

-   Horizontal scroll if overflow
-   Active tab clearly highlighted

### Purpose

-   Switch content within expanded view
-   No layout shift when switching

------------------------------------------------------------------------

## 7. Sticker Grid

### Layout

-   Grid (not horizontal)
-   4--8 columns depending on width
-   Consistent spacing

### Interaction

-   Hover:
    -   scale: 1 → 1.08
    -   slight lift
-   Click:
    -   triggers sticker pickup
-   Drag:
    -   starts drag immediately

------------------------------------------------------------------------

## 8. Background Behavior

When expanded:

-   Background (scene) is dimmed OR blurred
-   Laptop remains visible but de-emphasized

Example:

``` css
background: rgba(0,0,0,0.3);
backdrop-filter: blur(6px);
```

------------------------------------------------------------------------

## 9. Collapse Behavior

### Trigger

-   Close button
-   Click outside tray (optional)
-   Escape key

### Animation

-   Reverse of expand
-   Duration: \~200ms

------------------------------------------------------------------------

## 10. Interaction Rules

-   Expanded tray blocks background interaction
-   No sticker placement while expanded
-   Dragging from expanded grid closes tray automatically (optional)

------------------------------------------------------------------------

## 11. Visual Style

-   Glass UI (blur + transparency)
-   Soft shadows
-   Rounded corners
-   Clean spacing

------------------------------------------------------------------------

## 12. Performance

-   Lazy load sticker assets if needed
-   Virtualize grid if large dataset
-   Avoid heavy animations

------------------------------------------------------------------------

## 13. Summary

Collapsed = speed\
Expanded = exploration

Both modes must feel:

-   Fast
-   Smooth
-   Intentional
