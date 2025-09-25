<template>
  <Transition
    name="loading-transition"
    mode="out-in"
  >
    <div
      v-if="modelValue"
      class="global-loading"
      :class="[
        `global-loading--${variant}`,
        `global-loading--size-${size}`,
        {
          'global-loading--fullscreen': fullscreen,
          'global-loading--overlay': overlay,
          'global-loading--blur': blur
        }
      ]"
    >
      <!-- Backdrop -->
      <div
        class="global-loading__backdrop"
        :class="{ 'global-loading__backdrop--blur': blur }"
        @click="handleBackdropClick"
      ></div>

      <!-- Loading Content -->
      <div class="global-loading__content">
        <!-- Loading Spinner -->
        <div
          class="global-loading__spinner"
          :class="`global-loading__spinner--${spinnerType}`"
        >
          <!-- Circle Spinner -->
          <div
            v-if="spinnerType === 'circle'"
            class="global-loading__spinner-circle"
          ></div>

          <!-- Dots Spinner -->
          <div v-else-if="spinnerType === 'dots'" class="global-loading__spinner-dots">
            <div class="global-loading__dot global-loading__dot--1"></div>
            <div class="global-loading__dot global-loading__dot--2"></div>
            <div class="global-loading__dot global-loading__dot--3"></div>
          </div>

          <!-- Pulse Spinner -->
          <div v-else-if="spinnerType === 'pulse'" class="global-loading__spinner-pulse">
            <div class="global-loading__pulse-circle"></div>
          </div>

          <!-- Default Spinner -->
          <div v-else class="global-loading__spinner-default">
            <div class="global-loading__spinner-part"></div>
            <div class="global-loading__spinner-part"></div>
            <div class="global-loading__spinner-part"></div>
            <div class="global-loading__spinner-part"></div>
          </div>
        </div>

        <!-- Loading Text -->
        <p
          v-if="text"
          class="global-loading__text"
          :class="`global-loading__text--size-${size}`"
        >
          {{ text }}
        </p>

        <!-- Progress Bar (if progress is provided) -->
        <div
          v-if="progress !== undefined"
          class="global-loading__progress"
          :class="`global-loading__progress--size-${size}`"
        >
          <div class="global-loading__progress-track">
            <div
              class="global-loading__progress-bar"
              :style="{ width: `${progress}%` }"
            ></div>
          </div>
          <span class="global-loading__progress-text">{{ progress }}%</span>
        </div>

        <!-- Cancel Button (if allowed) -->
        <EnhancedButton
          v-if="cancellable"
          variant="ghost"
          size="sm"
          class="global-loading__cancel"
          @click="$emit('cancel')"
        >
          Cancel
        </EnhancedButton>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { watch } from 'vue'
import EnhancedButton from './EnhancedButton.vue'

export interface GlobalLoadingProps {
  modelValue: boolean
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  fullscreen?: boolean
  overlay?: boolean
  blur?: boolean
  text?: string
  spinnerType?: 'default' | 'circle' | 'dots' | 'pulse'
  cancellable?: boolean
  progress?: number
  closeOnClick?: boolean
}

