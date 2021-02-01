import React from 'react'
import * as Yup from 'yup'
import { Link, useHistory } from 'react-router-dom'
import { Formik, Form } from 'formik'
import { Jumbotron, Breadcrumb, BreadcrumbItem, FormGroup, Label, Input, Button } from 'reactstrap'
import * as Layouts from './layouts'
import { useSelector } from 'react-redux'
import { selectAccountDetails, selectToken } from '../state/modules/auth/selectors'

const NEW_EMAIL_CLIENT = Yup.object({
    alias: Yup.string().required(),
    emailClientTypeId: Yup.number().required()
})

const newEmailClientInitialValues = {
    alias: '',
    emailClientTypeId: 1
}

const CreateClient = () => {
    const token = useSelector(selectToken)
    const history = useHistory()
    const { id: accountId } = useSelector(selectAccountDetails)
    const submitNewClient = (emailClient: typeof newEmailClientInitialValues) => {
        return fetch("/api/email-clients", {
            method: 'POST',
            body: JSON.stringify({
                accountId,
                ...emailClient
            }),
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        }).then(res => res.json())
    }
    return <Layouts.DashboardLayout>
        <Jumbotron>
            <h1 className="display-1">Create a New Client</h1>
            <section>
                <Breadcrumb>
                    <BreadcrumbItem><Link to="/">Home</Link></BreadcrumbItem>
                    <BreadcrumbItem>New Client</BreadcrumbItem>
                </Breadcrumb>
            </section>
        </Jumbotron>
        <main className="p-4">
            <Formik validationSchema={NEW_EMAIL_CLIENT} initialValues={newEmailClientInitialValues} onSubmit={(newClient, { setSubmitting }) => {
                setSubmitting(false)
                submitNewClient(newClient).then(() => {
                    history.push("/")
                })
            }}>
                {({ isValid, values: { emailClientTypeId, alias }, touched, handleChange }) =>
                    <Form>
                        <FormGroup>
                            <Label for="alias">An Alias for your new email Client</Label>
                            <Input type="text" name="alias" placeholder="My New Email Client" onChange={handleChange} />
                        </FormGroup>
                        <FormGroup>
                            <Label>Select Email Provider</Label>
                            <Input type="select" name="emailClientTypeId" onChange={handleChange}>
                                <option value={1}>Gmail</option>
                                <option value={2}>Office365</option>
                            </Input>
                        </FormGroup>
                        <Button type="submit" disabled={!isValid}>Submit</Button>
                    </Form>
                }
            </Formik>
        </main>
    </Layouts.DashboardLayout>
}

export default CreateClient