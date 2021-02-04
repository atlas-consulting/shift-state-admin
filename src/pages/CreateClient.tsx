import React from 'react'
import { Formik, Form } from 'formik'
import { useHistory } from 'react-router-dom'
import { FormGroup, Label, Input, Button } from 'reactstrap'
import * as Layouts from './layouts'
import { useAuth, useShiftState } from '../hooks'
import { schema as emailClients } from '../state/modules/email-clients'

const newEmailClientInitialValues = {
    alias: '',
    emailClientTypeId: 1
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