<template>
  <div
    class="enhanced-card animate-fade-in"
    :class="[
      `enhanced-card--${variant}`,
      `enhanced-card--size-${size}`,
      {
        'enhanced-card--hoverable': hoverable,
        'enhanced-card--bordered': bordered,
        'enhanced-card--loading': loading,
        'enhanced-card--selected': selected
      }
    ]"
    :style="customStyle"
  >
    <!-- Loading Overlay -->
    <div v-if="loading" class="enhanced-card__loading-overlay">
      <div class="enhanced-card__loading-spinner"></div>
      <p class="enhanced-card__loading-text">{{ loadingText }}</p>
    </div>

    <!-- Card Header -->
    <div v-if="$slots.header || title || description" class="enhanced-card__header">
      <div class="enhanced-card__header-content">
        <!-- Title -->
        <h3 v-if="title" class="enhanced-card__title">
          {{ title }}
        </h3>

        <!-- Description -->
        <p v-if="description" class="enhanced-card__description">
          {{ description }}
        </p>

        <!-- Custom Header Content -->
        <slot name="header"></slot>
      </div>

      <!-- Header Actions -->
      <div v-if="$slots.headerActions" class="enhanced-card__header-actions">
        <slot name="headerActions"></slot>
      </div>
    </div>

    <!-- Card Content -->
    <div class="enhanced-card__content">
      <slot></slot>
    </div>

    <!-- Card Footer -->
    <div v-if="$slots.footer" class="enhanced-card__footer">
      <slot name="footer"></slot>
    </div>

    <!-- Selection indicator -->
    <div v-if="selected" class="enhanced-card__selection-indicator">
      <span class="enhanced-card__selection-check">✓</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

export interface EnhancedCardProps {
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info'
  size?: 'sm' | 'md' | 'lg'
  hoverable?: boolean
  bordered?: boolean
  loading?: boolean
  selected?: boolean
  title?: string
  description?: string
  loadingText?: string
  customStyle?: Record<string, string>
}

const props = withDefaults(defineProps<EnhancedCardProps>(), {
  variant: 'default',
  size: 'md',
  hoverable: false,
  bordered: true,
  loading: false,
  selected: false,
  loadingText: 'Loading...'
})

// Computed classes for styling
const cardClasses = computed(() => [
  `enhanced-card--${props.variant}`,
  `enhanced-card--size-${props.size}`,
  {
    'enhanced-card--hoverable': props.hoverable,
    'enhanced-card--bordered': props.bordered,
    'enhanced-card--loading': props.loading,
    'enhanced-card--selected': props.selected
  }
])
</script>

<style lang="scss" scoped>
// Define enhanced-card mixin locally since Vue scoped styles can't access global mixins
@mixin enhanced-card-local {
  background: var(--card-background-color);
  border-radius: var(--radius-lg);
  border: 1px solid rgba(0, 0, 0, 0.05);
  box-shadow: var(--shadow-base);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;

  &:hover {
    box-shadow: var(--shadow-lg);
    transform: translateY(-2px);
    border-color: rgba(0, 0, 0, 0.08);
  }

  .card-header {
    padding: var(--space-6) var(--space-6) var(--space-4);
    border-bottom: 1px solid var(--border-color);

    .card-title {
      font-size: var(--text-lg);
      font-weight: 600;
      color: var(--text-color);
      margin: 0;
      line-height: var(--leading-tight);
    }

    .card-description {
      font-size: var(--text-sm);
      color: var(--text-color-secondary);
      margin: var(--space-1) 0 0;
      line-height: var(--leading-normal);
    }
  }

  .card-content {
    padding: var(--space-6);
  }

  .card-footer {
    padding: var(--space-4) var(--space-6);
    border-top: 1px solid var(--border-color);
    background: var(--background-color);
    background-color: rgba(var(--border-color-rgb, 0.05));
  }
}

