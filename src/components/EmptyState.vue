<template>
  <div
    class="empty-state"
    :class="[
      `empty-state--${variant}`,
      `empty-state--size-${size}`,
      {
        'empty-state--centered': centered,
        'empty-state--interactive': interactive
      }
    ]"
  >
    <!-- Illustration Container -->
    <div class="empty-state__illustration">
      <slot name="illustration">
        <!-- Default Illustration SVG -->
        <svg
          v-if="variant === 'default'"
          class="empty-state__default-illustration"
          width="200"
          height="200"
          viewBox="0 0 200 200"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect x="40" y="40" width="120" height="120" rx="12" fill="currentColor" opacity="0.1"/>
          <circle cx="100" cy="100" r="30" fill="currentColor" opacity="0.2"/>
          <path d="M85 100 L115 100 M100 85 L100 115" stroke="currentColor" stroke-width="3" stroke-linecap="round"/>
        </svg>

        <!-- Search Illustration -->
        <svg
          v-else-if="variant === 'search'"
          class="empty-state__default-illustration"
          width="200"
          height="200"
          viewBox="0 0 200 200"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="80" cy="80" r="35" stroke="currentColor" stroke-width="3" opacity="0.3"/>
          <path d="M105 105 L140 140" stroke="currentColor" stroke-width="4" stroke-linecap="round" opacity="0.3"/>
          <circle cx="100" cy="100" r="45" fill="currentColor" opacity="0.1"/>
        </svg>

        <!-- Error Illustration -->
        <svg
          v-else-if="variant === 'error'"
          class="empty-state__default-illustration"
          width="200"
          height="200"
          viewBox="0 0 200 200"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="100" cy="100" r="60" fill="currentColor" opacity="0.1"/>
          <path d="M80 80 L120 120 M120 80 L80 120" stroke="currentColor" stroke-width="4" stroke-linecap="round" opacity="0.6"/>
        </svg>

        <!-- Success Illustration -->
        <svg
          v-else-if="variant === 'success'"
          class="empty-state__default-illustration"
          width="200"
          height="200"
          viewBox="0 0 200 200"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="100" cy="100" r="60" fill="currentColor" opacity="0.1"/>
          <path d="M75 100 L90 115 L125 80" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" opacity="0.6"/>
        </svg>

        <!-- Loading Illustration -->
        <svg
          v-else-if="variant === 'loading'"
          class="empty-state__default-illustration animate-spin"
          width="200"
          height="200"
          viewBox="0 0 200 200"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="100" cy="100" r="60" stroke="currentColor" stroke-width="4" opacity="0.3"/>
          <path d="M100 40 A60 60 0 0 1 160 100" stroke="currentColor" stroke-width="4" stroke-linecap="round" opacity="0.8"/>
        </svg>

        <!-- Fallback icon -->
        <div v-else class="empty-state__fallback-icon">
          {{ icon }}
        </div>
      </slot>
    </div>

    <!-- Content Container -->
    <div class="empty-state__content">
      <!-- Title -->
      <h3 v-if="title" class="empty-state__title">
        {{ title }}
      </h3>

      <!-- Description -->
      <p v-if="description" class="empty-state__description">
        {{ description }}
      </p>

      <!-- Additional Content -->
      <div v-if="$slots.default" class="empty-state__additional-content">
        <slot></slot>
      </div>

      <!-- Actions -->
      <div v-if="actions.length > 0 || $slots.actions" class="empty-state__actions">
        <slot name="actions">
          <EnhancedButton
            v-for="(action, index) in actions"
            :key="action.key || index"
            :variant="action.variant || 'primary'"
            :size="action.size || 'md'"
            :loading="action.loading"
            :disabled="action.disabled"
            @click="handleActionClick(action)"
          >
            <template v-if="action.prefix" #prefix>
              {{ action.prefix }}
            </template>
            {{ action.label }}
            <template v-if="action.suffix" #suffix>
              {{ action.suffix }}
            </template>
          </EnhancedButton>
        </slot>
      </div>
    </div>

    <!-- Subtle Animation Elements -->
    <div v-if="animated" class="empty-state__animation">
      <div class="empty-state__particle empty-state__particle--1"></div>
      <div class="empty-state__particle empty-state__particle--2"></div>
      <div class="empty-state__particle empty-state__particle--3"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import EnhancedButton from './EnhancedButton.vue'

