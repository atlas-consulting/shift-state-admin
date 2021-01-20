import React from 'react'
import { Link } from 'react-router-dom'
import { Formik, Form } from 'formik'
import * as Yup from 'yup'
import { Label, FormGroup, Button, Input, FormFeedback } from 'reactstrap'
import { AuthService } from '../services/auth'
import * as Layouts from './layouts'

const signInSchema = Yup.object().shape({
    emailAddress: Yup.string().email().required(),
    password: Yup.string().test('len', 'Must be longer than 5 characters', val => (val === undefined) ? false : val?.length > 5).required()
})


const SignIn = () => <Layouts.FullScreenLayout>
    <Formik
        validationSchema={signInSchema}
        onSubmit={async (credentials, { setSubmitting }) => {
            setSubmitting(false)
            try {
                const res = await AuthService.signIn(credentials)
                res.map(token => {
                    console.log(token)
                    return token
                })
            } catch (error) {
                console.error(error)
            }
        }}
        initialValues={{ emailAddress: '', password: '' }}
    >
        {({ handleSubmit, isSubmitting, handleBlur, values, touched, handleChange, errors }) =>
            <Form className="bg-light p-4 rounded-lg" onSubmit={handleSubmit}>
                <h2>Sign In</h2>
                <p className="lead text-black-50">Welcome to ShiftState, sign-in here!</p>
                <FormGroup>
                    <Label>Email Address</Label>
                    <Input type="email" name="emailAddress" className="w-100" value={values.emailAddress} onBlur={handleBlur} onChange={handleChange} valid={touched.emailAddress && !errors.emailAddress} invalid={touched.emailAddress && !!errors.emailAddress} />
                    <FormFeedback>Email appears to be invalid</FormFeedback>
                </FormGroup>
                <FormGroup>
                    <Label>Password</Label>
                    <Input type="password" name="password" className="w-100" value={values.password} onBlur={handleBlur} onChange={handleChange} valid={touched.password && !errors.password} invalid={touched.emailAddress && !!errors.emailAddress} />
                    <FormFeedback>{errors.password}</FormFeedback>
                </FormGroup>
                <FormGroup>
                    <Button className="btn-block mb-3" type="submit">Sign In</Button>
                </FormGroup>
                <FormGroup>
                    <Link className="d-block text-center" to="/sign-up">Sign Up</Link>
                </FormGroup>
            </Form>}
    </Formik>
</Layouts.FullScreenLayout>

export default SignIn