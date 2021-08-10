import React, { useState, useEffect, useRef } from 'react'

import CenteredContainer from './CenteredContainer'

import { auth, database } from '../../firebase/firebase'

import { Link, useHistory } from 'react-router-dom'

import { Form, Card, Button } from 'react-bootstrap'

export default function Signup() {
    const emailRef = useRef()
    const passwordRef = useRef()
    const passwordConfirmRef = useRef()

    const history = useHistory() 

    const [members, setMembers] = useState([])
    const [error, setError] = useState('')

    useEffect(() => {
        database.profiles
            .onSnapshot(snapshot => {
                let documents = []
                snapshot.docs.forEach(doc => {
                    documents.push(doc.data().userId)
                })
                setMembers(documents)
            })
    return () => setMembers()
    }, [])

    async function handleSubmit(e) {
        e.preventDefault()

        if (passwordRef.current.value !== passwordConfirmRef.current.value) {
            return setError('Password do not match')
        }

        try {
            setError('')

            const { user } = await auth.createUserWithEmailAndPassword(emailRef.current.value, passwordConfirmRef.current.value)

            database.profiles.add({
                userId: user.uid
            })

            database.individuals.add({
                userId: user.uid,
                like: [],
                dislike: [],
                other: members
            })

            members.forEach(member => {
                let other = []
                database.individuals
                    .where('userId', '==', member)
                    .onSnapshot(snapshot => {
                        snapshot.docs.forEach(doc => {
                            other = doc.data().other
                            other.push(user.uid)
                        })
                    })
                database.individuals
                    .where('userId', '==', member)
                    .get()
                    .then(existingFiles => {
                        const existingFile = existingFiles.docs[0]
                        if (existingFile) {
                            existingFile.ref.update({ other : other })
                        }
                    })

            })

            history.push('/profile')
            
        } catch {
            setError('Failed to create an account')
        }
    }

    return (
        <CenteredContainer>
            <Card>
                <Card.Body>
                    <h2 className="text-center mb-4">Sign Up</h2>

                    <Form onSubmit={handleSubmit}>
                        <Form.Group>
                            <Form.Label>Email</Form.Label>
                            <Form.Control type="email" ref={emailRef} required />
                        </Form.Group>

                        <Form.Group>
                            <Form.Label>Password</Form.Label>
                            <Form.Control type="password" ref={passwordRef} required/>
                        </Form.Group>

                        <Form.Group>
                            <Form.Label>Password Confirmation</Form.Label>
                            <Form.Control type="password" ref={passwordConfirmRef} required/>
                        </Form.Group>

                        <Button className="w-100 mt-4" type="submit">
                            Sign Up
                        </Button>
                    </Form>
                </Card.Body>
            </Card>

            <div className="w-100 text-center mt-2">
                Already have an account ? <Link to="/login">Log in</Link>
            </div>
        </CenteredContainer>
    )
}