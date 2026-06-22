import { computed, reactive } from 'vue'

type ThemeMode = 'light' | 'dark'
type AppLanguage = 'en' | 'id'

const THEME_KEY = 'taskplanner_theme'
const LANGUAGE_KEY = 'taskplanner_language'

function readLanguage(): AppLanguage {
  const stored = localStorage.getItem(LANGUAGE_KEY)
  return stored === 'id' ? 'id' : 'en'
}

const state = reactive({
  theme: 'light' as ThemeMode,
  language: readLanguage() as AppLanguage,
  isProfileMenuOpen: false,
  isCommandPaletteOpen: false,
})

function applyTheme(theme: ThemeMode) {
  document.documentElement.dataset.theme = theme
  if (theme === 'dark') {
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
  }
  localStorage.setItem(THEME_KEY, theme)
}

function applyLanguage(language: AppLanguage) {
  document.documentElement.lang = language
  localStorage.setItem(LANGUAGE_KEY, language)
}

applyTheme(state.theme)
applyLanguage(state.language)

export const uiStore = {
  state,
  isDark: computed(() => state.theme === 'dark'),
  setTheme(theme: ThemeMode) {
    state.theme = theme
    applyTheme(theme)
  },
  toggleTheme() {
    this.setTheme(state.theme === 'dark' ? 'light' : 'dark')
  },
  setLanguage(language: AppLanguage) {
    state.language = language
    applyLanguage(language)
  },
  toggleLanguage() {
    this.setLanguage(state.language === 'en' ? 'id' : 'en')
  },
  openProfileMenu() {
    state.isProfileMenuOpen = true
  },
  closeProfileMenu() {
    state.isProfileMenuOpen = false
  },
  toggleProfileMenu() {
    state.isProfileMenuOpen = !state.isProfileMenuOpen
  },
  openCommandPalette() {
    state.isCommandPaletteOpen = true
  },
  closeCommandPalette() {
    state.isCommandPaletteOpen = false
  },
  toggleCommandPalette() {
    state.isCommandPaletteOpen = !state.isCommandPaletteOpen
  },
}

export type { AppLanguage, ThemeMode }
