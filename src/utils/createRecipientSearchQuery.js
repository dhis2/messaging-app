import { supportsUserLookupEndPoint } from './helpers.js'

const MAX_RECIPIENT = 10

function createUserQuery({
    searchValue,
    searchOnlyFeedbackRecipients,
    feedbackRecipientsId,
    dhis2CoreVersion,
}) {
    if (supportsUserLookupEndPoint(dhis2CoreVersion)) {
        // version >= v2.35
        return {
            resource: searchOnlyFeedbackRecipients
                ? 'userLookup/feedbackRecipients'
                : 'userLookup',
            params: {
                query: searchValue,
            },
        }
    } else {
        // version < 2.35
        const filter = [`displayName:token:${searchValue}`]
        if (searchOnlyFeedbackRecipients) {
            filter.push(`userGroups.id:eq:${feedbackRecipientsId}`)
        }

        return {
            resouce: 'users',
            params: {
                filter,
                pageSize: MAX_RECIPIENT,
            },
        }
    }
}

function createOrganisationUnitQuery(searchValue) {
    return {
        resource: 'organisationUnits',
        params: {
            fields: ['id', 'displayName'],
            pageSize: MAX_RECIPIENT,
            filter: [`displayName:token:${searchValue}`, 'users:gte:1'],
        },
    }
}

function createUserGroupQuery(searchValue) {
    return {
        resource: 'userGroups',
        params: {
            fields: 'id, displayName',
            pageSize: MAX_RECIPIENT,
            filter: [`displayName:token:${searchValue}`],
        },
    }
}

export default function createRecipientSearchQuery({
    searchValue,
    searchOnlyUsers,
    searchOnlyFeedbackRecipients,
    feedbackRecipientsId,
    dhis2CoreVersion,
}) {
    const userQuery = createUserQuery({
        searchValue,
        searchOnlyFeedbackRecipients,
        feedbackRecipientsId,
        dhis2CoreVersion,
    })

    return searchOnlyUsers
        ? {
              users: userQuery,
          }
        : {
              users: userQuery,
              organisationUnits: createOrganisationUnitQuery(searchValue),
              userGroups: createUserGroupQuery(searchValue),
          }
}
