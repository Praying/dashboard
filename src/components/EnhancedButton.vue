<template>
  <button
    ref="buttonRef"
    class="enhanced-button"
    :class="[
      `enhanced-button--${variant}`,
      `enhanced-button--size-${size}`,
      {
        'enhanced-button--block': block,
        'enhanced-button--round': round,
        'enhanced-button--loading': loading,
        'enhanced-button--disabled': disabled || loading,
        'enhanced-button--icon-only': iconOnly,
        'enhanced-button--with-icon': hasIcon && !iconOnly
      }
    ]"
    :disabled="disabled || loading"
    :type="type"
    @click="handleClick"
    @mousedown="createRipple"
  >
    <!-- Loading Spinner -->
    <span v-if="loading" class="enhanced-button__loading">
      <span class="enhanced-button__loading-spinner"></span>
    </span>

    <!-- Icon (left) -->
    <span v-if="$slots.prefix && !loading" class="enhanced-button__prefix">
      <slot name="prefix"></slot>
    </span>

    <!-- Main Content -->
    <span class="enhanced-button__content">
      <slot></slot>
    </span>

    <!-- Icon (right) -->
    <span v-if="$slots.suffix && !loading" class="enhanced-button__suffix">
      <slot name="suffix"></slot>
    </span>

    <!-- Ripple Effect Container -->
    <span class="enhanced-button__ripple-container"></span>
  </button>
</template>

<script setup lang="ts">
import { ref, computed, useSlots } from 'vue'

export interface EnhancedButtonProps {
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'outline' | 'ghost' | 'link'
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  block?: boolean
  round?: boolean
  loading?: boolean
  disabled?: boolean
  type?: 'button' | 'submit' | 'reset'
  ripple?: boolean
}

const props = withDefaults(defineProps<EnhancedButtonProps>(), {
  variant: 'primary',
  size: 'md',
  block: false,
  round: false,
  loading: false,
  disabled: false,
  type: 'button',
  ripple: true
})

const emit = defineEmits<{
  click: [event: MouseEvent]
}>()

const buttonRef = ref<HTMLButtonElement>()
const slots = useSlots()

// Check if button has icons
const hasIcon = computed(() => Boolean(slots.prefix || slots.suffix))
const iconOnly = computed(() => Boolean((slots.prefix || slots.suffix) && !slots.default))

const handleClick = (event: MouseEvent) => {
  if (!props.disabled && !props.loading) {
    emit('click', event)
  }
}

const createRipple = (event: MouseEvent) => {
  if (!props.ripple || props.disabled || props.loading) return

  const button = buttonRef.value
  if (!button) return

  const rect = button.getBoundingClientRect()
  const ripple = document.createElement('span')
  const size = Math.max(rect.width, rect.height)
  const x = event.clientX - rect.left - size / 2
  const y = event.clientY - rect.top - size / 2

  ripple.style.width = ripple.style.height = size + 'px'
  ripple.style.left = x + 'px'
  ripple.style.top = y + 'px'
  ripple.classList.add('enhanced-button__ripple')

  const rippleContainer = button.querySelector('.enhanced-button__ripple-container')
  if (rippleContainer) {
    rippleContainer.appendChild(ripple)

    // Remove ripple after animation
    setTimeout(() => {
      ripple?.remove()
    }, 600)
  }
}
</script>

