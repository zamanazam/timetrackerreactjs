import React, { useState, useEffect } from 'react'
import { Modal, ModalFooter } from 'react-bootstrap';


function PopUps(props) {
    const [firstInputValue, setFirstInputValue] = useState('');
    const [secondInputValue, setSecondInputValue] = useState('');
    const [isEmailValid, setEmailValid] = useState(true);
    const [isNameValid, setNameValid] = useState(true);

    useEffect(() => {
        if (!props) {
            return null;
        }
    }, []);

    const handleFirstInputChange = (e) => {
        setFirstInputValue(e.target.value);
        setNameValid(true);
    };

    const handleSecondInputChange = (e) => {
        setSecondInputValue(e.target.value);
        setEmailValid(true);
    };


    const handleClick = (event) => {
        if (firstInputValue.trim() === "") {
            setNameValid(false);
            return false;
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const isValidEmail = emailRegex.test(secondInputValue);

        if (!isValidEmail && props.secondInputTitle !== "Description") {
            setEmailValid(false);
            return false;
        } else {
            props.onClick(firstInputValue, secondInputValue);
            props.onClose(event);
        }
    };

    return (

        <Modal show={props.show} onHide={props.onClose}>
            <Modal.Header closeButton>
                <Modal.Title>
                    {props.title}
                </Modal.Title>
            </Modal.Header>

            <Modal.Body>
                {props.message != null
                    ?
                    <strong>{props.message}</strong>
                    :
                    <>
                        <form>
                            <div className="mb-3">
                                <label htmlFor="recipient-name" className="col-form-label">{props.firstInputTitle}</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="recipient-name"
                                    value={firstInputValue}
                                    onChange={handleFirstInputChange}
                                />
                                {!isNameValid && (
                                    <p className='text-danger mt-1 small'>Enter Name</p>
                                )}
                            </div>
                            <div className="mb-3">
                                <label htmlFor="message-text" className="col-form-label">{props.secondInputTitle}</label>
                                {props.secondInputTitle === "Description"
                                    ?
                                    <textarea className="form-control"
                                        id="message-text"
                                        value={secondInputValue}
                                        onChange={handleSecondInputChange}>
                                    </textarea>
                                    :
                                    <>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="message-text"
                                            value={secondInputValue}
                                            onChange={handleSecondInputChange}
                                        />
                                        {!isEmailValid && (
                                            <p className='text-danger mt-1 small'>Enter a valid email</p>
                                        )}
                                    </>
                                }
                            </div>

                            <div className="mb-3">
                                <label htmlFor="message-text" className="col-form-label">{props.thirdInputTitle}</label>
                                {props.thirdInputTitle === "Description" ? (
                                    <textarea
                                        className="form-control"
                                        id="message-text"
                                        value={secondInputValue}
                                        onChange={handleSecondInputChange}
                                    ></textarea>
                                ) : props.thirdInputTitle === "multiselect" ? (
                                    // Your multiselect component goes here
                                    // For example:
                                    <MultiselectComponent
                                        options={multiselectOptions}
                                        selectedValues={selectedMultiselectValues}
                                        onChange={handleMultiselectChange}
                                    />
                                ) : (
                                    <>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="message-text"
                                            value={secondInputValue}
                                            onChange={handleSecondInputChange}
                                        />
                                        {!isEmailValid && (
                                            <p className='text-danger mt-1 small'>Enter a valid email</p>
                                        )}
                                    </>
                                )}

                            </div>
                        </form>
                    </>
                }
            </Modal.Body>
            <ModalFooter>
                <span className="btn btn-secondary" onClick={props.onClose}>Close</span>
                <span className="btn btn-primary" onClick={(e) => handleClick(e)}>{props.buttontitle}</span>
            </ModalFooter>
        </Modal>
    )
}

export default PopUps