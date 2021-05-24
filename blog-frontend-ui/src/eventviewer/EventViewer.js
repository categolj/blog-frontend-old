import React from "react";
import 'pivotal-ui/css/ellipsis';
import {Panel} from "pivotal-ui/react/panels";
import {Table, Tbody, Td, Th, Thead, Tr} from 'pivotal-ui/react/table';
import {Form} from 'pivotal-ui/react/forms';
import {Input} from 'pivotal-ui/react/inputs';
import {FlexCol, Grid} from 'pivotal-ui/react/flex-grids';
import {DefaultButton} from 'pivotal-ui/react/buttons';
import {Icon} from 'pivotal-ui/react/iconography';
import {Tab, Tabs} from 'pivotal-ui/react/tabs';

export class EventViewer extends React.Component {
    state = {
        events: [],
        sortColumn: null,
        sortOrder: {
            startTime: -1,
            duration: -1,
            endTime: -1,
            eventName: -1,
        },
        filterEventName: 'all',
    };

    async componentDidMount() {
    }

    reset() {
        this.setState({
            events: [],
            sortColumn: null,
            sortOrder: {
                startTime: -1,
                duration: -1,
                endTime: -1,
                eventName: -1,
            },
            filterEventName: 'all',
        });
    }

    render() {
        const eventNames = Array.from(new Set(this.state.events.map(event => event.startupStep.name)));
        const filteredEvents = (this.state.events && this.state.events
            .filter(event => this.state.filterEventName === 'all' || this.state.filterEventName === event.startupStep.name)) || [];
        return (<Panel>
                <h2 id="eventviewer" className={"home"}>Spring Boot Startup Event
                    Viewer</h2>
                <ul>
                    <li>
                        <a href={"https://docs.spring.io/spring-framework/docs/5.3.x/reference/html/core.html#context-functionality-startup"}>
                            Reference</a>
                    </li>
                    <li><a
                        href={"https://docs.spring.io/spring-boot/docs/2.4.x/actuator-api/htmlsingle/#startup"}>
                        API Document</a>
                    </li>
                </ul>
                Requires Spring Boot 2.4.0 + and following configurations
                <pre><code>{`    public static void main(String[] args) {
        new SpringApplicationBuilder(YourMainClass.class)
            .applicationStartup(new BufferingApplicationStartup(2048)) // <-- Here
            .run(args);
    }`}</code></pre> in <code>YourMainClass.java</code>.

                <Tabs defaultActiveKey={1}>
                    <Tab eventKey={1} title="Online Viewer">
                        Allow CORS form this tool
                        in <code>application.properties</code> as follows
                        <pre><code>
                        management.endpoints.web.exposure.include=startup<br/>
                        management.endpoints.web.cors.allowed-origins={document.location.origin}<br/>
                        management.endpoints.web.cors.allowed-methods=POST
                        </code></pre>
                        <br/>
                        <Form {...{
                            onSubmit: ({initial, current}) => this.loadEvents(current),
                            onSubmitError: e => this.handleError(e),
                            fields: {
                                url: {
                                    children: <Input
                                        placeholder="http://localhost:8080/actuator/startup"/>
                                },
                            }
                        }}>
                            {({fields, canSubmit, onSubmit}) => {
                                return (
                                    <div>
                                        <Grid>
                                            <FlexCol>{fields.url}</FlexCol>
                                            <FlexCol>
                                                <DefaultButton
                                                    type="submit">View
                                                    Events</DefaultButton>
                                            </FlexCol>
                                        </Grid>
                                    </div>
                                );
                            }}
                        </Form>
                    </Tab>
                    <Tab eventKey={2} title="Offline Viewer">
                        Paste the result of the following command
                        <pre><code>curl -XPOST http://localhost:8080/actuator/startup</code></pre>
                        <br/>
                        <textarea placeholder="Paste JSON"
                                  onChange={event => this.parseEvents(JSON.parse(event.target.value))}></textarea>
                    </Tab>
                </Tabs>
                <p>
                    The number of events is <strong>{filteredEvents.length}</strong>.
                    &nbsp;<DefaultButton small
                                         onClick={() => this.reset()}>Reset</DefaultButton>
                </p>
                <Table className="pui-table--tr-hover">
                    <Thead>
                        <Tr>
                            <Th style={{width: '3%'}}>Id</Th>
                            <Th style={{width: '3%'}}>Parent Id</Th>
                            <Th style={{width: '12%'}}
                                onClick={() => this.sortBy('startTime', x => x.startTime)}>Start
                                Time
                                <Icon className="float-right"
                                      src={this.sortIcon('startTime')}/></Th>
                            <Th style={{width: '8%'}}
                                onClick={() => this.sortBy('duration', x => x.duration)}>Duration
                                <Icon className="float-right"
                                      src={this.sortIcon('duration')}/>
                            </Th>
                            <Th style={{width: '12%'}}
                                onClick={() => this.sortBy('endTime', x => x.endTime)}>End
                                Time
                                <Icon className="float-right"
                                      src={this.sortIcon('endTime')}/></Th>
                            <Th style={{width: '15%'}}>Event
                                <span
                                    onClick={() => this.sortBy('eventName', x => x.startupStep.name)}>
                                    Name
                                    <Icon className="float-right"
                                          src={this.sortIcon('eventName')}/>
                                </span>
                                <br/>
                                <select
                                    onChange={event => this.setFilterEventName(event.target.value)}>
                                    <option value="all">all</option>
                                    {eventNames.map(name => <option key={name}
                                                                    value={name}>{name}</option>)}
                                </select>
                            </Th>
                            <th>Tags</th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {
                            filteredEvents.map(event =>
                                <Tr key={event.startupStep.id}
                                    id={`event-${event.startupStep.id}`}>
                                    <Td>{event.startupStep.id}</Td>
                                    <Td>{event.startupStep.parentId > 0 &&
                                    <a href={`#event-${event.startupStep.parentId}`}>{event.startupStep.parentId}</a>}</Td>
                                    <Td>{event.startTime}</Td>
                                    <Td>{event.duration}s</Td>
                                    <Td>{event.endTime}</Td>
                                    <Td>{event.startupStep.name}</Td>
                                    <Td>
                                        <dl>
                                            {event.startupStep.tags.map(tag =>
                                                <React.Fragment key={tag.key}>
                                                    <dt><strong>{tag.key}</strong>
                                                    </dt>
                                                    <dd>
                                                        <pre><code>{tag.value}</code></pre>
                                                    </dd>
                                                </React.Fragment>)}
                                        </dl>
                                    </Td>
                                </Tr>)
                        }
                    </Tbody>
                </Table>
            </Panel>
        );
    }

