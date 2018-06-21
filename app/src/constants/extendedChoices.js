import i18n from 'd2-i18n';

const extendedChoices = {
    STATUS: [
        { key: 'NONE', value: 'NONE', primaryText: i18n.t('No status') },
        { key: 'OPEN', value: 'OPEN', primaryText: i18n.t('Open') },
        { key: 'PENDING', value: 'PENDING', primaryText: i18n.t('Pending') },
        { key: 'INVALID', value: 'INVALID', primaryText: i18n.t('Invalid') },
        { key: 'SOLVED', value: 'SOLVED', primaryText: i18n.t('Solved') },
    ],
    PRIORITY: [
        { key: 'NONE', value: 'NONE', primaryText: i18n.t('No priority') },
        { key: 'HIGH', value: 'HIGH', primaryText: i18n.t('High') },
        { key: 'MEDIUM', value: 'MEDIUM', primaryText: i18n.t('Medium') },
        { key: 'LOW', value: 'LOW', primaryText: i18n.t('Low') },
    ],
};

export default extendedChoices;
