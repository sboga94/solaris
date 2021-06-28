export type ActiveCardId = "totalCreatureCount" | "deathCreatureCount" | "deadCreatureDate" | "mostDeathDiet" | "mostDeathAge"  | "mostDeathTaxonomy" | "mostResistantTaxonomy"
export interface GridCardData {
    id:ActiveCardId,
    primary: any,
    secondary: string;
    color:string;
    onClick:(id:ActiveCardId) => void;
  }

  export interface IPieChartWrapper {
    data:any;
    id:string;
    title:string;
    argumentField:string,
    valueField:string;
    threshold?:number;
    nTop?:number;
   }

   export interface ILineChartWrapper {
    data:any;
    id:string;
    title:string;
    argumentField:string,
   }

   export interface ISplineChartWrapper {
    data:any;
    id:string;
    title:string;
    categories:{value:string,name:string}[],
    argumentField:string;
   }

   export interface IDataGridProps {
    rows: any;
    columns: any;
    pageSize: number;
    onRowSelected: (params: GridRowSelectedParams) => void;
    dateOnChange: (value: Date) => void;
    defaultDateValue: string;
  }
