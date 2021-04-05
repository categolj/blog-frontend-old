import React, {Component} from "react";
import {Container, LineChart} from "davi-js";
import urlProvider from "../urlProvider";

export class JvmMemoryUsedBytes extends Component {
    ui = `${urlProvider.BLOG_UI}`;

    constructor(props) {
        super(props);
        this.application = props.application;
        this.state = {
            data: [],
            loading: false,
        };
    }

    componentDidMount() {
        this.loadFromServer();
        this.timer = setInterval(this.loadFromServer.bind(this), 30 * 1000);
    }


    componentWillUnmount() {
        clearInterval(this.timer);
    }

    loadFromServer() {
        this.setState({loading: true});
        fetch(`${this.ui}/dashboard/jvm_memory_used_bytes?application=${this.application}`)
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

    render() {
        return <Container title={{text: `JVM Memory Used Bytes (${this.application})`}}
                          loading={this.state.loading}>
            <LineChart
                isPromQL={true}
                zoomEnabled={true}
                data={this.state.data}
                promQLSeriesKey={d => {
                    const metrics = d.metric;
                    return `${metrics.kubernetes_pod_name}/${metrics.area}`;
                }}
                xAxisTooltipFormat={x => `${new Date(x).toLocaleString()}`}
                yAxisTooltipFormat={toMegaByte}
                yAxisTickFormat={toMegaByte}
                height={300}/>
        </Container>;
    }
}

const toMegaByte = y => `${Math.round((y / 1024 / 1024) * 10) / 10} MB`;
