import React from 'react';

function CustomButton({ className,label, onClick, style,icon}) {
  return (
    <button className={className} onClick={onClick} style={style}>
      {icon}
      {label}
    </button>
  );
}

export default CustomButton;