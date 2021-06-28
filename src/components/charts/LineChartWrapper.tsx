import React from 'react';
import SelectBox from 'devextreme-react/select-box';
import {
  Chart,
  Series,
  ArgumentAxis,
  Legend,
  Label
} from 'devextreme-react/chart';
import { ILineChartWrapper } from '../../types/types';


export const LineChartWrapper = (props:ILineChartWrapper) => {
  
    return (
      <React.Fragment>
        <Chart
          id={props.id}
          dataSource={props.data}
          title={props.title}
        >
          <Series argumentField={props.argumentField} />
          <ArgumentAxis>
            <Label
              wordWrap="none"
              overlappingBehavior={'stagger'}
            />
          </ArgumentAxis>
          <Legend visible={false} />
        </Chart>
      </React.Fragment>
    );
  
}

export default LineChartWrapper;
