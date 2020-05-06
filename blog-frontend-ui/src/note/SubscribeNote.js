import React from "react";
import 'pivotal-ui/css/ellipsis';
import {Panel} from "pivotal-ui/react/panels";
import {Form} from 'pivotal-ui/react/forms';
import {FlexCol, Grid} from 'pivotal-ui/react/flex-grids';
import {DefaultButton, PrimaryButton} from 'pivotal-ui/react/buttons';
import compositeTokenRepository from "./CompositeTokenRepository";
import noteService from "./NoteService";
import {ErrorAlert, InfoAlert, SuccessAlert} from "pivotal-ui/react/alerts";
import {Link} from "react-router-dom";
import {Welcome} from "./Welcome";
import {Input} from "pivotal-ui/react/inputs";
import tokenRepository from "./LocalStorageTokenRepository";

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
    }

    async loginAndSubscribe({email, password}) {
        this.setState({errorMessage: null});
        const token = await noteService.login(email, password);
        tokenRepository.save(token);
        this.token = token;
        await this.subscribe();
    }

    async sendResetLink({email}) {
        this.setState({errorMessage: null});
        await noteService.sendResetLink(email);
        this.setState({
            successMessage: `パスワードリセットリンクを${email}に送信しました。メールに記載されたリンクをクリックして下さい。`
        });
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
                onSubmitError: e => this.handleError(e),
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
                onSubmitError: e => this.handleError(e),
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
            <p>
                パスワードが未設定の場合、またはパスワードをリセットしたい場合は、以下より登録済みのメールアドレスを入力してください。パスワードリセット用のリンクを送信します。
            </p>
            <Form {...{
                onSubmit: ({initial, current}) => this.sendResetLink(current),
                onSubmitError: e => this.handleError(e),
                fields: {
                    email: {
                        children: <Input type={'email'} placeholder="Email" required/>
                    }
                }
            }}>
                {({fields, canSubmit, onSubmit}) => {
                    return (
                        <div>
                            <Grid>
                                <FlexCol>{fields.email}</FlexCol>
                                <FlexCol>
                                    <DefaultButton type="submit">Send Reset Link</DefaultButton>
                                </FlexCol>
                            </Grid>
                        </div>
                    );
                }}
            </Form>
        </React.Fragment>;
    }
}