import React from "react";
import 'pivotal-ui/css/ellipsis';
import {Panel} from "pivotal-ui/react/panels";
import noteService from "./NoteService";
import {ErrorAlert, InfoAlert, SuccessAlert} from "pivotal-ui/react/alerts";
import {Link} from "react-router-dom";

export class Activation extends React.Component {
    state = {
        errorMessage: null,
        successMessage: null,
    };

    constructor(props) {
        super(props);
    }

    async componentDidMount() {
        await this.activate();
    }

    async activate() {
        const readerId = this.props.match.params.readerId;
        const activationLinkId = this.props.match.params.activationLinkId;
        try {
            await noteService.activate(readerId, activationLinkId);
            this.setState({
                successMessage: <React.Fragment>アカウントがアクティベートされました。<Link
                    to={`/note/login`}>こちら</Link>からログインしてください。</React.Fragment>
            });
        } catch (e) {
            this.handleError(e);
        }
    }

    handleError(e) {
        const error = JSON.parse(e.message);
        this.setState({
            errorMessage: `[${error.error}] ${error.message || error.error_description}`
        });
    }

    render() {
        return (<Panel>
            <h2 id="activation" className={"home"}>Activation</h2>
            {this.state.errorMessage && <ErrorAlert withIcon>{this.state.errorMessage}</ErrorAlert>}
            {this.state.successMessage && <SuccessAlert withIcon>{this.state.successMessage}</SuccessAlert>}
            {!this.state.errorMessage && !this.state.successMessage && <InfoAlert withIcon>Activating...</InfoAlert>}
        </Panel>);
    }
}