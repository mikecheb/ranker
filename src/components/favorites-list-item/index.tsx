import * as React from "react";
import { Villager } from "../routes/home/HomePage";

interface PublicProps {
    rank: number;
    villager: Villager;
}

export const FavoritesListItem = (props: PublicProps) => {
    return (<div className="favorites-list-item">
        #{props.rank}: {props.villager.name}
        <img src={props.villager.url} />
    </div>);
}