import React, { useState, useEffect } from 'react';
import { ThemeProvider } from '@material-ui/styles';

import CssBaseline from '@material-ui/core/CssBaseline';
import theme from './theme/theme';
import './theme/scss/main.scss';
import { create } from 'jss';
import { StylesProvider, jssPreset } from '@material-ui/core/styles';
import MainLayout from './MainLayout';
import { ISolarisData, ISolarisTimeLine } from '../main/App';
import { StaticsManager } from '../main/StaticsManager';
import ReportCard from '../components/ReportCard/ReportCard';
import DataGridWrapper from '../components/dataGrid/DataGrid';
import ViewLayout from './ViewLayout';
import DataLayout from './DataLayout';
import Header from '../components/Header/Header';



// Configure JSS
const jss = create({ plugins: [...jssPreset().plugins] });

export interface DashboardPropType {
    data: ISolarisTimeLine[]
}


const Dashboard = (props: DashboardPropType) => {

    return (
        <React.Fragment>
            <CssBaseline />
            <StylesProvider jss={jss}>
                <ThemeProvider theme={theme({ navType: "light" })}>
                    <MainLayout>
                        <div className="mainWrapper">
                            <Header title={"Solaris"} />
                            <ViewLayout />
                            <DataLayout />
                        </div>
                    </MainLayout>
                </ThemeProvider>
            </StylesProvider>
        </React.Fragment>
    );
};

export default Dashboard;
