import React from 'react'

import Chat from './Chat'

import '../../css/Chats.css'

function Chats() {
    return (
        <div className="chats">
            <Chat 
                name="steve"
                message="Hello World"
                timestamp="40 seconds ago"
                profilePic="https://i.ibb.co/2j2T7fK/mark.jpg"
            />
        </div>
    )
}

export default Chats
