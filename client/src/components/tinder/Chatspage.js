import React, { useState, useEffect } from 'react'

import { database } from '../../firebase/firebase'

import { useAuth } from '../../contexts/AuthContext'
import { useConversations } from '../../contexts/ConversationsProvider'

import { Link } from 'react-router-dom'

import Header from './Header'
import Chats from './Chats'

import '../../css/Chatspage.css'

export default function Chatspage() {
    const { currentUser } = useAuth()
    const [friends, setFriends] = useState([])

    const { createConversation } = useConversations()
    
    useEffect(async() => {
        await database.individuals
            .where('userId', '==', currentUser.uid)
            .get()
            .then((snapshot) => {
                const like = snapshot.docs.map(doc => doc.data())[0].like

                let array = []

                Promise.all(like.map(async(each) => {
                    await database.individuals
                        .where('userId', '==', each)
                        .get()
                        .then((existingFiles) => {
                            let match = existingFiles.docs.map(doc => doc.data())[0].like

                            const isMatch = match.includes(currentUser.uid)
                        
                            if (isMatch) {
                                array.push(each)
                            }
                        })
                })).then(() => {
                    let array2 = []
                    Promise.all(array.map(async(each) => {
                        await database.profiles
                            .where('userId', '==', each)
                            .get()
                            .then((existingFiles) => {
                                const profiles = existingFiles.docs.map(doc => doc.data())
                                array2.push(profiles)
                            })
                    })).then(() => {
                        setFriends(array2)
                    })
                })
            })    
    }, [])

    function handleClick(userId) {
        let recipients = []
        recipients.push(userId)
        recipients.push(currentUser.uid)
        recipients.sort()

        createConversation(recipients)
    }

    return (
        <div>
            <Header backButton="/" />
            {friends.length > 0 && friends.map(friend => {
                return (
                    <Link to={`/chats/${friend[0].nickname}`}>
                        <img src={friend[0].files[0].url} className="avatar mr-2" onClick={() => handleClick(friend[0].userId)}/>
                    </Link>              
                )
            })}
            <Chats friends={friends} />
        </div>
    )
}