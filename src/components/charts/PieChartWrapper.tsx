import React from 'react';
import PieChart, {
  Series,
  Label,
  Connector,
  SmallValuesGrouping,
  Legend,
  Export
} from 'devextreme-react/pie-chart';
import { IPieChartWrapper } from '../../types/types';



export function PieChartWrapper(props:IPieChartWrapper) {
  return (
    <PieChart
      id={props.id}
      dataSource={props.data}
      palette="Bright"
      title={props.title}
    >
      <Series
        argumentField={props.argumentField}
        valueField={props.valueField}
      >
        <Label visible={true} customizeText={formatLabel} format="fixedPoint">
          <Connector visible={true} width={0.5} />
        </Label>
        {props.nTop ? <SmallValuesGrouping  mode="topN" topCount={props.nTop }/> : <SmallValuesGrouping threshold={props.threshold} mode="smallValueThreshold" />}
      </Series>
      <Legend horizontalAlignment="center" verticalAlignment="bottom" />
      <Export enabled={true} />
    </PieChart>
  );
}

function formatLabel(arg: { argumentText: any; valueText: any; }) {
  return `${arg.argumentText}: ${arg.valueText}`;
}

export default PieChartWrapper;