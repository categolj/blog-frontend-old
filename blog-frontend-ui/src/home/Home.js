import React, {useEffect, useState} from "react";
import {Panel} from 'pivotal-ui/react/panels';
import {LatestEntries} from "./LatestEntries";
import {SeriesList} from "../series/SeriesList";
import {Presentations} from "./Presentations";
import {GitHub} from "./GitHub";
import readCountService from "../entries/ReadCountService";
import Sparkline from "../components/Sparkline";
import {Helmet} from "react-helmet-async";

function sumSince(result, date) {
    return result.filter((x) => x.browser > 0 &&
        new Date(x.timestamp).getTime() >= date.getTime())
        .map(x => x.browser)
        .reduce((x, y) => x + y, 0);
}

function resetHMS(date) {
    date.setHours(0);
    date.setMinutes(0);
    date.setSeconds(0);
    return date;
}

export function Home({renderedContent}) {
    const [readCounts, setReadCounts] = useState({
        sumOfToday: 0,
        sumOfYesterday: 0,
        sumOfDayBeforeYesterday: 0,
        sumOfThisWeek: 0,
        results: []
    });
    useEffect(() => {
        readCountService.readCountAll()
            .then(result => {
                const today = resetHMS(new Date());
                const yesterday = resetHMS(new Date());
                const dayBeforeYesterday = resetHMS(new Date());
                const startOfThisWeek = resetHMS(new Date());
                yesterday.setDate(today.getDate() - 1);
                dayBeforeYesterday.setDate(yesterday.getDate() - 1);
                startOfThisWeek.setDate(today.getDate() - today.getDay());
                const sumOfToday = sumSince(result, today);
                const sumOfYesterday = sumSince(result, yesterday) - sumOfToday;
                const sumOfDayBeforeYesterday = sumSince(result, dayBeforeYesterday) - sumOfToday - sumOfYesterday;
                const sumOfThisWeek = sumSince(result, startOfThisWeek);
                setReadCounts({
                    results: result.map(x => {
                        return {
                            timestamp: new Date(x.timestamp).toLocaleString(),
                            browser: (x.browser || 0),
                            total: (x.browser || 0) + (x.nonBrowser || 0)
                        }
                    }),
                    sumOfToday: sumOfToday,
                    sumOfYesterday: sumOfYesterday,
                    sumOfDayBeforeYesterday: sumOfDayBeforeYesterday,
                    sumOfThisWeek: sumOfThisWeek,
                });
            });
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
        <Sparkline data={readCounts.results}
                   width={640}
                   height={100}
                   xKey='timestamp'
                   yKey='browser'/>
        <dl>
            <dt>Today</dt>
            <dd>{readCounts.sumOfToday}</dd>
            <dt>Yesterday</dt>
            <dd>{readCounts.sumOfYesterday}</dd>
            <dt>Day before yesterday</dt>
            <dd>{readCounts.sumOfDayBeforeYesterday}</dd>
            <dt>This week</dt>
            <dd>{readCounts.sumOfThisWeek}</dd>
        </dl>
    </Panel>);
}