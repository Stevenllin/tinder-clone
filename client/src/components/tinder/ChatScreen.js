import React, { useState, useEffect } from 'react'

import { database } from '../../firebase/firebase'

import { useConversations } from '../../contexts/ConversationsProvider'
import { useSocket } from '../../contexts/SocketProvider'

import Avatar from '@material-ui/core/Avatar'

import '../../css/ChatScreen.css'

function ChatScreen({ userId, person }) {
    const [input, setInput] = useState('')
    const [messages, setMessages] = useState([])
    const [profile, setProfile] = useState([])

    const { sendMessage } = useConversations()

    const socket = useSocket()

    useEffect(() => {
        let array
        database.profiles
            .where('nickname', '==', person)
            .get()
            .then(existingFiles => {
                array = existingFiles.docs.map(doc => doc.data())[0]
                setProfile(array)

                let recipients = []
                recipients.push(array.userId)
                recipients.push(userId)
                recipients.sort()

                database.rooms
                    .where('recipients', '==', recipients)
                    .get()
                    .then(existingFiles => {
                        const existingMessage = existingFiles.docs.map(doc => doc.data())[0].messages
                        setMessages(existingMessage)
                    })
                })
    }, [])

    useEffect(() => {
        if (socket == null) return
        console.log(1)

        let array

        let count = messages.length - 1
        const lastMessage = messages[count]

        database.profiles
            .where('nickname', '==', person)
            .get()
            .then(existingFiles => {
                array = existingFiles.docs.map(doc => doc.data())[0]

                let recipients = []
                recipients.push(array.userId)
                recipients.push(userId)
                recipients.sort()

                database.rooms
                    .where('recipients', '==', recipients)
                    .get()
                    .then(existingFiles => {
                        const existingMessage = existingFiles.docs.map(doc => doc.data())[0].messages
                    })

                socket.on('receive-message', (res) => {
                    if (messages.length > 0) {
                        console.log('input', res)
                        const { input } = res
                        setMessages([...messages, { userId: array.userId, message: input}])
                    }

                })
            })
        return () => socket.off('receive-message')
    }, [socket, messages])
        
    const handleSend = e => {
        e.preventDefault()        

        setMessages([...messages, { userId: userId, message: input}])

        sendMessage(userId, profile.userId, input)

        console.log(2)

        setInput('')

    }
    // sendMessage更新DB，Socket再去跟DB要資料渲染畫面

    return (
        <div className="chatScreen">
            <p className="chatScreen__timestamp">You have matched with { profile.nickname }</p>
            {messages.length > 0 && messages.map(message => 
                message.userId !== userId ? (
                    <div className="chatScreen__message">
                        <Avatar 
                            className="chatScreen__image"
                            alt={profile.nickname}
                            src={profile && profile.files[0].url}
                        />
                        <p className="chatScreen__text">{message.message}</p>
                    </div>
                ) : (
                    <div className="chatScreen__message">
                        <p className="chatScreen__textUser">{message.message}</p>
                    </div>
                )
            )}
            <form
                className="chatScreen__input"
            >
                <input 
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    className="chatScreen__inputField"
                    placeholder="Type a message"
                    type="text"
                />
                <button onClick={handleSend} type="submit" className="chatScreen__inputButton">SEND</button>
            </form>
        </div>
    )
}

export default ChatScreen
