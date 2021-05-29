import React from "react";
import {Line, LineChart, Tooltip, XAxis} from "recharts";
import {Loading} from "./Loading";

export default function Sparkline({width, height, data, xKey, yKey, yKey2}) {
    if (data === null || data.length === 0) {
        return <div><Loading/></div>;
    }
    return (<LineChart width={width || 240}
                       height={height || 120}
                       data={data || []}>
        <XAxis dataKey={xKey} domain={['dataMin', 'dataMax']}
               hide={true}
               interval='preserveStartEnd'/>
        <Line type='basis' dataKey={yKey} stroke='#ffc700' strokeWidth={3}
              dot={false} isAnimationActive={false}/>
        {yKey2 && <Line type='basis' dataKey={yKey2} stroke='#D66A6E' strokeWidth={3}
                        dot={false} isAnimationActive={false}/>}
        <Tooltip/>
    </LineChart>);
}