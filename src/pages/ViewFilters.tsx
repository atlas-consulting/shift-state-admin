import { Maybe } from 'true-myth'
import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Spinner, Table } from 'reactstrap'
import { DashboardLayout } from './layouts'
import { useAuth } from '../hooks'
import { actions, selectors } from '../state/modules/filters'
const ViewFilters = () => {
    const { token } = useAuth()
    const dispatch = useDispatch()
    const filtersList = useSelector(selectors.selectFiltersList)
    const hasFilters = useSelector(selectors.selectHastFilters)
    useEffect(() => {
        Maybe.fromNullable(token).match({
            Just(token) {
                dispatch(actions.fetchFilters(token))
            },
            Nothing() {
                console.info("Failed to fetch, missing token")
            }
        })
    }, [dispatch, token])
    return <DashboardLayout header='View All Filters' isSubPage subPageDescr="Viewing All Filters">
        <main className="p-4">
            <Link className="btn btn-primary my-2" to="new-filter">Create New Filter</Link>
            {hasFilters ? <Table dark>
                <thead>
                    <tr><td>#</td><td>Filter Id</td><td>Filter Description</td><td>Config</td><td>Created At</td></tr>
                </thead>
                <tbody>
                    {filtersList.map((f, i) => {
                        return <tr key={`filter-${f.id}`}>
                            <th scope="row">{i + 1}</th><td>{f.id}</td><td>{f.description}</td><td>{JSON.stringify(f.filterConfiguration)}</td><td>{f.createdAt}</td>
                        </tr>
                    })}
                </tbody>
            </Table> : <Spinner color="primary" />}
        </main>
    </DashboardLayout>
}

export default ViewFilters