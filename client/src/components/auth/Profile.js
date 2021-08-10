import React, { useState, useRef } from 'react'

import { useHistory } from 'react-router-dom'

import CenteredContainer from './CenteredContainer'

import { database, storage } from '../../firebase/firebase'

import { useAuth } from '../../contexts/AuthContext'
import Files from './Files'

import { v4 as uuidV4 } from 'uuid'

import { Form, Card, Button } from 'react-bootstrap'

export default function Profile() {
    const types = ['image/png', 'image/jpeg']

    const nicknameRef = useRef('')
    const birthdayRef = useRef('')

    const [age, setAge] = useState('')
    const [files, setFiles] = useState([])
    const [error, setError] = useState(null)

    const { currentUser } = useAuth()

    const history = useHistory()

    let uid

    if (currentUser == null) {
        uid = ''
    } else {
        uid = currentUser.uid
    }

    function uploadFile(e) {
        let selected = e.target.files[0]
        
        if (selected && types.includes(selected.type)) {
            const id = uuidV4()
            
            setFiles(prevFiles => [
                ...prevFiles,
                { id: id, name: selected.name, progress: 0, error: false }
            ])

            const uploadImage = storage.ref(selected.name).put(selected)

            uploadImage.on('state_changed', snapshot => {
                const progress = snapshot.bytesTransferred / snapshot.totalBytes

                setFiles(prevFiles => {
                    return prevFiles.map(uploadFile => {
                        if (uploadFile.id === id) {
                            return { ...uploadFile, progress: progress }
                        }
                        return uploadFile
                    })
                })
            }, () => {
                setError('Please select an image file')
            }, () => {
                uploadImage.snapshot.ref.getDownloadURL().then(url => {
                    setFiles(prevFiles => {
                        return prevFiles.map(uploadFile => {
                            if (uploadFile.id === id) {
                                return { ...uploadFile, url: url }
                            }
                            return uploadFile
                        })
                    })         
                })

            })
        }
    }

    async function handleSubmit(e) {
        e.preventDefault()

        await database.profiles
            .where('userId', '==', currentUser.uid)
            .get()
            .then(existingFiles => {
                const existingFile = existingFiles.docs[0]
                if (existingFile) {
                    existingFile.ref.update({ 
                        nickname: nicknameRef.current.value,
                        birthday: birthdayRef.current.value,
                        age: age,
                        files: files
                    })
                }
            })
        history.push('/')
    }

    function handleAge() {
        let today = new Date()
        let birthDate = new Date(birthdayRef.current.value)
        let age = today.getFullYear() - birthDate.getFullYear()
        let monthDiff = today.getMonth() - birthDate.getMonth();

        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--
        }
        setAge(age)
    }

    return (
        <CenteredContainer>
            <Card>
                <Card.Body>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group>
                            <Form.Label>Nickname</Form.Label>
                            <Form.Control type="text" ref={nicknameRef} required />
                        </Form.Group>

                        <Form.Group>
                            <Form.Label>Birthday</Form.Label>
                            <Form.Control type="date" ref={birthdayRef} onChange={handleAge} required />
                        </Form.Group>

                        {uid && <Files currentUser={currentUser} files={files} setFiles={setFiles} uploadFile={uploadFile} />}

                        <Button className="w-100 mt-4" type="submit">
                            Confirm
                        </Button>
                    </Form>
                </Card.Body>
            </Card>
        </CenteredContainer>
    )
}
