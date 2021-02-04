import { useEffect, useState } from 'react'
import { Spinner, Table } from 'reactstrap'
import { Link } from 'react-router-dom'
import { DashboardLayout } from './layouts'
import { useSelector } from 'react-redux'
import { selectToken } from '../state/modules/auth'
import { selectAccountDetails } from '../state/modules/auth/selectors'
import { Filter } from '../state/modules/filters/types'
const ViewFilters = () => {
    const token = useSelector(selectToken)
    const { id } = useSelector(selectAccountDetails)
    const [filters, setFilters] = useState<Filter[]>([])
    useEffect(() => {
        fetch('/api/filters/accounts/1', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }).then(res => res.json()).then(response =>
            setFilters(response.data)
        ).catch(console.error)
    }, [token, setFilters, id])
    return <DashboardLayout header='View All Filters' isSubPage subPageDescr="Viewing All Filters">
        <main className="p-4">
            <Link className="btn btn-primary my-2" to="new-filter">Create New Filter</Link>
            {Boolean(filters) ? <Table dark>
                <thead>
                    <tr><td>#</td><td>Filter Id</td><td>Filter Description</td><td>Config</td><td>Created At</td></tr>
                </thead>
                <tbody>
                    {filters.map((f, i) => {
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