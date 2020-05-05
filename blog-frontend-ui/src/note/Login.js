import React from "react";
import 'pivotal-ui/css/ellipsis';
import {Panel} from "pivotal-ui/react/panels";
import {Form} from 'pivotal-ui/react/forms';
import {Input} from 'pivotal-ui/react/inputs';
import {Checkbox} from 'pivotal-ui/react/checkbox';
import {FlexCol, Grid} from 'pivotal-ui/react/flex-grids';
import {DefaultButton} from 'pivotal-ui/react/buttons';
import {ErrorAlert, SuccessAlert} from 'pivotal-ui/react/alerts';
import {Link, Redirect} from "react-router-dom";
import noteService from "./NoteService";
import inMemoryTokenRepository from "./InMemoryTokenRepository";
import localStorageTokenRepository from "./LocalStorageTokenRepository";

export class Login extends React.Component {
    state = {
        redirect: false,
        errorMessage: null,
        successMessage: null,
    };

    async login({email, password, useLocalStorage}) {
        this.setState({errorMessage: null});
        const token = await noteService.login(email, password);
        if (useLocalStorage) {
            localStorageTokenRepository.save(token);
        } else {
            inMemoryTokenRepository.save(token);
        }
        this.setState({redirect: true});
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
            {this.state.redirect && <Redirect to={{pathname: "/notes"}}/>}
            <h2 id="login" className={"home"}>Login</h2>
            {this.state.errorMessage && <React.Fragment>
                <ErrorAlert withIcon>{this.state.errorMessage}</ErrorAlert>
                <br/>
            </React.Fragment>}
            {this.state.successMessage && <React.Fragment>
                <SuccessAlert withIcon>{this.state.successMessage}</SuccessAlert>
                <br/>
            </React.Fragment>}
            <p>
                当システムに登録済みのEmailアドレスをパスワード入力し、ログインして下さい。<br/>
                <strong>note.comのアカウントではありません</strong>。"はじめるSpring Boot2"を読むには、<a
                href={'https://note.com/makingx/m/m2dc6f318899c'}>note.com</a>でノートまたはマガジン購入した上で、note.comとは別に当システムにアカウントを作成する必要があります。<br/>
                未登録の場合は<Link to={`/note/signup`}>こちら</Link>から登録してください。
            </p>
            <Form {...{
                onSubmit: ({initial, current}) => this.login(current),
                onSubmitError: e => this.handleError(e),
                fields: {
                    email: {
                        children: <Input placeholder="Email" required/>
                    },
                    password: {
                        children: <Input type={'password'} placeholder="Password (note.comのパスワードではありません)" required/>
                    },
                    useLocalStorage: {
                        inline: true,
                        labelPosition: 'after',
                        label: 'トークンをLocalStorageに保存する(デフォルトはインメモリ)',
                        children: <Checkbox/>
                    },
                }
            }}>
                {({fields, canSubmit, onSubmit}) => {
                    return (
                        <div>
                            <Grid>
                                <FlexCol>{fields.email}</FlexCol>
                                <FlexCol>{fields.password}</FlexCol>
                            </Grid>
                            <Grid>
                                <FlexCol>{fields.useLocalStorage}</FlexCol>
                                <FlexCol>
                                    <DefaultButton type="submit">Login</DefaultButton>
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
        </Panel>);
    }

}