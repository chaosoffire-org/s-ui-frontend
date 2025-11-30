/**
 * plugins/vuetify.ts
 *
 * Framework documentation: https://vuetifyjs.com`
 */

// Styles
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles/main.css'

import colors from 'vuetify/util/colors'
import { fa, en, vi, zhHans, zhHant, ru } from 'vuetify/locale'

// Composables
import { createVuetify } from 'vuetify'

// https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
import { md3 } from 'vuetify/blueprints'

export default createVuetify({
  blueprint: md3,
  defaults: {
    global: {
      ripple: false,
    },
    VRow: { dense: true }, // Apply dense to v-row as default
    VCard: {
      variant: 'elevated',
      elevation: 2,
    },
    VBtn: {
      variant: 'elevated',
      height: 44,
    },
    VTextField: {
      variant: 'outlined',
      density: 'comfortable', // Relaxed density for better aesthetics
      color: 'primary',
    },
    VSelect: {
      variant: 'outlined',
      density: 'comfortable',
      color: 'primary',
    },
    VCombobox: {
      variant: 'outlined',
      density: 'comfortable',
      color: 'primary',
    },
    VSwitch: {
      color: 'primary',
      inset: true,
    },
  },
  theme: {
    defaultTheme: localStorage.getItem('theme') ?? 'system',
    themes: {
      light: {
        dark: false,
        colors: {
          primary: '#3F51B5', // Indigo
          secondary: '#03DAC6', // Teal
          surface: '#FFFFFF',
          background: '#F5F5F5',
          error: '#B00020',
          info: '#2196F3',
          success: '#4CAF50',
          warning: '#FB8C00',
        },
      },
      dark: {
        dark: true,
        colors: {
          primary: '#7986CB', // Lighter Indigo
          secondary: '#03DAC6',
          surface: '#1E1E1E',
          background: '#121212',
          error: '#CF6679',
          info: '#2196F3',
          success: '#4CAF50',
          warning: '#FB8C00',
        },
      },
    },
  },
  locale: {
    locale: localStorage.getItem("locale") ?? 'en',
    fallback: 'en',
    messages: { en, fa, vi, zhHans, zhHant, ru },
  },
})
