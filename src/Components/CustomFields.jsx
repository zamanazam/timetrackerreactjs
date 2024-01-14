import React, { useEffect, useState } from 'react'
import "@blueprintjs/core/lib/css/blueprint.css";
import "@blueprintjs/select/lib/css/blueprint-select.css";
import Multiselect from 'multiselect-react-dropdown';

function CustomFields({ name, classField, type, placeholder, onChange, value, optionsArray, hideOption }) {
    const [selectedItems, setSelectedItems] = useState([]);
    useEffect(() => {
        setSelectedItems(value || []);
    }, [value]);

    // const handleSelect = (selectedList, selectedItem) => {
    //     setSelectedItems(selectedList);
    //     onChange(name, selectedList);
    // }

    // const handleRemove = (selectedList, removedItem) => {
    //     setSelectedItems(selectedList);
    //     onChange(name, selectedList);
    // }
    const handleSelect = (selectedList, selectedItem) => {
        setSelectedItems(selectedList);
        onChange({ target: { name, value: selectedList } });
    }
    
    const handleRemove = (selectedList, removedItem) => {
        setSelectedItems(selectedList);
        onChange({ target: { name, value: selectedList } });
    }   

    return (
        <>
            {type == "text" &&
                <input name={name} className={classField} required type={type} placeholder={placeholder} defaultValue={value} onChange={onChange} />
            }

            {type == "number" && 
                 <input name={name} className={classField} required type={type} placeholder={placeholder} defaultValue={value} onChange={onChange} />
            }

            {type == "email" &&
                <input name={name} className={classField} type={type} placeholder={placeholder} defaultValue={value} onChange={onChange} pattern="^.+@.+\..+$" title='Please enter a valid email address' />
            }

            {type == "password" &&
                <input name={name} className={classField} type={type} placeholder={placeholder} defaultValue={value} onChange={onChange} />
            }

            {type == "checkbox" &&
                <input name={name} className={classField} type={type} placeholder={placeholder} defaultValue={value} onChange={onChange} />
            }

            {type == "textarea" &&
                <textarea name={name} className={classField} type={type} placeholder={placeholder} defaultValue={value} onChange={onChange} ></textarea>
            }

            {type == "select" &&
                <select name={name} className={classField} type={type} placeholder={placeholder} value={value} onChange={onChange}>
                    {optionsArray.filter(option => option.id != hideOption)
                        .map((option, index) => (
                            <option key={index} value={option.id}>
                               {option.name}
                            </option>
                        ))
                    }
                </select>
            }


            {type === "multiselect" && (
                <Multiselect
                    options={optionsArray.filter(option => !hideOption.includes(option.id))}
                    displayValue="name"
                    selectedValues={selectedItems}
                    onSelect={handleSelect}
                    onRemove={handleRemove}
                />
            )}
        </>
    )
}

export default CustomFields


