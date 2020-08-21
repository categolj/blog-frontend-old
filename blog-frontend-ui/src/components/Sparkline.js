import React from "react";
import {Line, LineChart, Tooltip, XAxis} from "recharts";

export default function Sparkline({width, height, data, xKey, yKey}) {
    return (<LineChart width={width || 240}
                       height={height || 120}
                       data={data || []}>
        <XAxis dataKey={xKey} domain={['dataMin', 'dataMax']}
               hide={true}
               interval='preserveStartEnd'/>
        <Line type='basis' dataKey={yKey} stroke='#ffc700' strokeWidth={3}
              dot={false} isAnimationActive={false}/>
        <Tooltip/>
    </LineChart>);
}