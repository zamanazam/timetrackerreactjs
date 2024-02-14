import React, { useState, useEffect } from 'react'
import { Modal, ModalFooter } from 'react-bootstrap';
import CustomFields from './CustomFields';


function PopUps(props) {
    const [inputValues, setInputValues] = useState({});
    const { inputs, show, title, message, buttontitle, onClose, onClick } = props;
    const [isValidEmail, setEmailState] = useState(false);
    const [warning, setWarnings] = useState({});

    const handleInputChange = (name, value) => {
        setInputValues((prevValues) => {
            if (inputs.find(input => input.name === name && input.type === "multiselect")) {
                return { ...prevValues, [name]: value.map(item => item.id) };
            } else {
                return { ...prevValues, [name]: value };
            }
        });
    };

    const handleClick = (e) => {
        e.preventDefault();
        const selectedValues = Object.entries(inputValues).map(([name, value]) => ({
            name,
            value,
          }));
      
          props.onClick(selectedValues);
          console.log('close',props.onClose);
          //props.onClose();
    };
    return (

        <Modal show={show} onHide={onClose}>
            <form onSubmit={(e) => handleClick(e)}>
                <div className='card border-0'>
                    <div className='card-header bg-transparent'>
                        <h5 className='float-start'>{title}</h5>
                        <button type="button" className="btn-close float-end" data-bs-dismiss="modal" aria-label="Close" onClick={onClose}>
                            <span aria-hidden="true"></span>
                        </button>
                    </div>
                    <div className='card-body'>
                        {inputs &&
                            inputs.map((input, index) => (
                                <div key={index}>
                                    <label>{input.InputTitle}</label>
                                    <CustomFields
                                        key={index}
                                        classField={input.classField}
                                        type={input.type}
                                        placeholder={input.placeholder}
                                        onChange={e => setInputValues({ ...inputValues, [input.name]: e.target.value })}
                                        value={inputValues[input.name] || ''}
                                        name={input.name}
                                        optionsArray={input.type === "multiselect" ? input.optionsArray : null}
                                        hideOption={input.hideOption || null}
                                        {...input} />
                                    {!isValidEmail && <label htmlFor={warning.name}>{warning.message}</label>}
                                </div>
                            ))}
                        {message &&
                            <strong>{message}</strong>
                        }
                    </div>
                    <div className='card-footer bg-transparent'>
                        <button type="submit" className="btn btn-primary float-end">
                            {buttontitle}
                        </button>
                    </div>
                </div>
            </form>
        </Modal>
    )
}
export default PopUps;