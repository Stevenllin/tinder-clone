import React, { useContext, useEffect, useState } from 'react'

import io from 'socket.io-client'

import { useAuth } from '../contexts/AuthContext'

const SocketContext = React.createContext()

export function useSocket() {
    return useContext(SocketContext)
}

export function SocketProvider({ children }) {
    const [socket, setSocket] = useState()

    const { currentUser } = useAuth()

    let userId

    if (currentUser == null) {
        userId = ''
    } else {
        userId = currentUser.uid
    }

    useEffect(() => {
        const newSocket = io('http://localhost:5000',
            { query: {userId} }
        )
        setSocket(newSocket)

        return () => newSocket.close()
    }, [userId])

    return (
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    )
}