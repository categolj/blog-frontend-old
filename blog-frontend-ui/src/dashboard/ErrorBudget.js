import React, {Component} from "react";
import {Container, LineChart} from "davi-js";

export class ErrorBudget extends Component {
    ui = `${process.env.REACT_APP_BLOG_UI}`;

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
        fetch(`${this.ui}/dashboard/error_budget?instance=https://blog.ik.am,https://blog-api.ik.am/actuator/health&slo=0.995`)
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
        return <Container title={{text: "Error Budget Remaining (min)"}} loading={this.state.loading}>
            <LineChart
                isPromQL={true}
                zoomEnabled={true}
                data={this.state.data}
                promQLSeriesKey={'instance'}
                thresholds={[{label: 'critical', value: 0}]}
                xAxisTooltipFormat={x => `${new Date(x).toLocaleString()}`}
                yAxisTooltipFormat={y => `${y} min`}
                height={300}/>
        </Container>;
    }
}

