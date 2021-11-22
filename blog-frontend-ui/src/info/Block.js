import React from "react";
import 'pivotal-ui/css/tables';

export class Block extends React.Component {
    constructor(props) {
        super(props);
        this.url = props.url;
        this.header = props.header;
        this.state = {
            info: {
                build: {
                    version: 'Loading ...'
                },
                java: {
                    version: 'Loading ...',
                    vendor: 'Loading ...'
                },
                maven: {
                    versions: {}
                },
                git: {
                    commit: {
                        id: {},
                        message: {}
                    },
                    remote: {
                        origin: {
                            url: ''
                        }
                    }
                }
            }
        };
    }

    componentDidMount() {
        fetch(`${this.url}`)
            .then(result => result.json())
            .then(info => {
                this.setState({
                    info: info
                });
            })
    }

    render() {
        const info = this.state.info;
        const rev = info.git.commit.id.abbrev;
        const header = this.header;
        const javaVersion = info.java.jvm ? `${info.java.jvm.version} / ${info.java.jvm.name}` : info.java.version;
        return (
            <div>
                <h3><a href={this.url}>{header}</a></h3>
                <table className="table">
                    {info.build && <React.Fragment>
                        <tr>
                            <th>Version</th>
                            <td>{info.build.version}</td>
                        </tr>
                        <tr>
                            <th>Build Time</th>
                            <td>{info.build.time}</td>
                        </tr>
                    </React.Fragment>}
                    {info.git && <React.Fragment>
                        <tr>
                            <th>Source Code</th>
                            <td>{info.git.commit.message.short} (<a
                                href={info.git.remote.origin.url
                                    .replace('git@github.com:', 'https://github.com/')
                                    .replace('.git', '') + `/tree/${rev}`}
                                target={'_blank'}
                                rel={'noopener noreferrer'}><code>{rev}</code></a>)
                            </td>
                        </tr>
                    </React.Fragment>}
                    {info.java && <React.Fragment>
                        <tr>
                            <th>Java</th>
                            <td>{javaVersion} ({info.java.vendor})</td>
                        </tr>
                    </React.Fragment>}
                    {info.maven && info.maven.versions && <React.Fragment>
                        <tr>
                            <th>Spring Framework</th>
                            <td>{info.maven.versions['spring-framework']}</td>
                        </tr>
                        <tr>
                            <th>Spring Boot</th>
                            <td>{info.maven.versions['spring-boot']}</td>
                        </tr>
                        <tr>
                            <th>Spring Cloud</th>
                            <td>{info.maven.versions['spring-cloud']}</td>
                        </tr>
                        <tr>
                            <th>Spring Security</th>
                            <td>{info.maven.versions['spring-security']}</td>
                        </tr>
                    </React.Fragment>
                    }
                </table>
            </div>);
    }
}