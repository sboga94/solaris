import { StringifyOptions } from "querystring";
import { textChangeRangeIsUnchanged } from "typescript";
import { ISolarisData, ISolarisTimeLine } from "./App";

 export class StaticsManager {

    private static timeLineMap: Map<string,ISolarisData[]> = new Map<string,ISolarisData[]>();
    private static solarisTimeLineRecord:string[] = []
    private static lastSolarisRecords:ISolarisData[] = [];
    private static initialized = false;
    static init(data:ISolarisTimeLine[]):Promise<Boolean>{
        return new Promise((resolve) => {
            if(StaticsManager.isInitialized()) {
                console.error("StaticsManager is already initialized");
            }else{
                data.map((item:ISolarisTimeLine,index:number) => {
                    StaticsManager.timeLineMap.set(item.timeLine,item.solarisDatas);
                    StaticsManager.solarisTimeLineRecord.push(item.timeLine);
                    if(index == data.length -1) {
                        StaticsManager.lastSolarisRecords = item.solarisDatas;
                    }
                })
            } 
            StaticsManager.initialized = true;
            resolve(true);
        })
    }

    static isInitialized () {
        return StaticsManager.initialized;
    }

    static getCreatureCount(){
        return StaticsManager.lastSolarisRecords.length;
    }

    static getTimeLineAdventureWithCustomFilter(id:number,filterAttribute:string) {
        let customArr: { timeLine: string; data: ISolarisData | undefined}[] = [];
        StaticsManager.getSolarisTimeLineRecord().map((item:string) => {
            const creature:any[] = StaticsManager.getCreaturesOnCustomDate(item)?.filter((creature) =>  creature.id === id) as any[];
            const attributeValue = creature ? creature[0][filterAttribute as any] : undefined;
            customArr.push({timeLine:item ,data:attributeValue})
        })
        return customArr;
    }

    static getCreaturesWithCustomFilter(filterFunc?:(creature:ISolarisData) => boolean ) {
        return filterFunc ? StaticsManager.lastSolarisRecords.filter(filterFunc) : StaticsManager.lastSolarisRecords;
    }

    static getDietCountMapWithCustomFilter(filterFunc?:(creature:ISolarisData) => boolean, customSolarisData?:ISolarisData[]) {
        const records:ISolarisData[] =  customSolarisData ?  customSolarisData : StaticsManager.getCreaturesWithCustomFilter(filterFunc);
        return Object.values(records.reduce((a, {diet}) => {
            a[diet] = a[diet] || {diet, count: 0};
            a[diet].count++;
            return a;
          }, Object.create(null))).sort((a:any, b:any) => (a.count > b.count) ? -1 : 1);;
    }

    static getStatusCountMapWithCustomFilter(filterFunc?:(creature:ISolarisData) => boolean , customSolarisData?:ISolarisData[]) {
        const records:ISolarisData[] =  customSolarisData ? customSolarisData : StaticsManager.getCreaturesWithCustomFilter(filterFunc);
        return Object.values(records.reduce((a, {status}) => {
            a[status] = a[status] || {status, count: 0};
            a[status].count++;
            return a;
          }, Object.create(null))).sort((a:any, b:any) => (a.count > b.count) ? -1 : 1);;
    }

    static getAgeCountMapWithCustomFilter(filterFunc?:(creature:ISolarisData) => boolean , customSolarisData?:ISolarisData[]) {
        const records:ISolarisData[] =  customSolarisData ? customSolarisData : StaticsManager.getCreaturesWithCustomFilter(filterFunc);
        return Object.values(records.reduce((a, {age}) => {
            a[age] = a[age] || {age, count: 0};
            a[age].count++;
            return a;
          }, Object.create(null))).sort((a:any, b:any) => (a.count > b.count) ? -1 : 1);
    }

    static getTaxonomyCountMapWithCustomFilter(filterFunc?:(creature:ISolarisData) => boolean , customSolarisData?:ISolarisData[]) {
        const records:ISolarisData[] =  customSolarisData ? customSolarisData : StaticsManager.getCreaturesWithCustomFilter(filterFunc);
        let values:{taxonomy:string,count:number}[] = [];
        records.map((item:ISolarisData) => {
            item.taxonomy.map((tx) => {
                let foundedTx =  values.find((el) => el.taxonomy == tx);
                if(foundedTx) {
                    foundedTx.count++;
                }else{
                    values.push({taxonomy:tx,count:1});
                }
            })
        })
        return values.sort((a:any, b:any) => (a.count > b.count) ? -1 : 1);
    }

    static getResistancyMap():{taxonomy:string,resistancy:number}[] {
       let fullTaxonomy = StaticsManager.getTaxonomyCountMapWithCustomFilter()
       let aliveTaxonomy = StaticsManager.getTaxonomyCountMapWithCustomFilter((creature) => creature.status == "alive");
       let resistancyMap:{taxonomy:string,resistancy:number}[] =[];
        aliveTaxonomy.map((tx) =>  {
           const resistancy = tx.count / (fullTaxonomy.find((atx) => atx.taxonomy == tx.taxonomy)!.count);
           resistancyMap.push({taxonomy: tx.taxonomy,resistancy:resistancy});
           })
       return resistancyMap.sort((a:any, b:any) => (a.resistancy > b.resistancy) ? -1 : 1);
    }

    static getCountTypeWithCustomFilter(filterValue:string,filterFunc?:(creature:ISolarisData) => boolean,solarisData?:ISolarisData[]) {
        switch(filterValue){
            case "diet" :{
                return StaticsManager.getDietCountMapWithCustomFilter(filterFunc,solarisData);
            }
            case "age" :{
                return StaticsManager.getAgeCountMapWithCustomFilter(filterFunc,solarisData);
            }
            case "status" :{
                return StaticsManager.getStatusCountMapWithCustomFilter(filterFunc,solarisData);
            }  
            case "taxonomy" :{
                return StaticsManager.getTaxonomyCountMapWithCustomFilter(filterFunc,solarisData);
            }          
        }
    }

    static getCreaturesOnCustomDate(date:string,filterFunc?:(creature:ISolarisData) => boolean) {
        const solarisData:ISolarisData[] | undefined = StaticsManager.timeLineMap.get(date);
        return filterFunc ? solarisData?.filter(filterFunc): solarisData;
    }

    static getTimelineDateWithCustomFilter(filterFunc:(creature:ISolarisData) => boolean):{arr: number[] ,date: string,count: number} {
        let filterCount = 0;
        let differenceArr:number[] = [];
        StaticsManager.timeLineMap.forEach((solarisData:ISolarisData[],timeLine:string) => {
            let currentFilterCount = solarisData.filter(filterFunc).length;
            const difference = currentFilterCount - filterCount;
            filterCount = currentFilterCount;
            if(differenceArr.length == 0) {
                differenceArr.push(0);
            }else {
                differenceArr.push(difference);
            }
        })
        return {arr:differenceArr,date:StaticsManager.solarisTimeLineRecord[differenceArr.reduce((iMax, x, i, arr) => x > arr[iMax] ? i : iMax, 0)],count:Math.max(...differenceArr)};
    }

    static getDifferenceOnTimeLine(filterFunc:(creature:ISolarisData) => boolean) {
        let timelineMap:{timeLine:string,count:number}[] = [];
        let differenceInfo =StaticsManager.getTimelineDateWithCustomFilter(filterFunc);
        differenceInfo.arr.map((el:number,index:number) => {
            const data = StaticsManager.solarisTimeLineRecord[index];
            timelineMap.push({timeLine:data,count:el})
        })
        return timelineMap;
    }

    static getAttributeOnTimeLine(stringAttribute:string,filterFunc:(creature:ISolarisData) => boolean) {
        let timelineFlow:any[]= [];
        StaticsManager.timeLineMap.forEach((solarisData:ISolarisData[],timeLine:string) => {
            let filteredData = solarisData.filter(filterFunc);
            let countMap = StaticsManager.getCountTypeWithCustomFilter(stringAttribute,filterFunc,filteredData)
            let obj = StaticsManager.convertArrayToObject(countMap,stringAttribute,'count');
            obj.timeLine = timeLine;
            timelineFlow.push(obj);
        })
        return timelineFlow;
    }

    

    static getSolarisTimeLineRecord(){
        return StaticsManager.solarisTimeLineRecord;
    }

    static getSolarisDataWithDate(date:string) {
        return StaticsManager.timeLineMap.get(date);
    }

    static convertArrayToObject = (array, key1,key2) => {
        const initialValue = {};
        return array.reduce((obj, item) => {
          return {
            ...obj,
            [item[key1]]: item[key2],
          };
        }, initialValue);
      };

    
}