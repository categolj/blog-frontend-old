import React, {Component} from "react";
import {Container, LineChart} from "davi-js";
import urlProvider from "../urlProvider";

export class SLI extends Component {
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
        this.timer = setInterval(this.loadFromServer.bind(this), 30 * 1000);
    }


    componentWillUnmount() {
        clearInterval(this.timer);
    }

    loadFromServer() {
        this.setState({loading: true});
        fetch(`${this.ui}/dashboard/sli?instance=https://blog.ik.am,https://blog-api.ik.am/actuator/health,https://note.ik.am/actuator/health`)
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
        return <Container
            title={{text: "Uptime SLI / ErrorBudget (SLO = 95% for last 7 days)"}}
            loading={this.state.loading}>
            <LineChart
                isPromQL={true}
                zoomEnabled={true}
                data={this.state.data}
                promQLSeriesKey={'instance'}
                thresholds={[{label: 'critical', value: 95}]}
                xAxisTooltipFormat={x => `${new Date(x).toLocaleString()}`}
                yAxisTooltipFormat={y => `SLI: ${Math.round(y * 1000) / 1000} %, Error Budget: ${Math.round((y / 100 - 0.95) * (7 * 24 * 60) * 10) / 10} min`}
                yAxisTickFormat={y => `${Math.round(y * 1000) / 1000} %`}
                height={300}/>
        </Container>;
    }
}

