import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { Jumbotron } from 'reactstrap'
import { Maybe } from 'true-myth'
import { EmailClientCard } from '../components'
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
                <h2>{hasClients ? `Viewing ${emailClientsList.length} Email Clients` : "No Email Clients configured"}</h2>
            </header>
            <main>
                <Link className="btn btn-primary my-2" to="new-client">Create New Client</Link>
                <EmailClientCard.List>{emailClientsList.map((client) => <EmailClientCard.Card key={client.id} emailClient={client} />)}</EmailClientCard.List>
            </main>
        </section>
    </Layouts.DashboardLayout>
}

export default Dashboard