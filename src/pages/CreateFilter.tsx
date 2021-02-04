import * as Layout from './layouts'
import * as Yup from 'yup'
import { FormGroup, Label, Input, Button } from 'reactstrap'
import { useHistory } from 'react-router-dom'
import { Formik, Form } from 'formik'
import { useSelector } from 'react-redux'
import { selectToken } from '../state/modules/auth'
import { selectAccountDetails } from '../state/modules/auth/selectors'


interface FilterConfiguration {
    description: string;
    from: string;
    to: string;
    subject: string;
    forward: string;
}

const initialFilterConfig = {
    description: "", from: "", to: "", subject: "", forward: ""
}

const FILTER_CONFIG = Yup.object({
    description: Yup.string().required(),
    from: Yup.string().email().required(),
    to: Yup.string().email().required(),
    subject: Yup.string().required(),
    forward: Yup.string().email().required()
})

const submitNewFilter = ({ description, ...rest }: FilterConfiguration, token: string, accountId: number, callback: CallableFunction) => {
    fetch('/api/filters', {
        method: 'POST',
        body: JSON.stringify({
            description: description,
            accountId,
            filterConfiguration: {
                ...rest
            }
        }),
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    }).then(res => res.json())
        .then((response) => {
            console.log(response);
            callback()
        })
        .catch(console.error)
}

const NewFilter = () => {
    const token = useSelector(selectToken)
    const { id: accountId } = useSelector(selectAccountDetails)
    const history = useHistory()
    return <Layout.DashboardLayout isSubPage header='Create a New Filter' subPageDescr="Create a New Filter">
        <main className="p-4">
            <Formik validationSchema={FILTER_CONFIG} initialValues={initialFilterConfig} onSubmit={((item, { setSubmitting }) => {
                setSubmitting(false)
                submitNewFilter(item, token!, accountId, () => {
                    history.push("/filters")
                })
            })}>{({ handleChange, isValid }) => {
                return <Form>
                    <FormGroup>
                        <Label for="description">Description</Label>
                        <Input type="text" name="description" placeholder="Something to remember me by." onChange={handleChange} />
                    </FormGroup>
                    <FormGroup>
                        <Label for="from">From</Label>
                        <Input type="email" name="from" onChange={handleChange} />
                    </FormGroup>
                    <FormGroup>
                        <Label for="to">To</Label>
                        <Input type="email" name="to" onChange={handleChange} />
                    </FormGroup>
                    <FormGroup>
                        <Label for="subject">Subject</Label>
                        <Input type="text" name="subject" onChange={handleChange} />
                    </FormGroup>
                    <FormGroup>
                        <Label for="forward">Forward</Label>
                        <Input type="email" name="forward" onChange={handleChange} />
                    </FormGroup>
                    <Button type="submit" disabled={!isValid}>Submit</Button>
                </Form>
            }}</Formik>
        </main>

    </Layout.DashboardLayout>
}

export default NewFilter