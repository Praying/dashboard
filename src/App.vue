<template>
  <router-view />
</template>

<script setup lang="ts">
// The root component now only needs to render the current route's component.
</script>

<style>
/* 原研哉设计理念：全局样式的精致统一 */
body {
  margin: 0;
  font-family: $font-family-base;
  font-size: $font-size-base;
  font-weight: $font-weight-normal;
  line-height: $line-height-base;
  color: var(--text-color);
  background-color: var(--background-color);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  transition: background-color $transition-slow, color $transition-slow;
}

/* 优化焦点状态 */
*:focus {
  outline: none;
}

*:focus-visible {
  outline: 2px solid var(--focus-outline);
  outline-offset: 2px;
  border-radius: $border-radius-sm;
}

/* 优化选择状态 */
::selection {
  background-color: var(--primary-color-light);
  color: var(--primary-color);
}

::-moz-selection {
  background-color: var(--primary-color-light);
  color: var(--primary-color);
}

/* 禁用文本选择的元素 */
.no-select {
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}

/* 图片优化 */
img {
  max-width: 100%;
  height: auto;
  border-radius: $border-radius-base;
}

/* 链接优化 */
a {
  color: var(--primary-color);
  text-decoration: none;
  transition: color $transition-base;
  
  &:hover {
    color: var(--primary-color);
    text-decoration: underline;
  }
}

/* 代码块优化 */
code {
  font-family: $font-family-mono;
  font-size: 0.875em;
  background-color: var(--accent-color);
  color: var(--text-color);
  padding: 0.125rem 0.25rem;
  border-radius: $border-radius-sm;
}

pre {
  font-family: $font-family-mono;
  background-color: var(--surface-color);
  color: var(--text-color);
  padding: $spacing-md;
  border-radius: $border-radius-md;
  overflow-x: auto;
  border: 1px solid var(--border-color);
}

/* 表单元素的全局优化 */
input, textarea, select {
  font-family: inherit;
  font-size: inherit;
  line-height: inherit;
}

/* 按钮的全局重置 */
button {
  font-family: inherit;
  font-size: inherit;
  line-height: inherit;
  cursor: pointer;
  border: none;
  background: none;
  padding: 0;
  margin: 0;
}

/* 列表优化 */
ul, ol {
  padding-left: $spacing-lg;
}

li {
  margin-bottom: $spacing-xs;
}

/* 分割线优化 */
hr {
  border: none;
  height: 1px;
  background-color: var(--border-color);
  margin: $spacing-xl 0;
}

/* 引用块优化 */
blockquote {
  margin: $spacing-lg 0;
  padding: $spacing-md $spacing-lg;
  border-left: 4px solid var(--primary-color);
  background-color: var(--surface-color);
  border-radius: 0 $border-radius-md $border-radius-md 0;
  font-style: italic;
  color: var(--text-color-secondary);
}
</style>