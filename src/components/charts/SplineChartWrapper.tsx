import React from 'react';
import {
  Chart,
  Series,
  ArgumentAxis,
  CommonSeriesSettings,
  CommonAxisSettings,
  Grid,
  Export,
  Legend,
  Margin,
  Tooltip,
  Label,
  Format
} from 'devextreme-react/chart';
import { ISplineChartWrapper } from '../../types/types.js';

export const App = (props:ISplineChartWrapper) =>{
 
    return (
        <React.Fragment>
          <Chart
            palette="Violet"
            dataSource={props.data}
            title={props.title}
          >
            <CommonSeriesSettings
              argumentField={props.argumentField}
              type={'spline'}
            />
            <CommonAxisSettings>
              <Grid visible={true} />
            </CommonAxisSettings>
            {
              props.categories.map(function(item) {
                return <Series key={item.value} valueField={item.value} name={item.name} />;
              })
            }
            <Margin bottom={20} />
            <ArgumentAxis
              allowDecimals={false}
              axisDivisionFactor={60}
            >
              <Label>
                <Format type="decimal" />
              </Label>
            </ArgumentAxis>
            <Legend
              verticalAlignment="top"
              horizontalAlignment="right"
            />
            <Export enabled={false} />
            <Tooltip enabled={true} />
          </Chart>
        </React.Fragment>
      );
}

export default App;
