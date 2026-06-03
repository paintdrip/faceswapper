import { useLanguage } from './LanguageContext'
import { translations, type Translations } from './translations'

export function useTranslation() {
  const { lang } = useLanguage()
  const t: Translations = translations[lang]
  return { t, lang }
}
