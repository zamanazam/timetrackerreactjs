import React,{useEffect} from 'react';
export default function Alert(props) {
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      props.onClose();
    }, 3000);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [props.onClose]);
  return (
      <div className={`alert  alert-${props.type} alert-dismissible fade show`} role='alert'>
        <strong>{props.message}</strong>
        <button type='button' className='btn-close' data-bs-dismiss="alert" aria-label='close'></button>
      </div>
  );
}
