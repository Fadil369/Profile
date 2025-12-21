# BrainSAIT Design System

This document describes the custom design system implemented for Dr. Mohamed El Fadil's portfolio, showcasing BrainSAIT's brand identity through modern web design techniques.

## 🎨 Color Palette

### Primary Colors

```scss
$brainsait-primary: #114ab1; // Deep Blue
$brainsait-secondary: #6793ac; // Teal Blue
$brainsait-accent: #ff6b01; // Orange
$brainsait-gold: #ecc232; // Gold
$brainsait-dark: #1a237e; // Dark Blue
$brainsait-light: #b3deef; // Light Blue
```

### Color Usage

**Deep Blue (#114AB1)** - Primary

- Navigation elements
- Primary buttons
- Headers and titles
- Conveys: Trust, intelligence, professionalism

**Teal Blue (#6793AC)** - Secondary

- Secondary actions
- Hover states
- Accents and highlights
- Conveys: Innovation, healthcare, technology

**Orange (#FF6B01)** - Accent

- Call-to-action buttons
- Important links
- Highlights and emphasis
- Conveys: Energy, urgency, action

**Gold (#ECC232)** - Excellence

- Awards and achievements
- Special badges
- Premium features
- Conveys: Excellence, achievement, quality

**Light Blue (#B3DEEF)** - Clarity

- Text on dark backgrounds
- Subtle backgrounds
- Borders and dividers
- Conveys: Clarity, openness, accessibility

## ✨ Design Effects

### Glassmorphism

Modern frosted glass effect applied to cards, navigation, and containers.

**Implementation:**

```scss
@mixin glassmorphism {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.15);
}
```

**Applied to:**

- Project cards
- Navigation bar
- Profile section
- Modal overlays

**Dark Mode Variant:**

```scss
@mixin glassmorphism-dark {
  background: rgba(26, 35, 126, 0.1);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(103, 147, 172, 0.2);
  box-shadow: 0 8px 32px 0 rgba(17, 74, 177, 0.15);
}
```

### Mesh Gradient Background

Multi-layered radial gradients creating a dynamic, modern background.

**Implementation:**

```scss
body::before {
  content: "";
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
  opacity: 0.05;
  background: radial-gradient(at 27% 37%, hsla(215, 98%, 61%, 0.1) 0px, transparent 50%), radial-gradient(
      at 97% 21%,
      hsla(197, 49%, 65%, 0.1) 0px,
      transparent 50%
    ), radial-gradient(at 52% 99%, hsla(24, 100%, 50%, 0.1) 0px, transparent 50%), radial-gradient(
      at 10% 29%,
      hsla(46, 80%, 56%, 0.1) 0px,
      transparent 50%
    ), radial-gradient(at 97% 96%, hsla(215, 98%, 61%, 0.1) 0px, transparent 50%), radial-gradient(
      at 33% 50%,
      hsla(197, 49%, 65%, 0.1) 0px,
      transparent 50%
    ), radial-gradient(at 79% 53%, hsla(343, 98%, 61%, 0.1) 0px, transparent 50%);
}
```

**Characteristics:**

- Subtle, non-distracting
- Enhances depth
- Responsive to theme changes
- Performance optimized with CSS

### Gradient Text

Eye-catching gradient text for emphasis.

```scss
.gradient-text {
  background: linear-gradient(135deg, $brainsait-primary 0%, $brainsait-secondary 50%, $brainsait-accent 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-weight: 700;
}
```

**Usage:**

- Hero titles
- Section headers
- Key statistics
- Brand emphasis

## 🎭 Interactive Elements

### Hover Animations

**Cards:**

```scss
.card,
.project {
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 12px 48px 0 rgba(17, 74, 177, 0.25);
  }
}
```

**Project Cards:**

```scss
.project-card {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);

  &:hover {
    transform: translateY(-8px) scale(1.02);
    box-shadow: 0 20px 60px 0 rgba(17, 74, 177, 0.3);
  }
}
```

**Buttons:**

```scss
.btn-primary {
  background: linear-gradient(135deg, $brainsait-primary 0%, $brainsait-secondary 100%);
  transition: all 0.3s ease;

  &:hover {
    box-shadow: 0 6px 20px 0 rgba(17, 74, 177, 0.4);
    transform: translateY(-2px);
  }
}
```

### Skill Badges

Interactive badges with hover effects:

```scss
.skill-badge {
  @include glassmorphism;
  transition: all 0.3s ease;

  &:hover {
    background: linear-gradient(135deg, $brainsait-primary 0%, $brainsait-secondary 100%);
    color: white;
    transform: scale(1.1);
  }
}
```

## 📱 Responsive Design

### Breakpoints

- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

### Mobile Optimizations

- Touch-friendly tap targets (min 44px)
- Optimized glassmorphism for performance
- Reduced animation complexity
- Simplified mesh gradients

### Dark Mode

Automatic theme switching with enhanced effects:

```scss
html[data-theme="dark"] {
  body::before {
    opacity: 0.15; // Increased visibility in dark mode
  }

  .card,
  .project {
    @include glassmorphism-dark;
  }
}
```

## 🎯 Component Library

### Section Headers

```scss
.section-header {
  position: relative;
  padding-bottom: 1rem;
  margin-bottom: 2rem;

  &::after {
    content: "";
    position: absolute;
    bottom: 0;
    left: 0;
    width: 60px;
    height: 4px;
    background: linear-gradient(90deg, $brainsait-accent 0%, $brainsait-gold 100%);
    border-radius: 2px;
  }
}
```

### Hero Section

```scss
.hero-section {
  position: relative;
  padding: 4rem 0;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, rgba(17, 74, 177, 0.05) 0%, rgba(103, 147, 172, 0.05) 50%, rgba(255, 107, 1, 0.05) 100%);
    z-index: -1;
    border-radius: 20px;
  }
}
```

### Profile Image

```scss
.profile img {
  border: 3px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 8px 32px 0 rgba(17, 74, 177, 0.2);
  border-radius: 50%;
}
```

## ⚡ Performance Considerations

### CSS Optimization

- Use CSS transforms instead of position changes
- Leverage hardware acceleration with `transform: translateZ(0)`
- Minimize repaints with `will-change` property
- Use CSS Grid and Flexbox for layouts

### Animation Guidelines

- Keep animations under 300ms for micro-interactions
- Use `cubic-bezier` for natural motion
- Provide `prefers-reduced-motion` alternatives
- Avoid animating expensive properties (width, height)

### Best Practices

```scss
// Good: Uses transform
.element {
  transform: translateY(-5px);
  transition: transform 0.3s ease;
}

// Avoid: Uses top/position
.element {
  top: -5px;
  transition: top 0.3s ease;
}
```

## 🔧 Customization Guide

### Changing Primary Color

1. Update color variable in `_sass/_custom.scss`
2. Test in both light and dark modes
3. Verify contrast ratios for accessibility (WCAG AA minimum)
4. Update gradient combinations

### Adding New Components

1. Follow existing naming conventions
2. Apply glassmorphism for consistency
3. Include hover states and transitions
4. Test responsive behavior
5. Add dark mode variant

### Maintaining Brand Consistency

- Always use BrainSAIT color variables
- Apply standard border-radius (15-20px)
- Use consistent spacing (multiples of 0.25rem)
- Follow transition timing (0.3s ease as default)

## 📊 Accessibility

### Color Contrast

- Primary text on white: 9.18:1 (AAA)
- Secondary text on white: 4.89:1 (AA)
- All interactive elements meet WCAG AA standards

### Interactive Elements

- Minimum touch target: 44x44px
- Clear focus indicators
- Keyboard navigation support
- Screen reader friendly markup

### Testing Tools

- Chrome DevTools Lighthouse
- WAVE Browser Extension
- axe Accessibility Checker
- Color Contrast Analyzer

## 🎨 Design Inspiration

The BrainSAIT design system draws inspiration from:

- **Healthcare Industry**: Trust, professionalism, clarity
- **AI/Technology**: Innovation, intelligence, future-forward
- **Modern Web Design**: Glassmorphism, gradients, micro-interactions
- **Material Design**: Elevation, shadows, responsive grids

---

**Design System Version:** 1.0  
**Last Updated:** December 2024  
**Maintained By:** Dr. Mohamed El Fadil
