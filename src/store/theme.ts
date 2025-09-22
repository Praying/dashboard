import { reactive, readonly } from 'vue';

type Theme = 'light' | 'dark';

interface ThemeState {
  theme: Theme;
}

const state = reactive<ThemeState>({
  theme: 'light',
});

function setTheme(theme: Theme) {
  console.log('setTheme called with:', theme);
  state.theme = theme;
  document.documentElement.setAttribute('data-theme', theme);
  console.log('data-theme attribute set to:', document.documentElement.getAttribute('data-theme'));
  localStorage.setItem('theme', theme);

  if (theme === 'dark') {
    document.documentElement.classList.add('dark');
    console.log('dark class added to html element');
  } else {
    document.documentElement.classList.remove('dark');
    console.log('dark class removed from html element');
  }
  console.log('html element classes:', document.documentElement.classList);
}

function toggleTheme() {
  const newTheme = state.theme === 'light' ? 'dark' : 'light';
  setTheme(newTheme);
}

function loadTheme() {
  const savedTheme = localStorage.getItem('theme') as Theme | null;
  if (savedTheme) {
    setTheme(savedTheme);
  } else {
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    setTheme(prefersDark ? 'dark' : 'light');
  }
}

export function useTheme() {
  return {
    theme: readonly(state),
    setTheme,
    toggleTheme,
    loadTheme,
  };
}