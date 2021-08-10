import React, { useState, useEffect, useRef } from 'react'

import { useHistory } from 'react-router-dom'

import { useAuth } from '../../contexts/AuthContext'

import { database, storage } from '../../firebase/firebase'

import { v4 as uuidV4 } from 'uuid'

import { Container, Form, Card, Button } from 'react-bootstrap'

import Header from './Header'
import Files from '../auth/Files'

export default function UpdateProfile( ) {
    const types = ['image/png', 'image/jpeg']

    const { currentUser } = useAuth()

    const [profile, setProfile] = useState([])
    const [files, setFiles] = useState()
    const [error, setError] = useState(null)

    const nicknameRef = useRef()
    const descriptionRef = useRef()
    const schoolRef = useRef()
    const companyRef = useRef()

    useEffect(() => {
        database.profiles
            .where('userId', '==', currentUser.uid)
            .onSnapshot(snapshot => {
                let documents = []
                snapshot.docs.forEach(doc => {
                    documents.push({ ...doc.data() })
                })
                setProfile(documents)
            })
        return () => setProfile([])
    }, [])

    useEffect(() => {
        database.profiles
            .where('userId', '==', currentUser.uid)
            .onSnapshot(snapshot => {
                let documents = []
                snapshot.docs.forEach(doc => {
                    documents = doc.data().files
                })
                setFiles(documents)
            })
        return () => setFiles()
    }, [])

    const history = useHistory()

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
                        description: descriptionRef.current.value,
                        school: schoolRef.current.value,
                        company: companyRef.current.value,
                        files: files 
                    })
                }
            })
        
        history.push('/')
    }

    return (
        <div>
            <Header backButton="/" />

            <div className="d-flex justify-content-center m-2">
                <div className="border-right p-2">Update</div>
                <div className="border-left p-2">Preview</div>
            </div>

            <Container
                className="d-flex align-items-center justify-content-center"
            >
                <div className="w-100" style={{ maxWidth: "500px" }}>
                    <Card>
                        <Card.Body>
                            <h2 className="text-center">Update your profile</h2>

                            {profile.length > 0 && <Files currentUser={currentUser} uploadFile={uploadFile} files={files} setFiles={setFiles}/>}                            

                            <Form onSubmit={handleSubmit}>
                                <Form.Group>
                                    <Form.Label>Nickname</Form.Label>
                                    <Form.Control plaintext ref={nicknameRef} defaultValue={profile.length > 0 ? profile[0].nickname : ''} />
                                </Form.Group>

                                <Form.Group>
                                    <Form.Label>Birthday</Form.Label>
                                    <Form.Control plaintext readOnly defaultValue={profile.length > 0 ? profile[0].birthday : ''} />
                                </Form.Group>

                                <Form.Group>
                                    <Form.Label>Description</Form.Label>
                                    <Form.Control type="text" ref={descriptionRef} defaultValue={profile.length > 0 ? profile[0].description : ''}/>
                                </Form.Group>

                                <Form.Group>
                                    <Form.Label>School</Form.Label>
                                    <Form.Control type="text" ref={schoolRef} defaultValue={profile.length > 0 ? profile[0].school : ''}/>
                                </Form.Group>

                                <Form.Group>
                                    <Form.Label>Company</Form.Label>
                                    <Form.Control type="text" ref={companyRef} defaultValue={profile.length > 0 ? profile[0].company : ''}/>
                                </Form.Group>

                                <Button className="w-100 mt-4" type="submit">
                                    Update
                                </Button>
                            </Form>
                        </Card.Body>
                    </Card>
                </div>
            </Container>
        </div>
    )
}