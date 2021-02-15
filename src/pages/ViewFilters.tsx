import { Maybe } from 'true-myth'
import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Button, Spinner, Table } from 'reactstrap'
import { DashboardLayout } from './layouts'
import { useAuth } from '../hooks'
import { actions, selectors } from '../state/modules/filters'
import { FilterDefinition, formatFilterConfiguration } from '../utilities'
const ViewFilters = () => {
    const els = useRef<Record<string, HTMLTableRowElement>>({})
    const { token } = useAuth()
    const dispatch = useDispatch()
    const filtersList = useSelector(selectors.selectFiltersList)
    const hasFilters = useSelector(selectors.selectHastFilters)
    const handleDeleteFilter = (filterId: any) => {
        fetch(`/api/filters/${filterId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token!}`
            }
        })
            .then(() => {
                els.current[`${filterId}`].remove()
            })
            .catch(console.error)
    }
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
                        return <tr key={`filter-${f.id}`} ref={(ele) => els.current[`${f.id}`] = ele!}>
                            <th scope="row">{i + 1}</th>
                            <td>{f.id}</td>
                            <td>{f.description}</td>
                            <td>{formatFilterConfiguration(f.filterConfiguration as unknown as FilterDefinition)}</td>
                            <td>{f.createdAt}</td>
                            <td><Button onClick={() => handleDeleteFilter(f.id)}>Delete</Button></td>
                        </tr>
                    })}
                </tbody>
            </Table> : <Spinner color="primary" />}
        </main>
    </DashboardLayout>
}

export default ViewFilters