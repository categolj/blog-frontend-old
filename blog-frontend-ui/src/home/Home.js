import React from "react";
import {Panel} from 'pivotal-ui/react/panels';
import {LatestEntries} from "./LatestEntries";
import {SeriesList} from "../series/SeriesList";
import {Presentations} from "./Presentations";
import {GitHub} from "./GitHub";

export function Home({renderedContent}) {
    return (<Panel>
        <h2>Home</h2>
        <SeriesList/>
        <LatestEntries renderedContent={renderedContent}/>
        <GitHub/>
        <Presentations/>
    </Panel>);
}