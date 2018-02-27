import React from 'react';
import { render } from 'react-dom';
import { getManifest } from 'd2/lib/d2';
import registerServiceWorker from './registerServiceWorker';
import 'whatwg-fetch';

import Messaging from 'components/Messaging';
import { BASE_URL, SYSTEM_AUTH } from 'constants/development';

const dhisVersion = 29;
const schemas = ['messageConversation'];

getManifest('./manifest.webapp')
    .then(manifest => manifest.getBaseUrl())
    .catch(() => BASE_URL)
    .then(url => {
        const baseUrl = `${url}/api/${dhisVersion}`;
        const production = process.env.NODE_ENV === 'production';
        const config = {
            baseUrl,
            headers: production ? null : SYSTEM_AUTH,
            schemas,
        };
        
        render(<Messaging config={config} />, document.getElementById('messaging'));
    })
    .then(registerServiceWorker);