const props = withDefaults(defineProps<GlobalLoadingProps>(), {
  variant: 'primary',
  size: 'md',
  fullscreen: false,
  overlay: true,
  blur: false,
  text: 'Loading...',
  spinnerType: 'default',
  cancellable: false,
  closeOnClick: false
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  'cancel': []
  'backdrop-click': []
}>()

// Handle backdrop click
const handleBackdropClick = () => {
  if (props.closeOnClick) {
    emit('update:modelValue', false)
  }
  emit('backdrop-click')
}

// Prevent body scroll when fullscreen loading is active
watch(() => props.modelValue && props.fullscreen, (isActive) => {
  if (isActive) {
    document.body.style.overflow = 'hidden'
    document.body.style.paddingRight = '0px' // Prevent layout shift
  } else {
    document.body.style.overflow = ''
    document.body.style.paddingRight = ''
  }
}, { immediate: true })
</script>

<style lang="scss" scoped>
.global-loading {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 9999;
  pointer-events: none;

  &--overlay {
    pointer-events: auto;
  }

  &--fullscreen {
    position: fixed;
  }

  // Backdrop
  &__backdrop {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    transition: background-color 0.3s ease;

    &--blur {
      background: rgba(0, 0, 0, 0.3);
      backdrop-filter: blur(4px);
    }
  }

  // Content container
  &__content {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: var(--card-background-color);
    border-radius: var(--radius-lg);
    padding: var(--space-6) var(--space-8);
    box-shadow: var(--shadow-2xl);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: var(--space-4);
    min-width: 200px;
    pointer-events: auto;
    border: 1px solid var(--border-color);
  }

  // Size variants
  &--size-sm {
    .global-loading__content {
      padding: var(--space-4) var(--space-6);
      min-width: 160px;
      gap: var(--space-3);
    }

    .global-loading__spinner {
      width: 24px;
      height: 24px;
    }

    .global-loading__text {
      font-size: var(--text-xs);
    }

    .global-loading__progress {
      width: 120px;
      height: 8px;
    }

    .global-loading__cancel {
      padding: var(--space-1) var(--space-3) !important;
      font-size: var(--text-xs) !important;
    }
  }

  &--size-md {
    .global-loading__content {
      padding: var(--space-6) var(--space-8);
      min-width: 200px;
      gap: var(--space-4);
    }

    .global-loading__spinner {
      width: 32px;
      height: 32px;
    }

    .global-loading__text {
      font-size: var(--text-sm);
    }

    .global-loading__progress {
      width: 160px;
      height: 10px;
    }
  }

  &--size-lg {
    .global-loading__content {
      padding: var(--space-8) var(--space-10);
      min-width: 280px;
      gap: var(--space-6);
    }

    .global-loading__spinner {
      width: 48px;
      height: 48px;
    }

    .global-loading__text {
      font-size: var(--text-base);
    }

    .global-loading__progress {
      width: 200px;
      height: 12px;
    }
  }

  // Variant colors
  &--default {
    .global-loading__spinner-part,
    .global-loading__spinner-circle,
    .global-loading__dot {
      background: var(--primary-500);
    }

    .global-loading__pulse-circle {
      border-color: var(--primary-500);
    }

    .global-loading__progress-bar {
      background: var(--primary-500);
    }
  }

  &--primary {
    .global-loading__spinner-part,
    .global-loading__spinner-circle,
    .global-loading__dot {
      background: var(--primary-500);
    }

    .global-loading__pulse-circle {
      border-color: var(--primary-500);
    }

    .global-loading__progress-bar {
      background: var(--primary-500);
    }
  }

  &--success {
    .global-loading__spinner-part,
    .global-loading__spinner-circle,
    .global-loading__dot {
      background: var(--success-500);
    }

    .global-loading__pulse-circle {
      border-color: var(--success-500);
    }

    .global-loading__progress-bar {
      background: var(--success-500);
    }
  }

  &--warning {
    .global-loading__spinner-part,
    .global-loading__spinner-circle,
    .global-loading__dot {
      background: var(--warning-500);
    }

    .global-loading__pulse-circle {
      border-color: var(--warning-500);
    }

    .global-loading__progress-bar {
      background: var(--warning-500);
    }
  }

  &--danger {
    .global-loading__spinner-part,
    .global-loading__spinner-circle,
    .global-loading__dot {
      background: var(--danger-500);
    }

    .global-loading__pulse-circle {
      border-color: var(--danger-500);
    }

    .global-loading__progress-bar {
      background: var(--danger-500);
    }
  }

  // Spinner types
  &__spinner {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;

    &--default {
      // Default spinner styles
    }

    &--circle .global-loading__spinner-circle {
      width: 100%;
      height: 100%;
      border: 3px solid currentColor;
      border-top-color: transparent;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }

    &--dots .global-loading__spinner-dots {
      display: flex;
      gap: var(--space-2);
    }

    &--pulse .global-loading__spinner-pulse {
      position: relative;
      width: 100%;
      height: 100%;
    }
  }

  &__spinner-default {
    animation: rotate 1s linear infinite;

    .global-loading__spinner-part {
      position: absolute;
      width: 25%;
      height: 25%;
      background: currentColor;
      border-radius: 50%;
      opacity: 0.8;

      &:nth-child(1) { top: 0; left: 37.5%; animation-delay: 0s; }
      &:nth-child(2) { top: 37.5%; right: 0; animation-delay: 0.1s; }
      &:nth-child(3) { bottom: 0; left: 37.5%; animation-delay: 0.2s; }
      &:nth-child(4) { top: 37.5%; left: 0; animation-delay: 0.3s; }
    }
  }

  &__spinner-circle {
    // Circle spinner styles in parent
  }

  &__spinner-dots {
    // Dots spinner styles in parent
  }

  &__dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: currentColor;
    animation: dot-pulse 1.4s ease-in-out infinite both;

    &--1 { animation-delay: -0.32s; }
    &--2 { animation-delay: -0.16s; }
    &--3 { animation-delay: 0s; }
  }

  &__spinner-pulse {
    // Pulse spinner styles in parent
  }

  &__pulse-circle {
    width: 100%;
    height: 100%;
    border: 3px solid currentColor;
    border-radius: 50%;
    animation: pulse 2s ease-in-out infinite;
  }

  // Text
  &__text {
    margin: 0;
    text-align: center;
    color: var(--text-color);
    font-weight: 500;
    line-height: var(--leading-tight);

    &--size-sm {
      font-size: var(--text-xs);
    }

    &--size-md {
      font-size: var(--text-sm);
    }

    &--size-lg {
      font-size: var(--text-base);
    }
  }

  // Progress bar
  &__progress {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--space-2);

    &--size-sm {
      // Size handled in parent
    }

    &--size-md {
      // Size handled in parent
    }

    &--size-lg {
      // Size handled in parent
    }
  }

  &__progress-track {
    width: 100%;
    height: 100%;
    background: var(--border-color);
    border-radius: var(--radius-sm);
    overflow: hidden;
  }

  &__progress-bar {
    height: 100%;
    background: currentColor;
    border-radius: var(--radius-sm);
    transition: width 0.3s ease;
  }

  &__progress-text {
    font-size: var(--text-xs);
    color: var(--text-color-secondary);
    font-weight: 600;
  }

  // Cancel button
  &__cancel {
    // Button styles handled by EnhancedButton
  }
}

