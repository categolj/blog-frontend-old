import React from "react";
import {Redirect} from "react-router-dom";

export class SearchBox extends React.Component {
    constructor(props) {
        super(props);
        // this.param = (window && window.location) ? new URLSearchParams(window.location.search) : new URLSearchParams();
        this.state = {
            redirect: false
        };
        this.params = new URLSearchParams();
    }

    render() {
        return (
            <form method="get" onSubmit={event => this.submit(event)}>
                <label>{`🔎`}&nbsp;<input className="input" name="q" type="search" placeholder="Search..."
                                          onChange={event => this.changeQ(event)}/></label>
                <br/>
                <br/>
                {this.state.redirect &&
                <Redirect
                    to={{
                        pathname: "/",
                        search: this.params.toString(),
                    }}
                />
                }
            </form>
        );
    }

    submit(event) {
        event.preventDefault();
        this.setState({redirect: true});
    }

    changeQ(event) {
        this.params.set('q', event.target.value);
    }
}