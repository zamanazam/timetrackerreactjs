import React, { useEffect, useState } from 'react';

export default function Alert(props) {
  const [alerts, setAlerts] = useState([]);
  const [inputState, setInputState] = useState(false);

  useEffect(() => {
    if (props && !inputState) {
        const alertId = new Date().getTime();
        const timeoutId = setTimeout(() => {
          setAlerts((prevAlerts) => prevAlerts.filter((alert) => alert.alertId !== alertId));
        }, 5000);
        setAlerts((prevAlerts) => [...prevAlerts, { alertId, timeoutId }]);
        setInputState(true);
    } else {
        setInputState(false);
    }
  }, [props]);

  const handleAlertDismiss = (alertId) => {
    setAlerts((prevAlerts) => prevAlerts.filter((alert) => alert.alertId !== alertId));
  };

  return (
    <>
      {alerts.length > 0 &&
        alerts.map((alert) => (
          <div key={alert.alertId} className={`alert alert-${props.type} alert-dismissible fade show`} role='alert'>
            <strong>{props.message}</strong>
            <button type='button' className='btn-close' data-bs-dismiss="alert" aria-label='close' onClick={() => handleAlertDismiss(alert.alertId)}></button>
          </div>
        ))} 
    </>
  );
}

// import React, { useEffect, useState } from 'react';

// export default function Alert(props) {
//   const [alerts, setAlerts] = useState([]);
//   const [inputState, setInputState] = useState(false);

//   useEffect(() => {
//     if (props && !inputState) {
//         const alertId = new Date().getTime();
//         const timeoutId = setTimeout( async () => {
//           await setAlerts((prevAlerts) => prevAlerts.filter((alert) => alert.alertId !== alertId));
//         }, 5000);
//         setAlerts((prevAlerts) => [...prevAlerts, { alertId, timeoutId }]);
//         setInputState(true);
//     }else{
//         setInputState(false);
//     }
//   }, [props]);

//   return (
//     <>
//        {alerts.length> 0 && alerts.map((alert) => ( 
//         <div key={alert.alertId} className={`alert alert-${props.type} alert-dismissible fade show`} role='alert'>
//           <strong>{props.message}</strong>
//           <button type='button' className='btn-close' data-bs-dismiss="alert" aria-label='close'></button>
//         </div>
//        ))} 
//     </>
//   );
// }