// Animations
@keyframes spin {
  to { transform: rotate(360deg); }
}

@keyframes rotate {
  to { transform: rotate(360deg); }
}

@keyframes dot-pulse {
  0%, 80%, 100% {
    transform: scale(0.8);
    opacity: 0.5;
  }
  40% {
    transform: scale(1);
    opacity: 1;
  }
}

@keyframes pulse {
  0% {
    transform: scale(0.95);
    opacity: 1;
  }
  50% {
    transform: scale(1.1);
    opacity: 0.7;
  }
  100% {
    transform: scale(0.95);
    opacity: 1;
  }
}

// Transition animations
.loading-transition-enter-active,
.loading-transition-leave-active {
  transition: opacity 0.3s ease;
}

.loading-transition-enter-from,
.loading-transition-leave-to {
  opacity: 0;
}

// Dark theme adjustments
html.dark {
  .global-loading {
    &__backdrop {
      background: rgba(0, 0, 0, 0.7);
    }

    &__content {
      background: var(--card-background-color);
      border-color: var(--border-color);
    }

    &__progress-track {
      background: var(--border-color);
    }
  }
}

// Responsive adjustments
// Define responsive mixin locally since Vue scoped styles can't access global mixins
@mixin respond-to-local($breakpoint) {
  @if $breakpoint == xs {
    @media (max-width: 639px) { @content; }
  }
}

@include respond-to-local(xs) {
  .global-loading {
    &__content {
      margin: var(--space-4);
      max-width: calc(100vw - var(--space-8));
    }

    &--size-lg {
      .global-loading__content {
        padding: var(--space-6) var(--space-8);
        min-width: 240px;
      }

      .global-loading__spinner {
        width: 40px;
        height: 40px;
      }

      .global-loading__text {
        font-size: var(--text-sm);
      }

      .global-loading__progress {
        width: 180px;
        height: 10px;
      }
    }
  }
}

// Accessibility improvements
.global-loading__content {
  // Ensure proper contrast and focus management
  role: "alertdialog";
  aria-live: "polite";
  aria-busy: "true";
}

// Loading state body scroll prevention
body.loading-global-scroll-locked {
  overflow: hidden;
  position: fixed;
  width: 100%;
  height: 100%;
}
</style>