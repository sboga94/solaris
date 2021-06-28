import React, { useEffect, useState } from 'react';
import DataGridWrapper from '../components/dataGrid/DataGrid';
import { StaticsManager } from '../main/StaticsManager';
import './theme/scss/main.scss';
import LineChartWrapper from '../components/charts/LineChartWrapper';
import SplineChartWrapper from '../components/charts/SplineChartWrapper';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Fade from '@material-ui/core/Fade';
import filter from '../layout/theme/images/filter.svg';


const DataLayout = () => {

    const [activeRow, setActiveRow] = useState(null);
    const [activeFilterDate, setActiveFilterDate] = useState("5/30/2015");
    const [activeSelection, setActiveSelection] = useState(0);
    const [anchorEl, setAnchorEl] = React.useState(null);



    const buttonRenderer = () => {


        const handleClick = (event) => {
            setAnchorEl(event.currentTarget);
        };

        const handleClose = (index) => {
            setActiveSelection(index);
            setAnchorEl(null);
        };

        if (!StaticsManager.isInitialized()) {
            return null;
        }
        return (<div className="buttonWrapper">
            <Button aria-controls="simple-menu" aria-haspopup="true" onClick={handleClick}>
                <div className="menuButton">
                    <img src={filter} />
                </div>
            </Button>
            <Menu
                id="simple-menu"
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                TransitionComponent={Fade}
                onClose={() => handleClose(activeSelection)}
            >
                <MenuItem onClick={() => handleClose(0)}>Total Death</MenuItem>
                <MenuItem onClick={() => handleClose(1)}>Age-Death</MenuItem>
                <MenuItem onClick={() => handleClose(2)}>Diet-Death</MenuItem>
                <MenuItem onClick={() => handleClose(3)}>Taxonomy-Death</MenuItem>
            </Menu>

        </div>)
    }

    const graphRenderer = () => {
        if (!StaticsManager.isInitialized()) {
            return null;
        }
        switch (activeSelection) {
            case 0: {
                let data = StaticsManager.getSolarisTimeLineRecord().map((time: string) => {
                    return { timeLine: time, val: StaticsManager.getCreaturesOnCustomDate(time, (creature) => creature.status == "dead")!.length }
                })
                let props = { id: "deathSpline", argumentField: "timeLine", data: data, title: "Death Graphic" }
                return (<LineChartWrapper {...props} />)
            }
            case 1: {
                const data = StaticsManager.getAttributeOnTimeLine("age", ((creature) => creature.status == "dead"));
                let categories: any[] = [];
                Object.keys(data[0]).map((item) => {
                    if (item != "timeLine") {
                        categories.push({ value: item, name: item })
                    }
                });

                let props = { id: "ageSpline", data: data, categories: categories, title: "Age-Death Graphic", argumentField: "timeLine" }
                return (<SplineChartWrapper {...props} />)
            }
            case 2: {
                const data = StaticsManager.getAttributeOnTimeLine("diet", ((creature) => creature.status == "dead"));
                let categories: any[] = [];
                Object.keys(data[0]).map((item) => {
                    if (item != "timeLine") {
                        categories.push({ value: item, name: item })
                    }
                });
                let props = { id: "dietSpline", data: data, categories: categories, title: "Diet-Death Graphic", argumentField: "timeLine" }
                return (<SplineChartWrapper {...props} />)
            }
            case 3: {
                const data = StaticsManager.getAttributeOnTimeLine("taxonomy", ((creature) => creature.status == "dead"));
                let categories: any[] = [];
                Object.keys(data[0]).map((item, index) => {
                    if (item != "timeLine" && index < 15) {
                        categories.push({ value: item, name: item })
                    }
                });
                let props = { id: "taxonomySpline", data: data, categories: categories, title: "Taxonomy-Death Graphic", argumentField: "timeLine" }
                return (<SplineChartWrapper {...props} />)
            }
        }
    }

    const getColumns = () =>{
        return [
            { field: 'id', headerName: 'ID', width: 90 },
            {
              field: 'status',
              headerName: 'Status',
              type: 'string',
              width: 100,
            },
            {
              field: 'age',
              headerName: 'Age',
              width: 100,
            },
            {
                field: 'diet',
                headerName: 'Diet',
                width: 100,
              },
              {
                field: 'taxonomy',
                headerName: 'Taxonomy',
                width: 250,
              },
          ]
    }

    const graphComponent = () => {
        if (activeRow) {
            let timeLine = StaticsManager.getTimeLineAdventureWithCustomFilter(activeRow!, "status");
            let newData = timeLine.map((el) => { return { timeLine: el.timeLine, val: el.data } })
            let props = { id: "deathSplineLifecycle", argumentField: "timeLine", data: newData, title: "Creature LifeCycle Graphic" }
            return (<LineChartWrapper {...props} />)

        } else {
            return (
                <div>
                    <div>
                        {buttonRenderer()}
                    </div>
                    <div>
                        {graphRenderer()}
                    </div>
                </div>
            )

        }

    }


    const onRowSelection = (params: any) => {
        setActiveRow(params.isSelected ? params.data.id : null)
    }

    const listData = () => {
        if (StaticsManager.isInitialized()) {
            const columns = getColumns();
            const rows = StaticsManager.getSolarisDataWithDate(activeFilterDate || StaticsManager.getSolarisTimeLineRecord()[0]);
            return <DataGridWrapper onRowSelected={onRowSelection} columns={columns} rows={rows || []} pageSize={20} dateOnChange={(value) => setActiveFilterDate(value.toLocaleDateString())} defaultDateValue={activeFilterDate} />
        } else {
            return null;
        }
    }


    return (
        <div className={"dataLayout"}>
            {listData()}
            {graphComponent()}
        </div>
    );
};

export default DataLayout;
