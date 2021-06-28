import { DataGrid, GridRowSelectedParams, GridRowId } from '@material-ui/data-grid';
import React from 'react';
import { IDataGridProps } from '../../types/types';
import DateField from '../dateField/DateField';





export const DataGridWrapper = (props: IDataGridProps) => {
  const [selectionModel, setSelectionModel] = React.useState<GridRowId[]>([]);
  return (
    <div className="dataGridWrapper">
      <div>
        <DateField defaultValue={new Date(props.defaultDateValue)} onChangeFunc={props.dateOnChange} />
      </div>
      <div style={{ height: 400, width: '85%' }}>
        <DataGrid
          rows={props.rows}
          columns={props.columns}
          pageSize={props.pageSize}
          checkboxSelection
          selectionModel={selectionModel}
          onRowSelected={props.onRowSelected}
          onSelectionModelChange={(selection) => {
            const newSelectionModel = selection.selectionModel;
            if (newSelectionModel.length > 1) {
              const selectionSet = new Set(selectionModel);
              const result = newSelectionModel.filter(
                (s) => !selectionSet.has(s)
              );
              setSelectionModel(result);
            } else {
              setSelectionModel(newSelectionModel);
            }
          }}
        />
      </div></div>)
}
export default DataGridWrapper;