export interface EmptyStateAction {
  key?: string
  label: string
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'outline' | 'ghost' | 'link'
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  prefix?: string
  suffix?: string
  loading?: boolean
  disabled?: boolean
  onClick?: () => void | Promise<void>
}

export interface EmptyStateProps {
  variant?: 'default' | 'search' | 'error' | 'success' | 'loading' | 'custom'
  size?: 'sm' | 'md' | 'lg'
  centered?: boolean
  interactive?: boolean
  animated?: boolean
  icon?: string
  title?: string
  description?: string
  actions?: EmptyStateAction[]
}

const props = withDefaults(defineProps<EmptyStateProps>(), {
  variant: 'default',
  size: 'md',
  centered: true,
  interactive: true,
  animated: true,
  actions: () => []
})

const emit = defineEmits<{
  'action-click': [action: EmptyStateAction]
}>()

const handleActionClick = async (action: EmptyStateAction) => {
  try {
    if (action.onClick) {
      await action.onClick()
    }
    emit('action-click', action)
  } catch (error) {
    console.error('Empty state action failed:', error)
  }
}
</script>

<style lang="scss" scoped>
.empty-state {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: var(--space-8) var(--space-6);
  background: var(--card-background-color);
  border-radius: var(--radius-lg);
  border: 1px dashed var(--border-color);
  transition: all 0.3s ease;
  min-height: 300px;

  // Size variants
  &--size-sm {
    padding: var(--space-6) var(--space-4);
    min-height: 200px;

    .empty-state__illustration {
      width: 120px;
      height: 120px;
      margin-bottom: var(--space-3);
    }

    .empty-state__title {
      font-size: var(--text-lg);
      margin-bottom: var(--space-1);
    }

    .empty-state__description {
      font-size: var(--text-sm);
      margin-bottom: var(--space-3);
    }

    .empty-state__actions {
      gap: var(--space-2);
    }
  }

  &--size-md {
    padding: var(--space-8) var(--space-6);
    min-height: 300px;

    .empty-state__illustration {
      width: 160px;
      height: 160px;
      margin-bottom: var(--space-4);
    }

    .empty-state__title {
      font-size: var(--text-xl);
      margin-bottom: var(--space-2);
    }

    .empty-state__description {
      font-size: var(--text-base);
      margin-bottom: var(--space-4);
    }

    .empty-state__actions {
      gap: var(--space-3);
    }
  }

  &--size-lg {
    padding: var(--space-12) var(--space-8);
    min-height: 400px;

    .empty-state__illustration {
      width: 200px;
      height: 200px;
      margin-bottom: var(--space-6);
    }

    .empty-state__title {
      font-size: var(--text-2xl);
      margin-bottom: var(--space-3);
    }

    .empty-state__description {
      font-size: var(--text-lg);
      margin-bottom: var(--space-6);
    }

    .empty-state__actions {
      gap: var(--space-4);
    }
  }

  // Variant colors
  &--default {
    color: var(--text-color-secondary);

    .empty-state__default-illustration {
      color: var(--info-500);
    }
  }

  &--search {
    color: var(--text-color-secondary);

    .empty-state__default-illustration {
      color: var(--primary-500);
    }
  }

  &--error {
    color: var(--text-color-secondary);

    .empty-state__default-illustration {
      color: var(--danger-500);
    }
  }

  &--success {
    color: var(--text-color-secondary);

    .empty-state__default-illustration {
      color: var(--success-500);
    }
  }

  &--loading {
    color: var(--text-color-secondary);

    .empty-state__default-illustration {
      color: var(--primary-500);
    }
  }

  &--custom {
    color: var(--text-color-secondary);
  }

  // Layout variants
  &--centered {
    justify-content: center;
  }

  &--interactive {
    cursor: pointer;

    &:hover {
      border-color: var(--primary-500);
      background: var(--primary-50);
      transform: translateY(-2px);
      box-shadow: var(--shadow-lg);
    }
  }

  // Sub-components
  &__illustration {
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
  }

  &__default-illustration {
    width: 100%;
    height: 100%;
    opacity: 0.6;
  }

  &__fallback-icon {
    font-size: var(--text-5xl);
    opacity: 0.6;
  }

  &__content {
    display: flex;
    flex-direction: column;
    align-items: center;
    max-width: 400px;
    width: 100%;
    z-index: 1;
  }

  &__title {
    font-weight: 600;
    margin: 0;
    line-height: var(--leading-tight);
    color: var(--text-color);
  }

  &__description {
    margin: 0;
    line-height: var(--leading-relaxed);
    color: var(--text-color-secondary);
  }

  &__additional-content {
    margin: var(--space-4) 0;
    width: 100%;
  }

  &__actions {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: var(--space-3);
    margin-top: var(--space-4);
  }

  // Animation elements
  &__animation {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    pointer-events: none;
    overflow: hidden;
    border-radius: inherit;
  }

  &__particle {
    position: absolute;
    width: 6px;
    height: 6px;
    background: var(--primary-200);
    border-radius: 50%;
    opacity: 0;

    &--1 {
      top: 20%;
      left: 10%;
      animation: float-up 3s ease-in-out infinite;
      animation-delay: 0s;
    }

    &--2 {
      top: 60%;
      right: 15%;
      animation: float-up 3s ease-in-out infinite;
      animation-delay: 1s;
    }

    &--3 {
      bottom: 30%;
      left: 20%;
      animation: float-up 3s ease-in-out infinite;
      animation-delay: 2s;
    }
  }
}

