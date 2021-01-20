import React from 'react'
import { Link } from 'react-router-dom'
import { Jumbotron } from 'reactstrap'
import * as Layouts from './layouts'

const Dashboard = () => {

    return <Layouts.DashboardLayout>
        <Jumbotron>
            <h1 className="display-1">Welcome</h1>
            <p className="lead text-black-50">Configure/Manage Email Clients here</p>
        </Jumbotron>
        <section className="p-4">
            <header>
                <h2>{([]).length ? `Viewing ${([]).length} Clients` : "No Email Clients configured"}</h2>
            </header>
            <main>
                <Link className="btn btn-primary" to="new-client">Create New Client</Link>
            </main>
        </section>
    </Layouts.DashboardLayout>
}

export default Dashboard