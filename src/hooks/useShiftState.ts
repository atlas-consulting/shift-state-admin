import { useAuth } from './useAuth'
import { createShiftState } from '../state/modules/service'
import { Maybe } from 'true-myth'

export function useShiftState() {
    const { token } = useAuth()
    const shiftState = createShiftState(fetch, Maybe.fromNullable(token).unwrapOrElse(() => {
        throw new Error('Unauthorized use of ShiftState!')
    }))
    return shiftState
}