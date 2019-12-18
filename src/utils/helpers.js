export function dedupeById(list) {
    if (!Array.isArray(list)) {
        return undefined
    }
    const lookup = new Set()
    return list.filter(item => {
        if (lookup.has(item.id)) {
            return false
        }

        lookup.add(item.id)
        return true
    })
}

export function findIndexOfId(list, id) {
    const len = list.length
    for (let index = 0; index < len; index++) {
        if (list[index].id === id) {
            return index
        }
    }
    return undefined
}

export function debounce(fn, delay) {
    let timer = null
    return function() {
        const context = this
        const args = arguments
        clearTimeout(timer)
        timer = setTimeout(function() {
            fn.apply(context, args)
        }, delay)
    }
}

export function supportsAttachments(dhis2CoreVersion) {
    return dhis2CoreVersion > 30
}

export function supportsUnversionedApiCalls(dhis2CoreVersion) {
    return dhis2CoreVersion > 31
}
