import { useSelector } from 'react-redux'
import { selectToken, selectAccountDetails } from '../state/modules/auth/selectors'

export function useAuth() {
    const token = useSelector(selectToken)
    const account = useSelector(selectAccountDetails)
    return {
        token, account
    }
}