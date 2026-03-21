# Lap Slaps -- Product Requirements Document

## 1. Overview

Lap Slaps is an immersive, scene-based web app where users design a
custom laptop cover using digital stickers.

Users interact with a central MacBook object placed in a full-screen
environment. UI elements float above the scene, while stickers behave
like physical objects placed on the laptop surface.

### Goals

-   Fast, intuitive interaction\
-   Strong sense of depth and physicality\
-   Playful but polished experience\
-   High-quality export output

------------------------------------------------------------------------

## 2. Core Experience Model

The app is not a traditional layout. It is a layered interaction space.

### Layer System

1.  Background (immersive environment)\
2.  Laptop (primary interaction surface)\
3.  Stickers (interactive objects above laptop)\
4.  UI (floating controls above everything)

------------------------------------------------------------------------

## 3. Core Features

### 3.1 Laptop Surface (Primary Canvas)

-   Centered MacBook Pro mockup\
-   This is the ONLY valid interaction surface\
-   Stickers can only exist within laptop bounds

#### Visual Requirements

-   Strong outer shadow (depth)\
-   Subtle surface gradient (top lighter, bottom darker)\
-   Slight edge highlight

#### Constraints

-   Stickers cannot leave laptop bounds\
-   All transforms must clamp within surface

------------------------------------------------------------------------

### 3.2 Sticker Tray (Bottom Dock)

#### Structure

-   Floating glass-style container\
-   Positioned at bottom of screen

#### Contents

-   Category row (horizontal)
    -   All\
    -   Uploads\
    -   Trending\
    -   Design\
    -   Code\
    -   Products\
    -   AI\
    -   Emoji\
    -   Quotes
-   Sticker rail (horizontal scroll)\
-   Upload tile (far right, secondary emphasis)

#### Behavior

-   Horizontal scroll (trackpad + drag)\
-   Hover → slight scale + lift\
-   Drag → immediate pickup

#### Visual Style

-   Glass effect (blur + transparency)\
-   Subtle top edge highlight\
-   Low visual weight (must not compete with canvas)

------------------------------------------------------------------------

### 3.3 Sticker Interactions

Users can:

-   Drag from tray → drop on laptop\
-   Select (click)\
-   Move\
-   Resize\
-   Rotate\
-   Duplicate\
-   Delete\
-   Change layer order

------------------------------------------------------------------------

### 3.4 Sticker Physics & Motion

Stickers must feel physical.

#### On Select (Peel Effect)

-   Scale: `1 → 1.06`\
-   TranslateY: `0 → -4px`\
-   Slight rotation (±2deg optional)\
-   Shadow increases

#### Wave Transition

-   Radial ripple distortion from click point\
-   Expands and fades (\~300ms)

#### Selected State

-   Slight elevation maintained\
-   Soft shadow\
-   Clear visual priority

------------------------------------------------------------------------

### 3.5 Drag Behavior

#### Start

-   Sticker lifts immediately\
-   Cursor becomes grabbing

#### While Dragging

-   Sticker follows pointer\
-   Slight tilt or smoothing allowed\
-   Must remain inside bounds

#### Drop

-   Bounce animation:
    -   scale: `1.06 → 0.98 → 1`\
    -   shadow compress → expand\
-   Duration: \~150ms

------------------------------------------------------------------------

### 3.6 Selection UI

When selected:

-   Bounding box\
-   Resize handles\
-   Rotate handle

#### Selection Ring

-   Subtle dashed or glow ring\
-   Slight blur\
-   Animated on entry (fade + scale)

------------------------------------------------------------------------

### 3.7 Floating Toolbar

-   Appears near selected sticker\
-   Must feel attached, not detached

#### Actions

-   Bring forward\
-   Send backward\
-   Duplicate\
-   Delete

#### Behavior

-   Small entrance animation (scale + fade)\
-   Positioned close to sticker

------------------------------------------------------------------------

### 3.8 Top Bar (Floating UI)

#### Contents

-   Logo\
-   My Slaps\
-   Trending\
-   Export button

#### Behavior

-   Floating glass style\
-   Low visual weight\
-   Must not compete with canvas

------------------------------------------------------------------------

### 3.9 Clear / Shuffle

-   Floating control near top\
-   Secondary importance

------------------------------------------------------------------------

## 4. State Management

### 4.1 Canvas State Model

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

### 4.2 Global Store

-   placedStickers\
-   selectedStickerId\
-   activeCategory\
-   isDragging\
-   UI states

------------------------------------------------------------------------

## 5. Save System

### Save

-   Stores state in localStorage\
-   Toast feedback

Key: stickerbook:canvas:v1

------------------------------------------------------------------------

### Restore

-   Prompt on load\
-   Restore or dismiss

------------------------------------------------------------------------

## 6. Export System

### Export PNG

-   Includes:
    -   Background\
    -   Laptop\
    -   Stickers

### Rendering

-   Offscreen canvas\
-   2x resolution\
-   Draw order:
    1.  Background\
    2.  Laptop\
    3.  Stickers

------------------------------------------------------------------------

## 7. Motion System

### Principles

-   Fast\
-   Responsive\
-   Slightly expressive\
-   Never slow

------------------------------------------------------------------------

### Timing

-   Lift: \~120ms\
-   Ripple: \~300ms\
-   Drop: \~150ms

------------------------------------------------------------------------

### Easing

``` css
cubic-bezier(0.2, 0.8, 0.2, 1)
```

------------------------------------------------------------------------

## 8. Depth System

### Layers

-   Background → flat\
-   Laptop → medium elevation\
-   Stickers → high elevation when active\
-   UI → floating glass layer

------------------------------------------------------------------------

### Shadows

-   Laptop: strong base shadow\
-   Stickers: dynamic shadow based on state\
-   UI: soft ambient shadow

------------------------------------------------------------------------

## 9. Interaction Rules

-   Drag only valid on laptop\
-   Drop outside cancels\
-   Movement clamps to bounds\
-   Rotation cannot push outside

------------------------------------------------------------------------

## 10. Edge Cases

-   Empty canvas export works\
-   Many stickers remain performant\
-   Resize clamps correctly

------------------------------------------------------------------------

## 11. Future Enhancements

-   Custom uploads\
-   Sticker marketplace\
-   Collections system\
-   Shareable layouts\
-   Mobile gestures

------------------------------------------------------------------------

## 12. Success Criteria

-   User can drag sticker within 3 seconds\
-   Interaction feels physical\
-   Export is high quality\
-   UI never competes with canvas
