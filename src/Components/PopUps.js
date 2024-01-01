import React, { useState,useEffect } from 'react'
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
  }, [props]);

  const handleFirstInputChange = (e) => {
      setFirstInputValue(e.target.value);
      setNameValid(true);
  };

  const handleSecondInputChange = (e) => {
    setSecondInputValue(e.target.value);
    setEmailValid(true);
  };


  const handleClick = () => {
    debugger;
        if (firstInputValue.trim() === "") {
        setNameValid(false);
        } else {
        setNameValid(true);
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const isValidEmail = emailRegex.test(secondInputValue);
    
        if (!isValidEmail && props.secondInputTitle !== "Description") {
            setEmailValid(false);
        } else {
            props.onClick(firstInputValue, secondInputValue);
            props.onClose();
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
                                            <p className='text-danger mt-1'>Enter Name</p>
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
                                                    <p className='text-danger mt-1'>Enter a valid email</p>
                                                )}
                                        </>
                                    } 
                                </div>
                            </form>
                    </>
                }
            </Modal.Body>
            <ModalFooter>
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" onClick={props.onClose}>Close</button>
                            <button type="button" className="btn btn-primary" onClick={handleClick}>{props.buttontitle}</button>
            </ModalFooter>
        </Modal>
    )
}

export default PopUps