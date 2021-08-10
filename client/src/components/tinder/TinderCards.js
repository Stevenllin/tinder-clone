import React, { useState, useEffect } from 'react'

import { database } from '../../firebase/firebase'

import TinderCard from 'react-tinder-card'

import '../../css/TinderCards.css'

function TinderCards({ currentUser }) {
    const [newArray, setNewArray] = useState([])

    let array = []

    useEffect(async() => {
        database.individuals
            .where('userId', '==', currentUser.uid)
            .get()
            .then(async(snapshot) => {
                const other = snapshot.docs.map(doc => doc.data())[0].other

                Promise.all(other.map(async(each) => {
                    await database.profiles
                        .where('userId', '==', each)
                        .get()
                        .then((querySnapshot) => {
                            querySnapshot.forEach((doc) => {
                                array.push(doc.data())
                            })
                        })
                    })).then(() => {
                        setNewArray(array)
                    })
            })
        }, [])

    function onSwipe(person, direction) {
        if (direction === 'right'){
            database.individuals
                .where('userId', '==', currentUser.uid)
                .get()
                .then(async(snapshot) => {
                    let like = snapshot.docs.map(doc => doc.data())[0].like
                    let other = snapshot.docs.map(doc => doc.data())[0].other
                    const existingFile = snapshot.docs[0]

                    like.push(person.userId)
                    
                    const newOther = other.filter(id => id !== person.userId )                    
                    
                    existingFile.ref.update({ like: like })
                    existingFile.ref.update({ other: newOther })
                })
        } else if (direction === 'left') {
            database.individuals
                .where('userId', '==', currentUser.uid)
                .get()
                .then(async(snapshot) => {
                    let dislike = snapshot.docs.map(doc => doc.data())[0].dislike
                    let other = snapshot.docs.map(doc => doc.data())[0].other
                    const existingFile = snapshot.docs[0]

                    dislike.push(person.userId)
                    
                    const newOther = other.filter(id => id !== person.userId )                    
                    
                    existingFile.ref.update({ dislike: dislike })
                    existingFile.ref.update({ other: newOther })
                })
        }
    }

    return (
        <div>
            <div className="tinderCards__cardContainer">
                {newArray && newArray.map(person => {
                    return (
                        <TinderCard
                            className="swipe"
                            key={person.nickname}
                            preventSwipe={['up', 'down']}
                            onSwipe={(direction) => onSwipe(person, direction)}
                        >
                            <div
                                style={{ backgroundImage: `url(${person.files[0].url})` }}
                                className="tinderCard"
                            >
                                <h3 style={{ left: '25px' }}>{person.nickname}</h3>
                                <h3 style={{ right: '25px' }}>{person.age}</h3>       
                            </div>
                        </TinderCard>
                    )
                })}
            </div>
        </div>
    )
}

export default TinderCards