.enhanced-card {
  @include enhanced-card-local;
  position: relative;
  background: var(--card-background-color);

  // Variant specific styles
  &--default {
    @include enhanced-card-local;
  }

  &--primary {
    border-left: 4px solid var(--primary-500);

    .enhanced-card__title {
      color: var(--primary-600);
    }
  }

  &--success {
    border-left: 4px solid var(--success-500);

    .enhanced-card__title {
      color: var(--success-600);
    }
  }

  &--warning {
    border-left: 4px solid var(--warning-500);

    .enhanced-card__title {
      color: var(--warning-600);
    }
  }

  &--danger {
    border-left: 4px solid var(--danger-500);

    .enhanced-card__title {
      color: var(--danger-600);
    }
  }

  &--info {
    border-left: 4px solid var(--info-500);

    .enhanced-card__title {
      color: var(--info-600);
    }
  }

  // Size variants
  &--size-sm {
    .enhanced-card__title {
      font-size: var(--text-base);
    }

    .enhanced-card__description {
      font-size: var(--text-xs);
    }

    .enhanced-card__header {
      padding: var(--space-3) var(--space-4) var(--space-2);
    }

    .enhanced-card__content {
      padding: var(--space-3) var(--space-4);
    }

    .enhanced-card__footer {
      padding: var(--space-2) var(--space-4);
    }
  }

  &--size-md {
    .enhanced-card__header {
      padding: var(--space-4) var(--space-6) var(--space-3);
    }

    .enhanced-card__content {
      padding: var(--space-4) var(--space-6);
    }

    .enhanced-card__footer {
      padding: var(--space-3) var(--space-6);
    }
  }

  &--size-lg {
    .enhanced-card__title {
      font-size: var(--text-xl);
    }

    .enhanced-card__description {
      font-size: var(--text-base);
    }

    .enhanced-card__header {
      padding: var(--space-6) var(--space-8) var(--space-4);
    }

    .enhanced-card__content {
      padding: var(--space-6) var(--space-8);
    }

    .enhanced-card__footer {
      padding: var(--space-4) var(--space-8);
    }
  }

  // States
  &--hoverable {
    cursor: pointer;

    &:hover {
      transform: translateY(-4px);
      box-shadow: var(--shadow-xl);
    }
  }

  &--bordered {
    border: 1px solid var(--border-color);
  }

  &--loading {
    pointer-events: none;
    opacity: 0.8;
  }

  &--selected {
    border-color: var(--primary-500);
    box-shadow: 0 0 0 2px rgba(var(--primary-500), 0.2);
  }

  // Sub-components
  &__header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: var(--space-3);
    border-bottom: 1px solid var(--border-color);
  }

  &__header-content {
    flex: 1;
  }

  &__header-actions {
    display: flex;
    align-items: center;
    gap: var(--space-2);
  }

  &__title {
    font-size: var(--text-lg);
    font-weight: 600;
    color: var(--text-color);
    margin: 0 0 var(--space-1);
    line-height: var(--leading-tight);
  }

  &__description {
    font-size: var(--text-sm);
    color: var(--text-color-secondary);
    margin: 0;
    line-height: var(--leading-relaxed);
  }

  &__content {
    flex: 1;
  }

  &__footer {
    border-top: 1px solid var(--border-color);
    background: var(--background-color);
    background-color: rgba(var(--border-color-rgb, 0.05));
  }

  &__loading-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(255, 255, 255, 0.9);
    backdrop-filter: blur(4px);
    border-radius: inherit;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    z-index: 10;
  }

  &__loading-spinner {
    width: 32px;
    height: 32px;
    border: 3px solid var(--primary-100);
    border-top-color: var(--primary-500);
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
    margin-bottom: var(--space-3);
  }

  &__loading-text {
    font-size: var(--text-sm);
    color: var(--text-color-secondary);
    margin: 0;
  }

  &__selection-indicator {
    position: absolute;
    top: var(--space-3);
    right: var(--space-3);
    width: 24px;
    height: 24px;
    background: var(--primary-500);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 5;
  }

  &__selection-check {
    color: white;
    font-size: var(--text-sm);
    font-weight: bold;
  }
}

// Dark theme adjustments
html.dark {
  .enhanced-card {
    &__loading-overlay {
      background: rgba(0, 0, 0, 0.8);
    }

    &__footer {
      background: var(--card-background-color);
    }
  }
}

// Responsive breakpoint mixin for scoped styles
@mixin respond-to-local($breakpoint) {
  $breakpoints: (
    xs: 0,
    sm: 640px,
    md: 768px,
    lg: 1024px,
    xl: 1280px,
    2xl: 1536px
  );

  @if map-has-key($breakpoints, $breakpoint) {
    @media (min-width: map-get($breakpoints, $breakpoint)) {
      @content;
    }
  }
}

// Responsive adjustments
@include respond-to-local(sm) {
  .enhanced-card {
    margin-bottom: var(--space-4);
  }
}

@include respond-to-local(xs) {
  .enhanced-card {
    &--size-md,
    &--size-lg {
      .enhanced-card__header {
        padding: var(--space-3) var(--space-4) var(--space-2);
      }

      .enhanced-card__content {
        padding: var(--space-3) var(--space-4);
      }

      .enhanced-card__footer {
        padding: var(--space-2) var(--space-4);
      }
    }

    &__title {
      font-size: var(--text-base);
    }

    &__description {
      font-size: var(--text-sm);
    }
  }
}
</style>