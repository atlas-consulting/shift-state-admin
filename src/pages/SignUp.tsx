import React from 'react'
import { Link } from 'react-router-dom'
import { Form, Input, FormGroup, Label, Button } from 'reactstrap'
import * as Layouts from './layouts'
const SignUp = () => <Layouts.FullScreenLayout>
    <Form className="bg-light p-4 rounded-lg">
        <h2>Sign Up</h2>
        <p className="lead text-black-50">Please fillout the provided form to sign-up!</p>
        <FormGroup>
            <Label>Email Address</Label>
            <Input type="email" />
        </FormGroup>
        <FormGroup>
            <Label>Password</Label>
            <Input type="password" />
        </FormGroup>
        <FormGroup>
            <Button className="btn-block">Complete Sign Up</Button>
        </FormGroup>
        <FormGroup>
            <Link to="/sign-in" className="d-block text-center">Sign In</Link>
        </FormGroup>
    </Form>
</Layouts.FullScreenLayout>

export default SignUp