import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useParams, } from 'react-router-dom'
import { Spinner, Badge, Table } from 'reactstrap'
import * as Layout from './layouts'
import { AuthLink } from '../components'
import { selectToken } from '../state/modules/auth'
import { selectEmailClientById } from '../state/modules/email-clients/selectors'
import { EmailClient } from '../state/modules/email-clients/types'
interface ViewClientParams {
    clientId: string
}
const ViewClient = () => {
    const { clientId } = useParams<ViewClientParams>()
    const [emailClientDetails, setEmailClient] = useState<EmailClient | undefined>(undefined)
    const token = useSelector(selectToken)
    const { accessToken } = useSelector(selectEmailClientById(parseInt(clientId)))
    const isVerified = !!accessToken
    useEffect(() => {
        fetch(`/api/email-clients/${clientId}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }).then(res => res.json()).then((response) => setEmailClient(response.data)).catch(console.error)
    }, [clientId, token])
    return <Layout.DashboardLayout header='View Client' isSubPage subPageDescr={`Viewing Client ${clientId}`}>
        {emailClientDetails ? <section style={{ padding: 20 }}>
            <div className="mb-4">{emailClientDetails.alias} - <Badge color="primary">{isVerified ? 'Verified' : 'Unverified'}</Badge></div>
            {isVerified ? '' : <AuthLink token={token!} emailClientId={emailClientDetails.id} clientType={emailClientDetails.type.description === "GMAIL" ? 'gmail' : 'office365'} />}
            <hr />
            <h2 className="display-4 my-4">Connected Filters</h2>
            <Table dark draggable>
                <thead>
                    <tr><td>#</td><td>Filter Id</td><td>Filter Description</td><td>Config</td><td>Created At</td></tr>
                </thead>
                <tbody>
                    {emailClientDetails.connectedFilters.map(({ filter: f }, i) => {
                        return <tr key={`filter-${f.id}`}>
                            <th scope="row">{i + 1}</th><td>{f.id}</td><td>{f.description}</td><td>{JSON.stringify(f.filterConfiguration)}</td><td>{f.createdAt}</td>
                        </tr>
                    })}
                </tbody>
            </Table>
        </section> : <Spinner color="primary" />}
    </Layout.DashboardLayout>
}

export default ViewClient