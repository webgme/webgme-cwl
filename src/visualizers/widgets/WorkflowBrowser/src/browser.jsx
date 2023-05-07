import React, { useCallback, useEffect, useState } from 'react';

export default function Browser(props) {
  
    const [global, setGlobal] = useState({initialized:false});
    const onUpdateFromControl = useCallback(descriptor => {
      console.log('got update');
      // setGlobal(descriptor.global);
    });
    
    WEBGME_CONTROL.registerUpdate(onUpdateFromControl);
  
    return (
      <div style={{ width: '100vw', height: '100vh' }}>
        content coming
      </div>
    );
  }