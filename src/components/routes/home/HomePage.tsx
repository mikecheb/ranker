import React, { useState } from 'react';
import { DATASET } from '/src/data';
import "./style.css";

interface Villager {
  name: string;
  image: string;
}

function VillagerTile(props: {
  selectedVillagers: Set<string>,
  villager: Villager
}) {
  return (
    <div className="villager-tile">
      <div className="villager-tile__image-container">
        <img className="villager-tile__image" src={props.villager.image} />
      </div>
      <div className="villager-tile__name">
      {props.villager.name}</div>
    </div>
  );
}

export default function HomePage() {
  const [selectedVillagers, setSelectedVillagers] = useState(new Set());

  const data = DATASET;
  const villagerTiles = [];
  for (const villager of data) {
    villagerTiles.push(<VillagerTile villager={villager} />);
  }

  return (
    <div>
      <div>
        This is the picker section
        {villagerTiles}

      </div>
      <div>This is the favorites list</div>
    </div>
  );
}
