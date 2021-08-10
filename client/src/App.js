import React from 'react'

import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'

import { AuthProvider } from './contexts/AuthContext'
import { ConversationsProvider } from './contexts/ConversationsProvider'
import { SocketProvider } from './contexts/SocketProvider'

import PrivateRoute from './components/auth/PrivateRoute'
import Signup from './components/auth/Signup'
import Login from './components/auth/Login'
import Profile from './components/auth/Profile'

import Homepage from './components/tinder/Homepage'
import Chatspage from './components/tinder/Chatspage'
import Chatpage from './components/tinder/Chatpage'
import UpdateProfile from './components/tinder/UpdateProfile'

import 'bootstrap/dist/css/bootstrap.min.css'

import './App.css'

function App() {
  return (
    <div className="App">
      <AuthProvider>
        <SocketProvider>
          <ConversationsProvider>
            <Router>
              <Switch>
                <Route path="/signup" component={Signup}/>
                <Route path="/login" component={Login}/>
                <Route path="/profile" component={Profile}/>

                <PrivateRoute exact path="/chats/:person" component={Chatpage} />
                <PrivateRoute exact path="/chats" component={Chatspage} />  
                <PrivateRoute exact path="/update" component={UpdateProfile} />
                <PrivateRoute exact path="/" component={Homepage} />  
              </Switch>
            </Router>
          </ConversationsProvider>
        </SocketProvider>
      </AuthProvider>
    </div>
  );
}

export default App;
