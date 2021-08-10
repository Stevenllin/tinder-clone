import React from 'react'

import PersonIcon from '@material-ui/icons/Person'
import ForumIcon from '@material-ui/icons/Forum'
import IconButton from '@material-ui/core/IconButton'
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos'

import '../../css/Header.css'

import { Link, useHistory } from 'react-router-dom'

function Header({ backButton }) {
    const history = useHistory()
    return (
        <div className="header">
            {backButton ? (
                <IconButton onClick={() => history.replace(backButton)}>
                    <ArrowBackIosIcon fontSize="large" />
                </IconButton>
            ) : (
                <Link to='/update'>
                    <IconButton>
                        <PersonIcon fontSize="large"/>
                    </IconButton>
                </Link>
            )}


            <Link to="/">
                <img 
                    className="header__logo"
                    src="https://i.ibb.co/V3VXtd0/tinder.jpg" 
                    alt="tinder logo"
                />
            </Link>

            <Link to='/chats'>
                <IconButton>
                    <ForumIcon fontSize="large"/>
                </IconButton>
            </Link>
        </div>
    )
}
export default Header