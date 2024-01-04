import React, { useEffect } from 'react'
import { MultiSelect } from "@blueprintjs/select"; 
import { MenuItem } from "@blueprintjs/core"; 
import "@blueprintjs/core/lib/css/blueprint.css"; 
import "@blueprintjs/select/lib/css/blueprint-select.css";
import { useState } from "react"; 
function CustomFields({ classField, type, placeholder, onChange ,value,optionsArray,hideOption}) {
    useEffect(()=>{
    },[])
  return (
    <>
        {type == "text" 
            ? 
                <input className={classField} type={type} placeholder={placeholder} defaultValue={value} onChange={onChange} />
            :
            null
        }

        {type == "email" 
            ? 
                <input className={classField} type={type} placeholder={placeholder} defaultValue={value} onChange={onChange} />
            :
            null
        }

        {type == "password" 
            ? 
                <input className={classField} type={type} placeholder={placeholder} defaultValue={value} onChange={onChange} />
            :
            null
        }

        {type == "checkbox" 
            ? 
                <input className={classField} type={type} placeholder={placeholder} defaultValue={value} onChange={onChange} />
            :
            null
        }

        {type == "textarea" 
            ?
                <textarea className={classField} type={type} placeholder={placeholder} defaultValue={value} onChange={onChange} ></textarea>
            :
            null
        }

        {type == "select" 
            ? 
                <select className={classField} type={type} placeholder={placeholder} value={value} onChange={onChange}>
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

         {type == "multiselect"
         ?
         <MultiSelect items={optionsArray}  selectedItems={items} 
                    itemRenderer={(val, itemProps) => { 
                        return ( 
                            <MenuItem 
                                key={val} 
                                text={val} 
                                onClick={(elm) => { 
                                    setItem(elm.target.textContent); 
                                    setItems((items) => { 
                                        return [...items,  
                                             elm.target.textContent]; 
                                    }); 
                                }} 
                                active={itemProps.modifiers.active} 
                            /> 
                        ); 
                    }} 
                    onItemSelect={() => { }} 
                    tagRenderer={(item) => item} 
                    onRemove={(item) => { 
                        setItems((items) => items.filter( 
                           (elm) => elm !== item)); 
                    }} 
                    onClear={() => setItems([])} 
                /> 
         :
         null
         }       
    </>
  )
}

export default CustomFields


