import React from 'react'
import { Link } from 'react-router-dom'
import { Jumbotron, Breadcrumb, BreadcrumbItem } from 'reactstrap'
import * as Layouts from './layouts'

const CreateClient = () => <Layouts.DashboardLayout>
    <Jumbotron>
        <h1 className="display-1">Create a New Client</h1>
        <section>
            <Breadcrumb>
                <BreadcrumbItem><Link to="/">Home</Link></BreadcrumbItem>
                <BreadcrumbItem>New Client</BreadcrumbItem>
            </Breadcrumb>
        </section>
    </Jumbotron>
</Layouts.DashboardLayout>

export default CreateClient