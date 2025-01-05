'use client';

import React, {useState} from 'react';
import {Button} from "@mui/material";

function MuiSwitchButton() {
  const [activeButton, setActiveButton] = useState('Button1');

  const handleButtonClick = (buttonName: string) => {
    setActiveButton(buttonName);
  }

  return (
    <div>
      {activeButton === 'Button1' ? <Button1/> : ""}
      {activeButton === 'Button2' ? <Button2/> : ""}
      {activeButton !== '' && (
        <>
          <Button
            onClick={() => handleButtonClick('Button1')}>{activeButton === 'Button1' ? 'Button1' : 'Button1 - Active'}</Button>
          <Button
            onClick={() => handleButtonClick('Button2')}>{activeButton === 'Button2' ? 'Button2' : 'Button2 - Active'}</Button>
        </>
      )}
    </div>
  );
}

export default MuiSwitchButton;


function Button1() {
  return <div>Child Button 1</div>;
}

function Button2() {
  return <div>Child Button 2</div>;
}