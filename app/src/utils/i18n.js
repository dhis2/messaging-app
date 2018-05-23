import i18next from 'i18next';

const initializeI18n = d2 => {
    i18next.init({}, () => {
        d2.currentUser.userSettings.get('keyUiLocale').then(uiLocale => {
            if (uiLocale && uiLocale !== 'en') {
                i18next.changeLanguage(uiLocale);
            }
        });
    });
};

export default initializeI18n;
