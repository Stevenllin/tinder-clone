import React from 'react'

import RangeSlider from './Slider'
import { Modal, Form, Button } from 'react-bootstrap'

import '../../css/Selector.css'

export default function Selector({ open, closeModal }) {
    if (!open) return null
    
    return (
        <div>
            <Modal
                show={open}   
            >
                <Modal.Body
                    className="d-flex flex-column"
                    style={{ padding: '30px'}}
                >
                    <h4>Gender</h4>
                    <Form>
                        <div key="radio">
                            <Form.Check
                                
                                inline
                                label="male"
                                name="gender"
                                type="radio"
                                id="male"
                            />

                            <Form.Check
                                inline
                                label="female"
                                name="gender"
                                type="radio"
                                id="female"
                            /> 
                            
                            <Form.Check
                                inline
                                label="no preference"
                                name="gender"
                                type="radio"
                                id="no preference"
                            />  
                        </div>

                        <RangeSlider />
                        
                        <div className="d-flex justify-content-end">
                            <Button
                                className="mx-2"
                                variant="secondary"
                                onClick={() => closeModal()}
                            >
                                Cancel
                            </Button>
                            <Button variant="primary" type="submit">
                                Search
                            </Button>
                        </div>
                    </Form>
                </Modal.Body>
            </Modal>
        </div>
    )
}

