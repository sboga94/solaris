import '../../layout/theme/scss/App.css';
import React, { Component }  from 'react';
export type LoadingComponentPropType= {
  svgSrc:any
  svgDescription?:any;
}

 const LoadingComponent = (props:LoadingComponentPropType) => {
  return (
    <div className="loading">
      <header className="loading-header">
        <img src={props.svgSrc} className="loading-logo" alt="logo" />
        <p>
          {props.svgDescription}
        </p>
      </header>
    </div>
  );
}

export default LoadingComponent;
