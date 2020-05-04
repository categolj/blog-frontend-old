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
import {Input} from "pivotal-ui/react/inputs";
import inMemoryTokenRepository from "./InMemoryTokenRepository";

export class SubscribeNote extends React.Component {
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

    async subscribe() {
        const noteId = this.props.match.params.id;
        try {
            const {entryId, subscribed} = await noteService.subscribeNote(noteId, this.token);
            if (subscribed) {
                this.setState({
                    infoMessage: <React.Fragment>既に購読状態になっています。<Link
                        to={`/notes/${entryId}`}>記事</Link>にアクセスしてください。</React.Fragment>
                });
            } else {
                this.setState({
                    successMessage: <React.Fragment>記事が購読状態になりました。<Link
                        to={`/notes/${entryId}`}>記事</Link>にアクセスしてください。</React.Fragment>
                });
            }
        } catch (e) {
            this.handleError(e);
        }
    }

    async loginAndSubscribe({email, password}) {
        this.setState({errorMessage: null});
        try {
            const token = await noteService.login(email, password);
            inMemoryTokenRepository.save(token);
            this.token = token;
            await this.subscribe();
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
            <h2 id="subscribe" className={"home"}>Subscribe</h2>
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
            {this.token ? this.showFormForLoggedInUser() : this.showFormForNotLoggedInUser()}
        </Panel>);
    }

    showFormForLoggedInUser() {
        return <React.Fragment>
            <p>
                Subscribeボタンをクリックし、記事を購読状態にしてください。
            </p>
            <Form {...{
                onSubmit: ({initial, current}) => this.subscribe(),
                fields: {}
            }}>
                {({fields, canSubmit, onSubmit}) => {
                    return (
                        <div>
                            <Grid>
                                <FlexCol>
                                    <PrimaryButton type="submit">Subscribe</PrimaryButton>
                                </FlexCol>
                            </Grid>
                        </div>
                    );
                }}
            </Form>
        </React.Fragment>;
    }

    showFormForNotLoggedInUser() {
        return <React.Fragment>
            <p>
                アカウント情報を入力した上で、Subscribeボタンをクリックし、記事を購読状態にしてください。<br/>
                <strong>note.comのアカウントではありません</strong>。note.comとは別に当システムにアカウントを作成する必要があります。<br/>
                未登録の場合は<Link to={`/note/signup`}>こちら</Link>から登録してください。
            </p>
            <Form {...{
                onSubmit: ({initial, current}) => this.loginAndSubscribe(current),
                fields: {
                    email: {
                        children: <Input placeholder="Email" required/>
                    },
                    password: {
                        children: <Input type={'password'} placeholder="Password (note.comのパスワードではありません)" required/>
                    }
                }
            }}>
                {({fields, canSubmit, onSubmit}) => {
                    return (
                        <div>
                            <Grid>
                                <FlexCol>{fields.email}</FlexCol>
                                <FlexCol>{fields.password}</FlexCol>
                                <FlexCol>
                                    <PrimaryButton type="submit">Subscribe</PrimaryButton>
                                </FlexCol>
                            </Grid>
                        </div>
                    );
                }}
            </Form>
        </React.Fragment>;
    }
}