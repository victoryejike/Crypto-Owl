import { createI18n, LocaleMessages, VueMessageType } from 'vue-i18n';

const loadLocaleMessages: () => LocaleMessages<VueMessageType> = () => {
  const locales = require.context('@/assets/locales', true, /[A-Za-z0-9-_,\s]+\.json$/i);
  const messages: LocaleMessages<VueMessageType> = {};
  locales.keys().forEach((key) => {
    const matched = key.match(/([A-Za-z0-9-_]+)\./i);
    if (matched && matched.length > 1) {
      const locale = matched[1];
      messages[locale] = locales(key);
    }
  });
  return messages;
};

export default createI18n({
  fallbackLocale: localStorage.getItem('lang') || 'en',
  globalInjection: true,
  legacy: false,
  locale: localStorage.getItem('lang') || 'en',
  messages: loadLocaleMessages(),
});
