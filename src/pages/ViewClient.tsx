import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useHistory, useParams, } from 'react-router-dom'
import { Spinner, Badge, Table, Input } from 'reactstrap'
import * as Layout from './layouts'
import { AuthLink, AdminTable } from '../components'
import { selectToken } from '../state/modules/auth'
import { selectEmailClientById, selectEmailClientsConnectedFilters } from '../state/modules/email-clients/selectors'
import { EmailClient } from '../state/modules/email-clients/types'
import { selectFiltersList } from '../state/modules/filters/selectors'
import { formatFilterConfiguration, FilterDefinition } from '../utilities'
interface ViewClientParams {
    clientId: string
}
const ViewClient = () => {
    const history = useHistory()
    const { clientId } = useParams<ViewClientParams>()
    const [emailClientDetails, setEmailClient] = useState<EmailClient | undefined>(undefined)
    const filters = useSelector(selectFiltersList)
    const token = useSelector(selectToken)
    const { accessToken } = useSelector(selectEmailClientById(parseInt(clientId)))
    const isVerified = !!accessToken
    const filterIds = useSelector(selectEmailClientsConnectedFilters(parseFloat(clientId)))
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
            {isVerified ? <>
                <AdminTable data={filters.filter(f => !filterIds.includes(f.id))} filterProp='description' idProp='id' withSelected={(selected => {
                    fetch(`/api/email-clients/${clientId}/filters`, {
                        method: 'POST',
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            filterIds: selected
                        })
                    }).then(() => {
                        history.push("/")
                    }).catch(console.error)
                })}>
                    {/* @ts-ignore */}
                    {({ data, toggleDataElement }) => {
                        return <>
                            <thead>
                                <tr>
                                    <td>Selected</td>
                                    <td>Id</td>
                                    <td>Description</td>
                                    <td>Configuration</td>
                                </tr>
                            </thead>
                            <tbody>
                                {/* @ts-ignore */}
                                {data.map((d) => {
                                    return (
                                        <tr key={d.id} onClick={() => toggleDataElement(d.id)}>
                                            <td>
                                                <Input
                                                    className="mx-0"
                                                    type="checkbox"
                                                    checked={d.isSelected}
                                                    onChange={() => toggleDataElement(d.id)}
                                                />
                                            </td>
                                            <td>{d.id}</td>
                                            <td>{d.description}</td>
                                            <td>{formatFilterConfiguration(d.filterConfiguration)}</td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </>
                    }}
                </AdminTable>
            </> : <AuthLink token={token!} emailClientId={emailClientDetails.id} clientType={emailClientDetails.type.description === "GMAIL" ? 'gmail' : 'office365'} />}
            <hr />
            <h2 className="display-4 my-4">Connected Filters</h2>
            <Table dark draggable>
                <thead>
                    <tr><td>#</td><td>Filter Id</td><td>Filter Description</td><td>Config</td><td>Created At</td></tr>
                </thead>
                <tbody>
                    {emailClientDetails.connectedFilters.map(({ filter: f }, i) => {
                        return <tr key={`filter-${f.id}`}>
                            <th scope="row">{i + 1}</th><td>{f.id}</td><td>{f.description}</td><td>{formatFilterConfiguration(f.filterConfiguration as unknown as FilterDefinition)}</td><td>{f.createdAt}</td>
                        </tr>
                    })}
                </tbody>
            </Table>
        </section> : <Spinner color="primary" />}
    </Layout.DashboardLayout>
}

export default ViewClient