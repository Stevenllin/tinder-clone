import React, { useState, useEffect, useContext } from 'react'

import { v4 as uuidV4 } from 'uuid'

import { database } from '../firebase/firebase'

import { useSocket } from './SocketProvider'

const ConversationsContext = React.createContext()

export function useConversations() {
    return useContext(ConversationsContext)
}

export function ConversationsProvider({ children }) {
    const socket = useSocket()

    // useEffect(() => {
    //     if (socket == null) return

    //     console.log(280238120)

    //     socket.on('receive-message', sendMessage)

    //     return () => socket.off('receive-message')
    // }, [socket, sendMessage])

    function createConversation(recipients) {
        const roomId = uuidV4()

        database.rooms
            .where('recipients', '==', recipients)
            .get()
            .then(existingFiles => {
                const existingFile = existingFiles.docs[0]

                if(!existingFile){
                    database.rooms.add({
                        roomId: roomId,
                        recipients: recipients,
                        messages: []
                    })
                }
            })
    }

    function sendMessage(senderId, recipientId, input) {
        socket.emit('send-message', { recipientId, input })

        let recipients = []
        recipients.push(recipientId)
        recipients.push(senderId)
        recipients.sort()
        
        database.rooms
            .where('recipients', '==', recipients)
            .get()
            .then(existingFiles => {
                let existingMessage = existingFiles.docs.map(doc => doc.data())[0].messages
                const existingFile = existingFiles.docs[0]
                let object = {
                    userId: senderId,
                    message: input
                }
                
                existingMessage.push(object)
                if (existingFile) {
                    existingFile.ref.update({ 
                        messages: existingMessage
                    })
                }
            })    
    }

    const value = {
        createConversation,
        sendMessage
    }

    return (
        <ConversationsContext.Provider value={value}>
            {children}
        </ConversationsContext.Provider>
    )
}