import React from "react";
import 'pivotal-ui/css/ellipsis';
import {Panel} from "pivotal-ui/react/panels";
import {Form} from 'pivotal-ui/react/forms';
import {FlexCol, Grid} from 'pivotal-ui/react/flex-grids';
import {PrimaryButton} from 'pivotal-ui/react/buttons';
import compositeTokenRepository from "./CompositeTokenRepository";
import noteService from "./NoteService";
import {ErrorAlert, InfoAlert, SuccessAlert} from "pivotal-ui/react/alerts";
import {Link} from "react-router-dom";
import {Welcome} from "./Welcome";

export class NoteActivate extends React.Component {
    state = {
        redirect: false,
        errorMessage: null,
        successMessage: null,
        infoMessage: null,
    };

    constructor(props) {
        super(props);
        this.token = compositeTokenRepository.loadToken();
    }

    async componentDidMount() {
    }

    async activate() {
        const noteId = this.props.match.params.id;
        try {
            const {entryId, activated} = await noteService.activateNote(noteId, this.token);
            if (activated) {
                this.setState({
                    infoMessage: <React.Fragment>既にアクティベート済みです。<Link
                        to={`/notes/${entryId}`}>記事</Link>にアクセスしてください。</React.Fragment>
                });
            } else {
                this.setState({
                    successMessage: <React.Fragment>記事がアクティベートされました。<Link
                        to={`/notes/${entryId}`}>記事</Link>にアクセスしてください。</React.Fragment>
                });
            }
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
            <h2 id="login" className={"home"}>Activate</h2>
            <Welcome/>
            {this.state.errorMessage && <React.Fragment>
                <ErrorAlert withIcon>{this.state.errorMessage}</ErrorAlert>
                <br/>
            </React.Fragment>}
            {this.state.successMessage && <React.Fragment>
                <SuccessAlert withIcon>{this.state.successMessage}</SuccessAlert>
                <br/>
            </React.Fragment>}
            {this.state.infoMessage && <React.Fragment>
                <InfoAlert withIcon>{this.state.infoMessage}</InfoAlert>
                <br/>
            </React.Fragment>}
            <p>
                ボタンをクリックして、記事をアクティベートしてください。
            </p>
            <Form {...{
                onSubmit: ({initial, current}) => this.activate(),
                fields: {}
            }}>
                {({fields, canSubmit, onSubmit}) => {
                    return (
                        <div>
                            <Grid>
                                <FlexCol>
                                    <PrimaryButton type="submit">Activate</PrimaryButton>
                                </FlexCol>
                            </Grid>
                        </div>
                    );
                }}
            </Form>
        </Panel>);
    }

}