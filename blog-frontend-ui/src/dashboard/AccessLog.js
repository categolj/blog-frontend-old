import React, {Component} from "react";
import {Container, LineChart} from "davi-js";
import 'pivotal-ui/css/border';
import urlProvider from "./urlProvider";

export class AccessLog extends Component {
    ui = `${urlProvider.BLOG_UI}`;

    constructor(props) {
        super(props);
        this.state = {
            data: [],
            loading: false,
        };
    }

    componentDidMount() {
        this.loadFromServer();
        this.timer = setInterval(this.loadFromServer.bind(this), 30 * 60 * 1000);
    }


    componentWillUnmount() {
        clearInterval(this.timer);
    }

    loadFromServer() {
        this.setState({loading: true});
        fetch('https://raw.githubusercontent.com/categolj/accesslog/master/metrics.json')
            .then(result => result.json())
            .then(response => {
                this.setState({
                    data: response.data.result
                });
            })
            .finally(() => {
                this.setState({loading: false});
            });
    }

    static tooltipData(path, x, y, color) {
        return <li
            key={`${path}-${x}`}
            style={{
                listStyleType: 'none',
                color: 'dark-gray'
            }}>
            <span style={{color: color}}>■</span> {path} ... {y}
        </li>
    }

    render() {
        const data = this.state.data;
        return <Container title={{text: "AccessLog"}} loading={this.state.loading}>
            <LineChart
                isPromQL={true}
                zoomEnabled={true}
                data={data}
                promQLSeriesKey={'path'}
                stacked={false}
                customTooltip={x =>
                    <div style={{
                        width: '300px',
                        color: 'black',
                        backgroundColor: 'rgba(200,200,200,0.5)'
                    }} className={'mvxl paxl border border-rounded'}>
                        &nbsp;&nbsp;<strong>{new Date(x[0].x).toLocaleString()}</strong>
                        <ul>{x
                            .filter(d => d.y > 0)
                            .sort((a, b) => b.y - a.y)
                            .map(d => AccessLog.tooltipData(data[d.seriesIndex].metric.path, d.x, d.y, d.color))}</ul>
                    </div>}
                xAxisTickFormat={x => `${new Date(x).toLocaleString()}`}
                showTooltipForAllSeries={true}
                height={300}/>
        </Container>;
    }
}

