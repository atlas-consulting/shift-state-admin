import React from 'react'
import { Jumbotron } from 'reactstrap'
import * as Layout from './layouts'

const ViewClient = () => <Layout.DashboardLayout>
    <Jumbotron>
        <h1 className="display-1">View Client</h1>
    </Jumbotron>
</Layout.DashboardLayout>

export default ViewClient