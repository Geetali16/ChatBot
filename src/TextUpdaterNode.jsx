import React, { useState, useEffect, useCallback } from 'react';
import { Handle, Position } from 'reactflow';
import { IconButton } from '@mui/material';
import { Edit, FileCopy } from '@mui/icons-material';

import './TextUpdaterNode.css';

function TextUpdaterNode({ data, handleConnect, isConnectable }) {
  const { prompt, label, value } = data;
  const [isHidden, setIsHidden] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [val, setValue] = useState("");
  const handleHide = useCallback(() => {
    setIsHidden(true);
  }, []);

  // hiding component
  if (isHidden) {
    return null; 
  }

  const handleVerify = () => {
    let isValid = false;
  
    if (value.responseType === 'email') {
      isValid = isValidEmail(val);
    } else if (value.responseType === 'phone') {
      isValid = isValidPhoneNumber(val);
    }
  
    setIsVerified(isValid);
  };

  const isValidEmail = (email) => {
    return email.includes('@') && email.includes('.');
  };
  

  const isValidPhoneNumber = (num) => {
    const digitsOnly = num.replace(/\D/g, '');
    return digitsOnly.length === 10 && digitsOnly === num;
  };

  return (
    <div className="text-updater-node">
      <div className="button-container">
        <IconButton className="edit-button" onClick={() => console.log('Edit clicked')}>
          <Edit />
        </IconButton>
        <IconButton className="copy-button" onClick={() => console.log('Copy clicked')}>
          <FileCopy />
        </IconButton>
      </div>
      <button className="close-button" onClick={handleHide}>
        X
      </button>
      <Handle type="target" position={Position.Left} isConnectable={isConnectable} />
      <Handle type="source" position={Position.Right} isConnectable={isConnectable} />
      <Handle type="source" position={Position.Top} isConnectable={isConnectable} />
      <div> 
        <label htmlFor="text">
          {label} <br />
        </label>
        <br /> <br />
      </div>
      {prompt === 'ask' ? (
        <>
          {value.question} <br /> <br />
          <div>
            {value.responseType == "opt" ? <>
            {value.options.map((button) => (
              <div className="option-display">
                <button>{button}</button>
              </div>
            ))}
            </> : <> 
            <input
    type={value.responseType}
    className="response-box"
    placeholder={'Enter ' + value.responseType + ' value'}
    onChange={(e) => setValue(e.target.value)}
  />
  {value.responseType === 'email' && !isValidEmail(val) && (
    <p className="error-text">Please enter a valid email address.</p>
  )}
  {value.responseType === 'phone' && !isValidPhoneNumber(val) && (
    <p className="error-text">Please enter a valid phone number.</p>
  )}
  <button className="verify" onClick={handleVerify}>Verify</button>
  {isVerified && <p className="verified-text">Input value is correct.</p>}
            </>
        }
          </div>
        </>
      ) : (
        <>
          {value.message}
        </>
      )}
    </div>
  );
}

export default TextUpdaterNode;
