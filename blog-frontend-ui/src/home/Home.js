import React, {useEffect, useState} from "react";
import {Panel} from 'pivotal-ui/react/panels';
import {LatestEntries} from "./LatestEntries";
import {SeriesList} from "../series/SeriesList";
import {Presentations} from "./Presentations";
import {GitHub} from "./GitHub";
import readCountService from "../entries/ReadCountService";
import Sparkline from "../components/Sparkline";
import {Helmet} from "react-helmet-async";

export function Home({renderedContent}) {
    const [readCounts, setReadCounts] = useState([]);
    useEffect(() => {
        readCountService.readCountAll()
            .then(result =>
                setReadCounts(result.map(x => {
                    return {
                        timestamp: new Date(x.timestamp).toLocaleString(),
                        browser: (x.browser || 0),
                        total: (x.browser || 0) + (x.nonBrowser || 0)
                    }
                })));
    }, []);
    return (<Panel>
        <Helmet prioritizeSeoTags>
            <meta property="og:title" content="IK.AM"/>
            <meta property="og:type" content="blog"/>
            <meta property="og:description" content="@making's tech note"/>
            <meta property="og:url" content="https://ik.am"/>
            <meta property="twitter:title" content="IK.AM"/>
            <meta property="twitter:description" content="@making's tech note"/>
            <meta property="twitter:url" content="https://ik.am"/>
        </Helmet>
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
                   yKey='browser'/>
    </Panel>);
}