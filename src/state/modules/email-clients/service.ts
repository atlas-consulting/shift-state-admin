import { EmailClient, EmailClientEndpoints, NewEmailClient } from './types'
type Fetch = typeof fetch


/**
 * 
 * @param fetch 
 * @param token 
 */
export const createEmailClientService = (fetch: Fetch, token: string) => {
    const FETCH_PARAMS: RequestInit = {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    }
    function fetchAll(): Promise<EmailClient[]> {
        return fetch(EmailClientEndpoints.EMAIL_CLIENTS, FETCH_PARAMS).then(res => res.json())
    }
    function fetchOne(emailClientId: number): Promise<EmailClient[]> {
        return fetch(EmailClientEndpoints.EMAIL_CLIENTS, FETCH_PARAMS).then(res => res.json())
    }
    async function create(emailClient: NewEmailClient, accountId: number) {
        try {
            const response = await fetch(EmailClientEndpoints.EMAIL_CLIENTS, {
                ...FETCH_PARAMS, method: 'POST', body: JSON.stringify({
                    ...emailClient,
                    accountId
                })
            })
            return await response.json()
        } catch (error) {
            console.error(error)
        }
    }
    function remove(emailClientId: number) {
        return fetch(`${EmailClientEndpoints.EMAIL_CLIENTS}/${emailClientId}`,
            { ...FETCH_PARAMS, method: 'DELETE' }).then(res => res.json())
    }
    function update(emailClientId: number, emailClient: EmailClient) {
        return fetch(`${EmailClientEndpoints.EMAIL_CLIENTS}/${emailClientId}`,
            { ...FETCH_PARAMS, method: 'PUT', body: JSON.stringify(emailClient) })
            .then(res => res.json())
    }
    return {
        fetchOne,
        fetchAll,
        create,
        remove,
        update
    }
}