<style lang="scss" scoped>
// Define enhanced-button mixin locally since Vue scoped styles can't access global mixins
@mixin enhanced-button-local($variant: 'primary', $size: 'md') {
  position: relative;
  overflow: hidden;
  border-radius: var(--radius-md);
  font-weight: 500;
  text-align: center;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
  user-select: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);

  // Size variants
  @if $size == 'sm' {
    padding: var(--space-2) var(--space-4);
    font-size: var(--text-sm);
    min-height: 32px;
  }

  @if $size == 'md' {
    padding: var(--space-3) var(--space-4);
    font-size: var(--text-sm);
    min-height: 40px;
  }

  @if $size == 'lg' {
    padding: var(--space-4) var(--space-6);
    font-size: var(--text-base);
    min-height: 48px;
  }

  @if $size == 'xl' {
    padding: var(--space-5) var(--space-8);
    font-size: var(--text-lg);
    min-height: 56px;
  }

  // Color variants
  @if $variant == 'primary' {
    background: var(--primary-500);
    color: white;
    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);

    &:hover {
      background: var(--primary-600);
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    }

    &:active {
      background: var(--primary-700);
      transform: scale(0.98);
    }
  }

  @if $variant == 'secondary' {
    background: var(--secondary-500);
    color: white;
    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);

    &:hover {
      background: var(--secondary-600);
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    }

    &:active {
      background: var(--secondary-700);
      transform: scale(0.98);
    }
  }

  @if $variant == 'success' {
    background: var(--success-500);
    color: white;
    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);

    &:hover {
      background: var(--success-600);
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    }

    &:active {
      background: var(--success-700);
      transform: scale(0.98);
    }
  }

  @if $variant == 'warning' {
    background: var(--warning-500);
    color: white;
    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);

    &:hover {
      background: var(--warning-600);
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    }

    &:active {
      background: var(--warning-700);
      transform: scale(0.98);
    }
  }

  @if $variant == 'danger' {
    background: var(--danger-500);
    color: white;
    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);

    &:hover {
      background: var(--danger-600);
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    }

    &:active {
      background: var(--danger-700);
      transform: scale(0.98);
    }
  }

  @if $variant == 'outline' {
    background: transparent;
    color: var(--primary-500);
    border: 1px solid var(--primary-500);
    box-shadow: none;

    &:hover {
      background: var(--primary-50);
      box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
    }

    &:active {
      background: var(--primary-100);
      transform: scale(0.98);
    }
  }

  @if $variant == 'ghost' {
    background: transparent;
    color: var(--text-color);
    border: 1px solid var(--border-color);
    box-shadow: none;

    &:hover {
      background: var(--background-color);
      border-color: var(--primary-500);
      color: var(--primary-500);
      box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
    }

    &:active {
      background: var(--primary-50);
      transform: scale(0.98);
    }
  }

  @if $variant == 'link' {
    background: transparent;
    color: var(--primary-500);
    border: none;
    box-shadow: none;
    padding: 0;
    min-height: auto;
    text-decoration: underline;
    text-decoration-color: transparent;

    &:hover {
      text-decoration-color: var(--primary-500);
      background: transparent;
      box-shadow: none;
      transform: none;
    }

    &:active {
      transform: scale(0.98);
    }
  }

  &.disabled,
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    pointer-events: none;

    &:hover {
      transform: none;
      box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
    }
  }

  // Shimmer effect
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
    transition: left 0.5s ease;
  }

  &:hover::before {
    left: 100%;
  }

  // Loading state
  &.loading {
    pointer-events: none;
    opacity: 0.8;

    &::after {
      content: '';
      position: absolute;
      width: 16px;
      height: 16px;
      border: 2px solid transparent;
      border-top-color: currentColor;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }
  }
}

