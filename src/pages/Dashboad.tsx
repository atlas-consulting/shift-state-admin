import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { Jumbotron } from 'reactstrap'
import { Maybe } from 'true-myth'
import { selectToken } from '../state/modules/auth'
import { fetchEmailClients, selectEmailClientsList, selectHasEmailClients } from '../state/modules/email-clients'
import * as Layouts from './layouts'

const Dashboard = () => {
    const dispatch = useDispatch()
    const token = useSelector(selectToken)
    const hasClients = useSelector(selectHasEmailClients)
    const emailClientsList = useSelector(selectEmailClientsList)
    useEffect(() => {
        Maybe.fromNullable(token).match({
            Just: (token) => dispatch(fetchEmailClients(token)),
            Nothing: () => console.log('damn')
        })
    }, [token, dispatch])
    return <Layouts.DashboardLayout>
        <Jumbotron>
            <h1 className="display-1">Welcome</h1>
            <p className="lead text-black-50">Configure/Manage Email Clients here</p>
        </Jumbotron>
        <section className="p-4">
            <header>
                <h2>{hasClients ? `Viewing ${emailClientsList.length} Clients` : "No Email Clients configured"}</h2>
            </header>
            <main>
                <Link className="btn btn-primary" to="new-client">Create New Client</Link>
                <ul>{emailClientsList.map((client) => <li key={client.id}>
                    <article>
                        <h4>{client.alias}</h4>
                    </article>
                </li>)}</ul>
            </main>
        </section>
    </Layouts.DashboardLayout>
}

export default Dashboard