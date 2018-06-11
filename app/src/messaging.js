import React from 'react';
import { render } from 'react-dom';
import { getManifest } from 'd2/lib/d2';

import Messaging from 'components/Messaging';
import { BASE_URL, SYSTEM_AUTH } from 'constants/development';

const dhisVersion = 29;
const schemas = ['messageConversation'];

getManifest('./manifest.webapp')
    .then(manifest => manifest.getBaseUrl())
    .catch(() => BASE_URL)
    .then(url => {
        //const baseUrl = `${url}/api/${dhisVersion}`;
        const baseUrl = 'https://play.dhis2.org/dev/api/29';
        const production = process.env.NODE_ENV === 'production';
        const config = {
            baseUrl,
            headers: production ? null : null,
            schemas,
        };

        render(<Messaging config={config} />, document.getElementById('messaging'));
    });
