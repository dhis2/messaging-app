import 'whatwg-fetch'
import System from 'd2/lib/system/System'

const fetchInit = {
    method: 'GET',
    credentials: 'include',
}

export default async function getDhis2CoreVersion(baseUrl) {
    return fetch(`${baseUrl}/api/system/info`, fetchInit)
        .then(response => response.json())
        .then(info => System.parseVersionString(info.version))
        .catch(error => console.error)
}