// Animations
@keyframes float-up {
  0%, 100% {
    opacity: 0;
    transform: translateY(0) scale(0.8);
  }

  50% {
    opacity: 1;
    transform: translateY(-20px) scale(1);
  }
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

// Dark theme adjustments
html.dark {
  .empty-state {
    background: var(--card-background-color);
    border-color: var(--border-color);

    &__particle {
      background: var(--primary-700);
    }

    &:hover {
      background: rgba(88, 166, 255, 0.05);
    }
  }
}

// Responsive adjustments
// Define responsive mixin locally since Vue scoped styles can't access global mixins
@mixin respond-to-local($breakpoint) {
  @if $breakpoint == sm {
    @media (min-width: 640px) { @content; }
  }
  @if $breakpoint == xs {
    @media (max-width: 639px) { @content; }
  }
}

@include respond-to-local(sm) {
  .empty-state {
    margin: var(--space-4);

    &--size-md,
    &--size-lg {
      .empty-state__illustration {
        width: 140px;
        height: 140px;
        margin-bottom: var(--space-3);
      }

      .empty-state__title {
        font-size: var(--text-lg);
      }

      .empty-state__description {
        font-size: var(--text-sm);
      }
    }
  }
}

@include respond-to-local(xs) {
  .empty-state {
    padding: var(--space-6) var(--space-4);
    margin: var(--space-3);
    min-height: 250px;

    &--size-md,
    &--size-lg {
      .empty-state__illustration {
        width: 120px;
        height: 120px;
        margin-bottom: var(--space-3);
      }

      .empty-state__title {
        font-size: var(--text-base);
      }

      .empty-state__description {
        font-size: var(--text-sm);
      }

      .empty-state__actions {
        flex-direction: column;
        align-items: center;
        gap: var(--space-2);
        width: 100%;
      }
    }
  }
}
</style>