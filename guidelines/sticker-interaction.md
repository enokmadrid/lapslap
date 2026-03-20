# Sticker Interaction -- Drag + Elevation Motion

This document defines how stickers behave when users interact with them on the canvas.

Focus: - Drag behavior\
- Selection behavior\
- Realistic "peel / lift" animation\
- Wave transition effect

------------------------------------------------------------------------

## 1. Interaction Overview

Stickers should feel physical.

When a user interacts with a sticker, it should behave like a real
object placed on a surface.

Key ideas: - Stickers sit on the laptop surface\
- Clicking lifts the sticker\
- Dragging feels attached to the cursor\
- Motion communicates depth

------------------------------------------------------------------------

## 2. Interaction States

Each sticker must support these states:

-   Idle\
-   Hover\
-   Selected\
-   Dragging

------------------------------------------------------------------------

## 3. Drag Behavior

### Start Drag

Trigger: - Mouse down or pointer down on sticker

Behavior: - Sticker becomes selected\
- Elevation animation begins\
- Cursor changes to grabbing

------------------------------------------------------------------------

### While Dragging

-   Sticker follows pointer position\
-   Movement uses `transform: translate()`\
-   Must remain constrained within screen bounds

Constraints: - Cannot exit canvas\
- Position must clamp at edges

------------------------------------------------------------------------

### Drop

Trigger: - Pointer release

Behavior: - Sticker settles into position\
- Slight easing animation\
- Shadow reduces slightly

------------------------------------------------------------------------

## 4. Elevation Animation (Peel Effect)

This is the core visual interaction.

### Trigger

-   On click (selection)\
-   On drag start

------------------------------------------------------------------------

### Phase 1: Lift (0--150ms)

-   translateY: `0 → -6px`\
-   scale: `1 → 1.08`\
-   rotate: `0 → -2deg` (optional)

Shadow: - Increase depth\
- Example: - from: `0 2px 6px rgba(0,0,0,0.1)`\
- to: `0 12px 30px rgba(0,0,0,0.25)`

------------------------------------------------------------------------

### Phase 2: Wave Transition (150--300ms)

Simulates sticker peeling from surface.

#### Effect

-   Radial distortion originating from click point\
-   Expands outward like a ripple

#### Visual Behavior

-   Distortion expands then fades\
-   Sticker appears to detach from surface

------------------------------------------------------------------------

### Implementation Options

#### Preferred: SVG Displacement Filter

-   Use `feTurbulence` + `feDisplacementMap`\
-   Animate displacement scale

Behavior: - scale: `0 → 20 → 0`\
- duration: \~300ms

------------------------------------------------------------------------

#### Fallback: CSS Ripple

-   Expanding circle\
-   Blur + opacity fade

Properties: - scale: `0 → 4`\
- opacity: `0.4 → 0`

------------------------------------------------------------------------

### Phase 3: Settle (after 300ms)

-   scale: `1.08 → 1.05`\
-   translateY: stays elevated\
-   rotation: optional slight tilt

Result: - Sticker remains lifted (selected state)

------------------------------------------------------------------------

## 5. Selected State

A selected sticker should:

-   Appear slightly elevated\
-   Maintain soft shadow\
-   Show selection UI

Visual: - scale: \~1.05\
- translateY: \~-4px

------------------------------------------------------------------------

## 6. Deselect Behavior

Trigger: - Click outside sticker

Animation: - scale: `1.05 → 1`\
- translateY: `-4px → 0`\
- shadow reduces

Duration: - \~150ms

------------------------------------------------------------------------

## 7. Motion Rules

### Timing

-   Total animation: under 400ms\
-   Lift: fast\
-   Ripple: medium\
-   Settle: smooth

------------------------------------------------------------------------

### Easing

Use:

``` css
cubic-bezier(0.2, 0.8, 0.2, 1)
```

------------------------------------------------------------------------

### Performance

-   Use `transform` only (no layout shifts)\
-   Avoid triggering reflow\
-   Keep animations GPU-accelerated

------------------------------------------------------------------------

## 8. Visual Feedback

### Cursor States

-   Default → pointer\
-   Hover → pointer\
-   Dragging → grabbing

------------------------------------------------------------------------

### Drag Feedback

-   Screen highlights when dragging over valid area\
-   Invalid drop cancels movement

------------------------------------------------------------------------

## 9. Constraints

-   Sticker must always stay within canvas\
-   Transform must clamp position\
-   Rotation must not push sticker outside bounds

------------------------------------------------------------------------

## 10. Optional Enhancements

-   Small bounce when dropping sticker\
-   Subtle hover lift (scale 1.02)\
-   Micro parallax when moving

------------------------------------------------------------------------

## 11. Engineering Notes

-   Use pointer events (not mouse events)\
-   Keep animation logic separate from state logic\
-   Avoid mixing animation code inside store

------------------------------------------------------------------------

## 12. Summary

This interaction should feel:

-   Responsive\
-   Physical\
-   Polished

The user should feel like they are lifting and placing real stickers,
not moving flat UI elements.
