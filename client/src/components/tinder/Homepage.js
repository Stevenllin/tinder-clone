import React, { useState } from 'react'

import { useAuth } from '../../contexts/AuthContext'

import Header from './Header'
import TinderCards from './TinderCards'
import SwipeButtons from './SwipeButtons'
import Selector from '../Modal/Selector'

import IconButton from '@material-ui/core/IconButton'
import SettingsIcon from '@material-ui/icons/Settings';

export default function Homepage() {
    const [isOpen, setIsOpen] = useState(false)
    const [connection, setConnection] = useState([])
    
    const { currentUser } = useAuth()

    function openModal() {
        setIsOpen(true)
    }

    function closeModal() {
        setIsOpen(false)
    }

    return (
        <div>
            <Header/>
            <IconButton onClick={() => openModal()}>
                <SettingsIcon fontSize="large"/>
            </IconButton>
            <TinderCards currentUser={currentUser} />
            <SwipeButtons />
            <Selector open={isOpen} closeModal={closeModal} />
        </div>
    )
}