    sortIcon(sortColumn) {
        if (sortColumn !== this.state.sortColumn) {
            return 'arrow_drop_right';
        }
        const order = this.state.sortOrder[sortColumn];
        if (order < 0) {
            return 'arrow_drop_up';
        } else {
            return 'arrow_drop_down';
        }
    }

    sortBy(name, valueProvider) {
        const events = this.state.events;
        events.sort((a, b) => {
            const _a = valueProvider(a);
            const _b = valueProvider(b);
            if (_a > _b) {
                return this.state.sortOrder[name];
            }
            if (_b > _a) {
                return -1 * this.state.sortOrder[name];
            }
            return 0;
        });
        const sortOrder = this.state.sortOrder;
        sortOrder[name] = -1 * sortOrder[name];
        this.setState({
            sortOrder: sortOrder,
            events: events,
            sortColumn: name,
        });
    }

    setFilterEventName(eventName) {
        this.setState({
            filterEventName: eventName
        });
    }

    async loadEvents(values) {
        let url = values.url || 'http://localhost:8080/actuator/startup';
        if (!url.startsWith('http')) {
            url = 'http://' + url;
        }
        const data = await fetch(url, {
            method: 'POST',
            mode: 'cors'
        })
            .then(res => res.json());
        this.setState({
            events: data.timeline.events.map(x => {
                x.duration = this.durationToSeconds(x.duration);
                return x;
            })
        });
    }

    parseEvents(data) {
        this.setState({
            events: data.timeline.events.map(x => {
                x.duration = this.durationToSeconds(x.duration);
                return x;
            })
        });
    }

    handleError(e) {
        alert(e.toString());
    }

    durationToSeconds(duration) {
        const reptms = /^PT(?:(\d+)H)?(?:(\d+)M)?(?:([\d.]+)S)?$/;
        let hours = 0, minutes = 0, seconds = 0, totalseconds;
        if (reptms.test(duration)) {
            const matches = reptms.exec(duration);
            if (matches[1]) hours = Number(matches[1]);
            if (matches[2]) minutes = Number(matches[2]);
            if (matches[3]) seconds = Number(matches[3]);
            totalseconds = hours * 3600 + minutes * 60 + seconds;
        }
        return totalseconds;
    }
}
