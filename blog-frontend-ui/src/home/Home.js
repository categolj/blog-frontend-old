import React, {useEffect, useState} from "react";
import {Panel} from 'pivotal-ui/react/panels';
import {LatestEntries} from "./LatestEntries";
import {SeriesList} from "../series/SeriesList";
import {Presentations} from "./Presentations";
import {GitHub} from "./GitHub";
import readCountService from "../entries/ReadCountService";
import Sparkline from "../components/Sparkline";

export function Home({renderedContent}) {
    const [readCounts, setReadCounts] = useState([]);
    useEffect(() => {
        readCountService.readCountAll()
            .then(result =>
                setReadCounts(result.map(x => {
                    return {
                        timestamp: new Date(x.timestamp).toLocaleString(),
                        count: x.count
                    }
                })));
    }, []);
    return (<Panel>
        <h2>Home</h2>
        <LatestEntries renderedContent={renderedContent}/>
        <SeriesList/>
        <GitHub/>
        <Presentations/>
        <h3 id="access-rate">Access Rate</h3>
        <Sparkline data={readCounts}
                   width={320}
                   height={60}
                   xKey='timestamp'
                   yKey='count'/>
    </Panel>);
}