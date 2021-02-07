import * as React from "react";
import { Villager } from "../routes/home/HomePage";

export function VillagerTile(props: {
    onClick: (villagerName: string) => void;
    selectedVillagers: Set<string>;
    villager: Villager;
  }) {
    const isVillagerSelected = props.selectedVillagers.has(props.villager.name);
  
    const className = `villager-tile ${isVillagerSelected ? "villager-tile--selected" : ""}`;
  
    return (
      <div className={className} onClick={() => props.onClick(props.villager.name)}>
        <div className="villager-tile__image-container">
          <img className="villager-tile__image" src={props.villager.url} />
        </div>
        <div className="villager-tile__name">
        {props.villager.name}</div>
      </div>
    );
  }
  