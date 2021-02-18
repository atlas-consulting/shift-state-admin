import React from 'react'
import { Formik, Form } from 'formik'
import { useHistory } from 'react-router-dom'
import { FormGroup, Label, Input, Button } from 'reactstrap'
import * as Layouts from './layouts'
import { useAuth, useShiftState } from '../hooks'
import { schema as emailClients } from '../state/modules/email-clients'

const newEmailClientInitialValues = {
    alias: '',
    emailClientTypeId: 1,
    customerId: "",
    clientId: "",
    clientEmail: "",
    clientSecret: "",
    domain: ""
}
const CreateClient = () => {
    const history = useHistory()
    const { account: { id: accountId } } = useAuth()
    const shiftState = useShiftState()
    return <Layouts.DashboardLayout header="Create a New Client" isSubPage subPageDescr="Create a New Client">
        <main className="p-4">
            <Formik validationSchema={emailClients.NEW_EMAIL_CLIENT} initialValues={newEmailClientInitialValues} onSubmit={(newClient, { setSubmitting }) => {
                setSubmitting(false)
                shiftState.client.create(newClient, accountId).then((response) => {
                    history.push('/')
                })
            }}>
                {({ isValid, values: { emailClientTypeId, alias, clientEmail, clientId, clientSecret }, touched, handleChange }) =>
                    <Form>
                        <FormGroup>
                            <Label for="alias">An Alias for your new email Client</Label>
                            <Input type="text" name="alias" placeholder="My New Email Client" onChange={handleChange} />
                        </FormGroup>
                        <FormGroup>
                            <Label for="clientId">Client Id</Label>
                            <Input type="text" name="clientId" placeholder="Your Client Id" onChange={handleChange} />
                        </FormGroup>
                        {emailClientTypeId === 1 && <FormGroup>
                            <Label for="clientEmail">Client Email</Label>
                            <Input type="text" name="clientEmail" placeholder="Client Email Particularly relevant for GmailClients" onChange={handleChange} />
                        </FormGroup>}
                        {emailClientTypeId === 1 && <FormGroup>
                            <Label for="customerId">Customer Id</Label>
                            <Input type="text" name="customerId" placeholder="The Id of the GSuite Account" onChange={handleChange} />
                        </FormGroup>}
                        <FormGroup>
                            <Label for="clientSecret">Client Secret</Label>
                            <Input type="text" name="clientSecret" placeholder="Client Secret or Private Key" onChange={handleChange} />
                        </FormGroup>
                        <FormGroup>
                            <Label for="domain">Domain</Label>
                            <Input type="text" name="domain" placeholder="Domain or Authority" onChange={handleChange} />
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