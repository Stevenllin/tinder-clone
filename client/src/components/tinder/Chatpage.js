import React from 'react'

import { useAuth } from '../../contexts/AuthContext'
import { SocketProvider } from '../../contexts/SocketProvider'

import Header from './Header'
import ChatScreen from './ChatScreen'

import { useParams } from 'react-router-dom'

export default function Chatpage() {
    const { person } = useParams()

    const { currentUser } = useAuth()

    return (
        <div>
            <Header backButton="/chats" />
            <ChatScreen userId={currentUser.uid} person={person} />
        </div>
    )
}