import React, { useRef, useState } from 'react';
import { DATASET } from '/src/villagers';
import "/src/components/routes/home/style.css";
import { VillagerTile } from '/src/components/villager-tile';
import { FavoritesListItem } from '/src/components/favorites-list-item';

export interface Villager {
  name: string;
  url: string;
}

class FavesGraph {
  public rankedFavorites: string[] = [];
  private eliminators: Record<string, Set<string>> = {};
  private nodes: Set<string>;
  private batch: string[] = [];

  constructor(ids: string[]) {
    this.loadData();
    this.nodes = new Set(ids);
  }

  public saveData() {
    const eliminatorsWithArrays = {};
    for (const k in this.eliminators) {
      eliminatorsWithArrays[k] = new Array(...this.eliminators[k]);
    }

    localStorage.setItem("blob", JSON.stringify({
      rankedFavorites: this.rankedFavorites,
      eliminators: eliminatorsWithArrays,
      batch: this.batch
    }));
  }

  private loadData() {
    const blob = localStorage.getItem("blob");
    if (!blob) {
      return;
    }

    const data = JSON.parse(blob);
    this.rankedFavorites = data.rankedFavorites;
    this.batch = data.batch;
    for (const k in data.eliminators) {
      this.eliminators[k] = new Set(data.eliminators[k]);
    }
  }

  public getCurrentBatch() {
    if (this.batch.length === 0) {
      this.generateNextBatch();
    }

    return this.batch;
  }

  public pick(picks: Set<string>) {
    // TODO Validation that the picked villagers are even part of the batch.
    // Update the eliminators graph.
    const eliminated = new Set(this.batch);
    picks.forEach(pick => eliminated.delete(pick));

    picks.forEach(pick => {
      if (!this.eliminators[pick]) {
        this.eliminators[pick] = new Set();
      }

      eliminated.forEach(e => {
        this.eliminators[pick].add(e);
      });
    });

    // Check for new faves.
    while (this.getUneliminated().size === 1) {
      const newFave = this.getUneliminated().entries().next().value[0];
      this.rankedFavorites.push(newFave);
      this.remove(newFave);
    }

    // Empty the batch.
    this.batch = [];
    this.saveData();
  }

  private remove(id: string) {
    delete this.eliminators[id];
  }

  private getUneliminated() {
    // Find all the uneliminated villagers.
    const uneliminated = new Set(this.nodes);
    for (let rankedFavorite of this.rankedFavorites) {
      uneliminated.delete(rankedFavorite);
    }

    const eliminatorNames = Object.keys(this.eliminators);
    for (let eliminator of eliminatorNames) {
      const eliminated = this.eliminators[eliminator];
      eliminated.forEach((name) => uneliminated.delete(name));
    }

    return uneliminated;
  }

  private generateNextBatch() {
    const uneliminated = this.getUneliminated();    

    // If more than 10, pick the first 10.
    // Divide the bag into 3rds, but maximum of 10

    const batch = [];
    let bag = [...uneliminated];
    let pickCount = Math.max(2, Math.floor(bag.length / 3));
    pickCount = Math.min(10, pickCount);
    for (let i = 0; i < pickCount; i++) {
      const index = Math.floor(Math.random() * bag.length);
      batch.push(bag[index]);
      bag.splice(index, 1);
    }

    this.batch = batch;
    this.saveData();

    // TODO Handle empty list.
  }
}

export default function HomePage() {
  const data = DATASET;
  const villagerMap = {};
  for (let villager of data) {
    villagerMap[villager.name] = villager;
  }
  const names = data.map(villager => villager.name);
  debugger;
  console.log(names);
  const graphRef = useRef(new FavesGraph(names))
  const graph = graphRef.current;

  const [batch, setBatch] = useState(graph.getCurrentBatch());
  const [selectedVillagers, setSelectedVillagers] = useState(new Set<string>());

  function updateSelectedVillagers(villagerName: string) {
    const isVillagerSelected = selectedVillagers.has(villagerName);
    if (isVillagerSelected) {
      selectedVillagers.delete(villagerName);
    } else {
      selectedVillagers.add(villagerName);
    }

    setSelectedVillagers(new Set(selectedVillagers));
  }

  const villagerTiles = [];
  for (const villagerName of batch) {
    const villager = villagerMap[villagerName];
    villagerTiles.push(
      <VillagerTile
        key={villager.name}
        onClick={updateSelectedVillagers}
        selectedVillagers={selectedVillagers}
        villager={villager}
      />);
  }

  const favoritesList = [];
  for (let i = 0; i < graph.rankedFavorites.length; i++) {
    const villager = villagerMap[graph.rankedFavorites[i]];
    favoritesList.push(
      <FavoritesListItem
        key={villager.name}
        rank={i + 1}
        villager={villager}
      />
    );
  }

  return (
    <div>
      <div className="grid">
        {villagerTiles}
      </div>
      <button onClick={() => {
        graph.pick(selectedVillagers);
        setBatch(graph.getCurrentBatch());
        setSelectedVillagers(new Set());
      }}>Pick</button>
      <button
        onClick={() => {
          localStorage.removeItem("blob");
          graphRef.current = new FavesGraph(names);
          setBatch(graphRef.current.getCurrentBatch());
          setSelectedVillagers(new Set());
        }}
      >Reset</button>
      <div>
        This is the favorites list:
        {favoritesList}
      </div>
    </div>
  );
}
