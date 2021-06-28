import { useEffect, useReducer, useRef } from "react";
import LoadingComponent from "../components/loading/LoadingComponent";
import dataInitialize from '../layout/theme/images/dataInitialize.svg';
import dataStatics from '../layout/theme/images/dataStatics.svg';
import * as solarisData from '../Solaris-2.json';
import { useState } from "react";
import Dashboard from "../layout/Dashboard";
import React, { Component } from 'react';
import { StaticsManager } from "./StaticsManager";

export interface ISolarisData {
  status: string;
  age: string;
  diet: string;
  taxonomy: string[];
  id: number;
}

export interface ISolarisTimeLine {
  timeLine: string;
  solarisDatas: ISolarisData[];
}
function App() {
  const initialState = {
    isDataProcessing: true,
    isStaticExtracting: false,
    isAppLoaded: false,
    svgSrc: dataInitialize,
    svgDescription: "Data is initializing..."
  }
  let [data, setData] = useState<ISolarisTimeLine[]>([]);
  let [store, dispatch] = useReducer(appReducer, initialState)

  function processData() {
    let data: ISolarisTimeLine[] = [];
    (solarisData as any).default.map((item: any) => data.push({ timeLine: new Date(item[0]).toLocaleDateString(), solarisDatas: item[1] }))
    StaticsManager.init(data);
    setData(data)
  }


  useEffect(() => {
    dispatch({ type: "STATICS_EXTRACT" })
    let timer = setTimeout(() => dispatch({ type: "LOAD_APP" }), 3000);
    return () => {
      clearTimeout(timer);
    }
  }, [data])


  function appReducer(state: any, action: any) {
    switch (action.type) {

      case 'STATICS_EXTRACT':
        return Object.assign({}, state, {
          svgSrc: dataStatics,
          svgDescription: "Statics are extracting...",
          isStaticExtracting: true
        })
      case 'LOAD_APP':
        return Object.assign({}, state, {
          isAppLoaded: true
        })
      default:
        return state
    }
  }


  useEffect(() => {
    processData()
  }, [])


  return (
    <div className="App">
      {store.isAppLoaded ? <Dashboard data={store.data} /> : <LoadingComponent svgSrc={store.svgSrc} svgDescription={store.svgDescription} />}
    </div>
  );
}

export default App;
