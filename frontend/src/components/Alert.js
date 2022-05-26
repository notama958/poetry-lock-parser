import React from 'react';

// this component renders alert box based on response status
const Alert = ({ alert }) => {
  return (
    <div id="noti" className={`${alert ? alert.stt : ''}`}>
      <p>{alert ? alert.message : ''}</p>
    </div>
  );
};

export default Alert;
