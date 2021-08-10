import React, { useState, useRef } from 'react'

import { Link, useHistory } from 'react-router-dom'

import { useAuth } from '../../contexts/AuthContext'

import CenteredContainer from './CenteredContainer'

import { Form, Card, Button } from 'react-bootstrap'

export default function Login() {
    const emailRef = useRef()
    const passwordRef = useRef()

    const [error, setError] = useState('')

    const { login } = useAuth()

    const history = useHistory()

    async function handleSubmit(e) {
        e.preventDefault()

        try {
            setError('')
            await login(emailRef.current.value, passwordRef.current.value)
            history.push('/')
        } catch {
            setError('Failed to log in')
        }
    }

    return (
        <CenteredContainer>
            <Card>
                <Card.Body>
                    <h2 className="text-center mb-4">Log in</h2>

                    <Form onSubmit={handleSubmit}>
                        <Form.Group>
                            <Form.Label>Email</Form.Label>
                            <Form.Control type="email" ref={emailRef} required/>
                        </Form.Group>

                        <Form.Group>
                            <Form.Label>Password</Form.Label>
                            <Form.Control type="password" ref={passwordRef} required/>
                        </Form.Group>

                        <Button className="w-100 mt-4" type="submit">
                            Log in
                        </Button>
                    </Form>

                    <div className="w-100 text-center mt-2">
                        Need an account? <Link to="/signup">Sign Up</Link>
                    </div>
                </Card.Body>
            </Card>
        </CenteredContainer>
    )
}
