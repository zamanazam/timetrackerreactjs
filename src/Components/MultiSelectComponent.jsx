import { MultiSelect2 } from "@blueprintjs/select"; 
import { MenuItem } from "@blueprintjs/core"; 
import "normalize.css"; 
import "@blueprintjs/core/lib/css/blueprint.css"; 
import "@blueprintjs/select/lib/css/blueprint-select.css"; 
import { useState } from 'react'; 

function MultiSelectComponent({options}) { 
	debugger
	const [item, setItem] = useState('A'); 
	const [items, setItems] = useState([]); 

	return ( 
		<div className="container" style={{ width: '30%' }}> 
		<MultiSelect2 
			activeItem={item} 
			items={options} 
			selectedItems={items} 
			itemRenderer={(val, itemProps) => { 
				return ( 
					<MenuItem 
						key={val} 
						text={val} 
						onClick={(elm) => { 
							setItem(elm.target.textContent) 
							setItems((items) => { 
								return [...items, elm.target.textContent] 
							}) 
						}} 
						active={itemProps.modifiers.active} 
					/> 
				); 
			}} 
			onItemSelect={() => { }} 
			tagRenderer={(item) => item} 
			onRemove={(item) => { 
				setItems(items => items.filter(elm => elm !== item)) 
			}} 
			onClear={() => setItems([])} 
		/> 
	</div> 
	); 
} 

export default MultiSelectComponent;