.enhanced-button {
  @include enhanced-button-local('primary', 'md');
  position: relative;
  outline: none;
  text-transform: none;
  letter-spacing: normal;
  white-space: nowrap;
  user-select: none;

  // Size variants
  &--size-xs {
    @include enhanced-button-local('primary', 'xs');
  }

  &--size-sm {
    @include enhanced-button-local('primary', 'sm');
  }

  &--size-md {
    @include enhanced-button-local('primary', 'md');
  }

  &--size-lg {
    @include enhanced-button-local('primary', 'lg');
  }

  &--size-xl {
    @include enhanced-button-local('primary', 'xl');
  }

  // Variant resets for custom styles
  &--secondary {
    @include enhanced-button-local('secondary', 'md');

    &.enhanced-button--size-xs { @include enhanced-button-local('secondary', 'xs'); }
    &.enhanced-button--size-sm { @include enhanced-button-local('secondary', 'sm'); }
    &.enhanced-button--size-md { @include enhanced-button-local('secondary', 'md'); }
    &.enhanced-button--size-lg { @include enhanced-button-local('secondary', 'lg'); }
    &.enhanced-button--size-xl { @include enhanced-button-local('secondary', 'xl'); }
  }

  &--success {
    @include enhanced-button-local('success', 'md');

    &.enhanced-button--size-xs { @include enhanced-button-local('success', 'xs'); }
    &.enhanced-button--size-sm { @include enhanced-button-local('success', 'sm'); }
    &.enhanced-button--size-md { @include enhanced-button-local('success', 'md'); }
    &.enhanced-button--size-lg { @include enhanced-button-local('success', 'lg'); }
    &.enhanced-button--size-xl { @include enhanced-button-local('success', 'xl'); }
  }

  &--warning {
    @include enhanced-button-local('warning', 'md');

    &.enhanced-button--size-xs { @include enhanced-button-local('warning', 'xs'); }
    &.enhanced-button--size-sm { @include enhanced-button-local('warning', 'sm'); }
    &.enhanced-button--size-md { @include enhanced-button-local('warning', 'md'); }
    &.enhanced-button--size-lg { @include enhanced-button-local('warning', 'lg'); }
    &.enhanced-button--size-xl { @include enhanced-button-local('warning', 'xl'); }
  }

  &--danger {
    @include enhanced-button-local('danger', 'md');

    &.enhanced-button--size-xs { @include enhanced-button-local('danger', 'xs'); }
    &.enhanced-button--size-sm { @include enhanced-button-local('danger', 'sm'); }
    &.enhanced-button--size-md { @include enhanced-button-local('danger', 'md'); }
    &.enhanced-button--size-lg { @include enhanced-button-local('danger', 'lg'); }
    &.enhanced-button--size-xl { @include enhanced-button-local('danger', 'xl'); }
  }

  &--outline {
    @include enhanced-button-local('outline', 'md');

    &.enhanced-button--size-xs { @include enhanced-button-local('outline', 'xs'); }
    &.enhanced-button--size-sm { @include enhanced-button-local('outline', 'sm'); }
    &.enhanced-button--size-md { @include enhanced-button-local('outline', 'md'); }
    &.enhanced-button--size-lg { @include enhanced-button-local('outline', 'lg'); }
    &.enhanced-button--size-xl { @include enhanced-button-local('outline', 'xl'); }
  }

  &--ghost {
    @include enhanced-button-local('ghost', 'md');

    &.enhanced-button--size-xs { @include enhanced-button-local('ghost', 'xs'); }
    &.enhanced-button--size-sm { @include enhanced-button-local('ghost', 'sm'); }
    &.enhanced-button--size-md { @include enhanced-button-local('ghost', 'md'); }
    &.enhanced-button--size-lg { @include enhanced-button-local('ghost', 'lg'); }
    &.enhanced-button--size-xl { @include enhanced-button-local('ghost', 'xl'); }
  }

  &--link {
    @include enhanced-button-local('link', 'md');

    &.enhanced-button--size-xs { @include enhanced-button-local('link', 'xs'); }
    &.enhanced-button--size-sm { @include enhanced-button-local('link', 'sm'); }
    &.enhanced-button--size-md { @include enhanced-button-local('link', 'md'); }
    &.enhanced-button--size-lg { @include enhanced-button-local('link', 'lg'); }
    &.enhanced-button--size-xl { @include enhanced-button-local('link', 'xl'); }
  }

  // Layout variants
  &--block {
    display: flex;
    width: 100%;
  }

  &--round {
    border-radius: 9999px;
  }

  &--icon-only {
    padding: 0;
    min-width: auto;
    width: auto;
    height: auto;
    aspect-ratio: 1;

    &.enhanced-button--size-xs {
      min-width: 24px;
      min-height: 24px;
      max-width: 24px;
      max-height: 24px;
    }

    &.enhanced-button--size-sm {
      min-width: 32px;
      min-height: 32px;
      max-width: 32px;
      max-height: 32px;
    }

    &.enhanced-button--size-md {
      min-width: 40px;
      min-height: 40px;
      max-width: 40px;
      max-height: 40px;
    }

    &.enhanced-button--size-lg {
      min-width: 48px;
      min-height: 48px;
      max-width: 48px;
      max-height: 48px;
    }

    &.enhanced-button--size-xl {
      min-width: 56px;
      min-height: 56px;
      max-width: 56px;
      max-height: 56px;
    }
  }

  &--with-icon {
    .enhanced-button__content {
      order: 1;
    }

    .enhanced-button__prefix {
      order: 0;
    }

    .enhanced-button__suffix {
      order: 2;
    }
  }

  // States
  &--loading {
    pointer-events: none;
    opacity: 0.8;
  }

  &--disabled {
    pointer-events: none;
    opacity: 0.5;
    cursor: not-allowed;
  }

  // Sub-components
  &__loading {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }

  &__loading-spinner {
    width: 16px;
    height: 16px;
    border: 2px solid rgba(255, 255, 255, 0.3);
    border-top-color: currentColor;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }

  &__prefix {
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }

  &__content {
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }

  &__suffix {
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }

  &__ripple-container {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    border-radius: inherit;
    overflow: hidden;
    pointer-events: none;
  }

  &__ripple {
    position: absolute;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.6);
    animation: ripple 0.6s ease-out;
  }

  // Focus styles
  &:focus-visible {
    outline: 2px solid var(--primary-500);
    outline-offset: 2px;
  }

  &:disabled {
    cursor: not-allowed;
  }

  // Group styles (for buttons in groups)
  &:not(:last-child):not(.enhanced-button--round) {
    border-radius: var(--radius-md) 0 0 var(--radius-md);
  }

  &:not(:first-of-type):not(.enhanced-button--round) {
    border-radius: 0 var(--radius-md) var(--radius-md) 0;
    margin-left: -1px;
  }
}

// Dark theme adjustments
html.dark {
  .enhanced-button {
    &__loading-spinner {
      border-color: rgba(0, 0, 0, 0.3);
      border-top-color: currentColor;
    }

    &__ripple {
      background: rgba(255, 255, 255, 0.3);
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
@include respond-to-local(xs) {
  .enhanced-button {
    &--block {
      width: 100%;
    }

    &--size-lg,
    &--size-xl {
      padding: var(--space-3) var(--space-6);
      font-size: var(--text-sm);
    }
  }
}
</style>