import { createI18n } from 'vue-i18n'

// 👇 Cargamos los archivos como texto plano
import esRaw from './locales/es.json?raw'
import enRaw from './locales/en.json?raw'

// 👇 Parseamos a objetos JS
const messages = {
    es: JSON.parse(esRaw),
    en: JSON.parse(enRaw)
}

const i18n = createI18n({
    legacy: false, // Si usas Composition API
    locale: 'es',
    fallbackLocale: 'en',
    messages
})

export default i18n
