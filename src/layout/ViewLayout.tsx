import React, { useState } from 'react';
import PieChartWrapper from '../components/charts/PieChartWrapper';
import ReportCard from '../components/ReportCard/ReportCard';
import { ISolarisData } from '../main/App';
import { StaticsManager } from '../main/StaticsManager';
import { ActiveCardId, GridCardData, IPieChartWrapper } from '../types/types';
import  './theme/scss/main.scss';



const ViewLayout = () => {
  
    const [activeCard,setActiveCard] = useState<ActiveCardId>("totalCreatureCount");
    

    const gridCardComponent = () => {
        if(StaticsManager.isInitialized()) {
           const mostDeathDateInfo = StaticsManager.getTimelineDateWithCustomFilter((creature:ISolarisData) => creature.status == "dead");
           const dietMostDeath = StaticsManager.getCountTypeWithCustomFilter("diet",(creature:ISolarisData) => creature.status == "dead")![0] as {diet:any,count:any};
           const ageMostDeath = StaticsManager.getCountTypeWithCustomFilter("age",(creature:ISolarisData) => creature.status == "dead")![0] as {age:any,count:any};
           const taxonomyMostDeath= StaticsManager.getCountTypeWithCustomFilter("taxonomy",(creature:ISolarisData) => creature.status == "dead")![0] as {taxonomy:any,count:any};
           const resistantTaxonomy= StaticsManager.getResistancyMap()[0] as {taxonomy:any,resistancy:any};
           const creatureCount = {id:"totalCreatureCount" as ActiveCardId,primary: StaticsManager.getCreatureCount(),secondary:"Total number of creatures",color:"orange",onClick:cardOnClick};
           const deathCreatureCount = {id:"deathCreatureCount" as ActiveCardId,primary:StaticsManager.getCreaturesWithCustomFilter((creature:ISolarisData) => creature.status == "dead").length,secondary:"Total number of dead creatures",color:"red",onClick:cardOnClick};
           const mostDeathDate = {id:"deadCreatureDate" as ActiveCardId,primary:mostDeathDateInfo?.date + "-" +mostDeathDateInfo.count,secondary:"The day with the most deaths",color:"blue",onClick:cardOnClick};
           const mostDeathDiet = {id:"mostDeathDiet" as ActiveCardId,primary:dietMostDeath.diet + " - " + dietMostDeath.count,secondary:"The diet with the most deaths",color:"green",onClick:cardOnClick};
           const mostDeathAge = {id:"mostDeathAge" as ActiveCardId,primary:ageMostDeath.age + " - " + ageMostDeath.count,secondary:"The age with the most deaths",color:"yellow",onClick:cardOnClick};
           const mostDeathTaxonomy = {id:"mostDeathTaxonomy" as ActiveCardId,primary:taxonomyMostDeath.taxonomy + " - " + taxonomyMostDeath.count,secondary:"The taxonomy with the most deaths",color:"purple",onClick:cardOnClick};
           const leastResistantTaxonomy = {id:"mostResistantTaxonomy" as ActiveCardId,primary:resistantTaxonomy.taxonomy + " - " + resistantTaxonomy.resistancy,secondary:"The most durable taxonomy",color:"turquoise",onClick:cardOnClick};
           const infos:GridCardData[] =[creatureCount,deathCreatureCount,mostDeathDate,mostDeathDiet,mostDeathAge,mostDeathTaxonomy,leastResistantTaxonomy];
           return (<div className="gridLayout">
               {infos.map((info:GridCardData) => {return <ReportCard {...info}/>})}
               </div>)
        }else{
            return null;
        } 
   }

   const cardOnClick = (id:ActiveCardId) => {
    setActiveCard(id);
   }

   const getPieData = (id:ActiveCardId):IPieChartWrapper => {

       switch(id){
           case "totalCreatureCount": return {id:id,title:"Creature Graphic",data:StaticsManager.getStatusCountMapWithCustomFilter(),argumentField:"status",valueField:"count",threshold:1}
           case "deathCreatureCount": return {id:id,title:"Dead Creature Graphic",data:StaticsManager.getStatusCountMapWithCustomFilter(),argumentField:"status",valueField:"count",threshold:1}
           case "deadCreatureDate": return {id:id,title:"Most Deaths Day",data:StaticsManager.getDifferenceOnTimeLine((creature) => creature.status == "dead"),argumentField:"timeLine",valueField:"count",threshold:10}
           case "mostDeathDiet": return {id:id,title:"Most Deaths Day-Diet",data:StaticsManager.getDietCountMapWithCustomFilter((creature) => creature.status == "dead"),argumentField:"diet",valueField:"count",threshold:1}
           case "mostDeathAge": return {id:id,title:"Most Deaths Day-Age",data:StaticsManager.getAgeCountMapWithCustomFilter((creature) => creature.status == "dead"),argumentField:"age",valueField:"count",threshold:1}
           case "mostDeathTaxonomy": return {id:id,title:"Most Deaths Day-Taxonomy",data:StaticsManager.getTaxonomyCountMapWithCustomFilter((creature) => creature.status == "dead"),argumentField:"taxonomy",valueField:"count",threshold:30}
           case "mostResistantTaxonomy": return {id:id,title:"Most Durable Taxonomy",data:StaticsManager.getResistancyMap(),argumentField:"taxonomy",valueField:"resistancy",nTop:20}
       }
   }

   const pieComponent = () => {
    if(!StaticsManager.isInitialized()){
        return null;
     }
       let data = getPieData(activeCard);
      return (
          <div className="chartLayout">
              <PieChartWrapper {...data}/>
          </div>
          
      )
    }
   
    return (
        <div className={"viewLayout"}>
            {gridCardComponent()}
            {pieComponent()}
        </div>
    );
};

export default ViewLayout;
