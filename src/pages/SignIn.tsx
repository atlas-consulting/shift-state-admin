import * as Yup from 'yup'
import { Formik, Form } from 'formik'
import { useState } from 'react'
import { Maybe } from 'true-myth'
import { match } from 'ts-pattern'
import { useDispatch } from 'react-redux'
import { Link, useHistory } from 'react-router-dom'
import { Label, FormGroup, Button, Input, FormFeedback, Alert } from 'reactstrap'
import * as Layouts from './layouts'
import { receiveToken } from '../state/modules/auth'
import shiftStateLogo from '../assets/images/shiftstate-logo.png'
import ShiftState from '../state/modules/service'
import { AuthServiceResponse, AuthServiceResponseTypes } from '../state/modules/auth/types'


const signInSchema = Yup.object().shape({
    emailAddress: Yup.string().email().required(),
    password: Yup.string().test('len', 'Must be longer than 5 characters', val => (val === undefined) ? false : val?.length > 5).required()
})

const SignIn = () => {
    const history = useHistory()
    const dispatch = useDispatch()
    const [signInErrorMessage, setSignInErrorMessage] = useState<string | null>(null)
    return <Layouts.FullScreenLayout>
        <div>
            <img src={shiftStateLogo} style={{ width: 200, margin: '0 auto 1em', }} alt="Shift State Logo" className="d-block text-center" />
            <Formik
                validationSchema={signInSchema}
                onSubmit={async (credentials, { setSubmitting }) => {
                    setSubmitting(false)
                    const res = await ShiftState.auth.signIn(credentials)
                    match<AuthServiceResponse>(res)
                        .with({ type: AuthServiceResponseTypes.SIGN_IN_SUCCESSFUL }, (res) => {
                            dispatch(receiveToken(res.token))
                            history.push("/")
                        })
                        .with({ type: AuthServiceResponseTypes.SIGN_IN_FAILED }, (res) => {
                            setSignInErrorMessage(res.message)
                        })
                        .otherwise(() => {
                            console.log('Unexpected Error')
                        })

                }}
                initialValues={{ emailAddress: '', password: '' }}
            >
                {({ handleSubmit, isSubmitting, handleBlur, values, touched, handleChange, errors }) =>
                    <Form className="bg-light p-4 rounded-lg" onSubmit={handleSubmit}>
                        <h2>Sign In</h2>
                        <p className="lead text-black-50">Welcome to ShiftState, sign-in here!</p>
                        {Maybe.fromNullable(signInErrorMessage).match({
                            Just: (errorMessage) => <Alert color="danger">{errorMessage}</Alert>,
                            Nothing: () => null
                        })}
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
                            <Button className="btn-block mb-3" type="submit" disabled={isSubmitting}>Sign In</Button>
                        </FormGroup>
                        <FormGroup>
                            <Link className="d-block text-center" to="/sign-up">Sign Up</Link>
                        </FormGroup>
                    </Form>}
            </Formik>
        </div>
    </Layouts.FullScreenLayout>
}

export default SignIn