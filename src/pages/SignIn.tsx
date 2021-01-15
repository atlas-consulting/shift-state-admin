import React from 'react'
import { Link } from 'react-router-dom'
import { Input, Label, FormGroup, Form, Button } from 'reactstrap'
import * as Layouts from './layouts'
const SignIn = () => <Layouts.FullScreenLayout>
    <Form className="bg-light p-4 rounded-lg">
        <h2>Sign In</h2>
        <p className="lead text-black-50">Welcome to ShiftState, sign-in here!</p>
        <FormGroup>
            <Label>Email Address</Label>
            <Input type="email" className="w-100" />
        </FormGroup>
        <FormGroup>
            <Label>Password</Label>
            <Input type="password" className="w-100" />
        </FormGroup>
        <FormGroup>
            <Button className="btn-block mb-3">Sign In</Button>
        </FormGroup>
        <FormGroup>
            <Link className="d-block text-center" to="/sign-up">Sign Up</Link>
        </FormGroup>
    </Form>
</Layouts.FullScreenLayout>

export default SignIn