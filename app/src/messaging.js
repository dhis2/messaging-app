import React from 'react';
import { render } from 'react-dom';

import Messaging from 'components/Messaging';
import { BASE_URL } from 'constants/development';

import { init, getManifest, getUserSettings } from 'd2/lib/d2';
import 'whatwg-fetch';

import configI18n from './utils/configI18n';

const dhisVersion = 29;
const schemas = ['messageConversation'];

let dhisConfig;
let d2Instance;

getManifest('./manifest.webapp')
    // Fetch API url from manifest file.
    .then(manifest => manifest.getBaseUrl())

    // Use default configuration if not found (development).
    .catch(() => BASE_URL)

    // Initialize d2 with url, authorization and schema settings.
    .then(url => {
        const PRODUCTION = process.env.NODE_ENV === 'production';

        dhisConfig = {
            baseUrl: `${url}/api/${dhisVersion}`,
            headers: PRODUCTION ? null : null,
            schemas,
        };

        return init(dhisConfig);
    })
    .then(d2 => {
        d2Instance = d2;
    })

    // Get user settings from d2, namely the UI language.
    .then(getUserSettings)

    // Configure i18n with the user settings.
    .then(configI18n)

    // Render the Messaging root component.
    .then(() => {
        render(<Messaging d2={d2Instance} />, document.getElementById('messaging'));
    });
