import { Maybe } from 'true-myth'
import { useSelector } from 'react-redux'
import { Redirect } from 'react-router-dom';
import { RootState } from '../../state/rootReducer';

export const asProtectedRoute = (Component: React.FC): React.FC => {
    return (props) => {
        const { token } = useSelector((state: RootState) => state.auth);
        return Maybe.fromNullable(token).match({
            Just: () => {
                return <Component {...props} />
            },
            Nothing: () => {
                return <Redirect to="/sign-in" />
            }
        })
    }
};