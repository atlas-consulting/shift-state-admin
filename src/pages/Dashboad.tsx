import React from 'react'
import { Jumbotron } from 'reactstrap'
import * as Layouts from './layouts'

const Dashboard = () => <Layouts.DashboardLayout>
    <Jumbotron>
        <h2 className="display-1">Hello User</h2>
        <p className="lead text-black-50">Configure/Manage Clients here</p>
    </Jumbotron>
</Layouts.DashboardLayout>

export default Dashboard