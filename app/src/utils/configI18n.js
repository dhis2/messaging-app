import { config } from 'd2/lib/d2';
import i18n from '../locales';

const configI18n = userSettings => {
    const uiLocale = userSettings.keyUiLocale;

    if (uiLocale && uiLocale !== 'en') {
        config.i18n.sources.add(`./i18n/i18n_module_${uiLocale}.properties`);
    }

    config.i18n.sources.add('./i18n/i18n_module_en.properties');
    i18n.changeLanguage(uiLocale);
};

export default configI18n;
