import React, { useEffect, useState } from 'react'
import "@blueprintjs/core/lib/css/blueprint.css";
import "@blueprintjs/select/lib/css/blueprint-select.css";
import Multiselect from 'multiselect-react-dropdown';

function CustomFields({ name, classField, type, placeholder, onChange, value, optionsArray, hideOption }) {
    const [selectedItems, setSelectedItems] = useState([]);

    useEffect(() => {
        setSelectedItems(value || []);
    }, [value]);

    const handleSelect = (selectedList, selectedItem) => {
        setSelectedItems(selectedList);
        onChange(name, selectedList);
    }

    const handleRemove = (selectedList, removedItem) => {
        setSelectedItems(selectedList);
        onChange(name, selectedList);
    }

    return (
        <>
            {type == "text"
                ?
                <input name={name} className={classField} required type={type} placeholder={placeholder} defaultValue={value} onChange={onChange} />
                :
                null
            }

            {type == "email"
                ?
                <input name={name} className={classField} type={type} placeholder={placeholder} defaultValue={value} onChange={onChange} pattern="^.+@.+\..+$" title='Please enter a valid email address' />
                :
                null
            }

            {type == "password"
                ?
                <input name={name} className={classField} type={type} placeholder={placeholder} defaultValue={value} onChange={onChange} />
                :
                null
            }

            {type == "checkbox"
                ?
                <input name={name} className={classField} type={type} placeholder={placeholder} defaultValue={value} onChange={onChange} />
                :
                null
            }

            {type == "textarea"
                ?
                <textarea name={name} className={classField} type={type} placeholder={placeholder} defaultValue={value} onChange={onChange} ></textarea>
                :
                null
            }

            {type == "select"
                ?
                <select name={name} className={classField} type={type} placeholder={placeholder} value={value} onChange={onChange}>
                    {optionsArray.filter(option => option.id != hideOption)
                        .map((option, index) => (
                            <option key={index} value={option.id}>
                                {option.name}
                            </option>
                        ))
                    }
                </select>
                :
                null}


            {type === "multiselect" && (
                <Multiselect
                    options={optionsArray}
                    displayValue="name"
                    selectedValues={selectedItems}
                    onSelect={handleSelect}
                    onRemove={handleRemove}
                />
                // <Multiselect
                //     options={optionsArray}
                //     displayValue="name"
                //     onSelect={(selectedList, selectedItem) => handleSelect(selectedItem.id)}
                //     onRemove={(selectedList, removedItem) => handleRemove(removedItem.id)}
                // />
            )}
        </>
    )
}

export default CustomFields


