import React from 'react';

function CustomButton({ className,label, onClick, style}) {
  return (
    <button className={className} onClick={onClick} style={style}>
      {label}
    </button>
  );
}

export default CustomButton;