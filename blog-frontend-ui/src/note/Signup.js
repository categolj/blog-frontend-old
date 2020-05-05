import React from "react";
import 'pivotal-ui/css/ellipsis';
import {Panel} from "pivotal-ui/react/panels";
import {Form} from 'pivotal-ui/react/forms';
import {Input} from 'pivotal-ui/react/inputs';
import {FlexCol, Grid} from 'pivotal-ui/react/flex-grids';
import {DefaultButton} from 'pivotal-ui/react/buttons';
import {Link} from "react-router-dom";
import {ErrorAlert, SuccessAlert} from "pivotal-ui/react/alerts";
import noteService from "./NoteService";

export class Signup extends React.Component {
    state = {
        errorMessage: null,
        successMessage: null,
    };

    async componentDidMount() {
    }

    async createReader(email, password) {
        this.setState({errorMessage: null});
        await noteService.createReader(email, password);
        this.setState({
            successMessage: (<p>入力されたメールアドレスに確認メールを送りました。メールに記載されたリンクをクリックして下さい。<br/>
                <code>noreply@sendgrid.net</code>から<code>【はじめるSpring Boot 2】アカウントアクティベーションリンク通知</code>という件名のメールです。<br/>
                受信までに時間がかかる場合があります。届いていない場合は、お手数ですが迷惑メールボックスを確認して下さい。<br/>
                アクティベーション完了後は、<Link to={`/note/login`}>こちら</Link>からログインしてください。</p>)
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
            <h2 id="login" className={"home"}>Sign up</h2>
            {this.state.errorMessage && <React.Fragment>
                <ErrorAlert withIcon>{this.state.errorMessage}</ErrorAlert>
                <br/>
            </React.Fragment>}
            {this.state.successMessage && <React.Fragment>
                <SuccessAlert withIcon>{this.state.successMessage}</SuccessAlert>
                <br/>
            </React.Fragment>}
            <p>
                "はじめるSpring Boot2"を読むには、<a href={'https://note.com/makingx/m/m2dc6f318899c'}>note.com</a>でノートまたはマガジン購入した上で、note.comとは別に当システムにアカウントを作成する必要があります。<br/>
                Emailアドレスとパスワードを設定してアカウントを作成して下さい。<br/>
                登録後に確認メールが送信されます。メールに記載されているアクティベーションリンクをクリックしてください。<br/>
                アクティベーション後は<Link to={`/note/login`}>こちら</Link>からログインしてください。
            </p>
            <Form {...{
                onSubmit: ({initial, current}) => this.createReader(current.email, current.password1),
                onSubmitError: e => this.handleError(e),
                fields: {
                    email: {
                        children: <Input type="email" placeholder="Email"/>
                    },
                    password1: {
                        validator: currentValue => currentValue.length < 8 ? 'Password must be 8+ characters' : null,
                        children: <Input type="password" placeholder="Password"/>
                    },
                    password2: {
                        children: <Input type="password" placeholder="Re-enter password"/>
                    }
                }
            }}>
                {({fields, state, canSubmit}) => {
                    const isValid = state.current.password1 !== '' && state.current.password1 === state.current.password2;
                    return (
                        <div>
                            <Grid>
                                <FlexCol>{fields.email}</FlexCol>
                            </Grid>
                            <Grid>
                                <FlexCol>{fields.password1}</FlexCol>
                                <FlexCol>{fields.password2}</FlexCol>
                            </Grid>
                            <Grid>
                                <FlexCol>
                                    <DefaultButton {...{
                                        disabled: !isValid || !canSubmit(),
                                        type: 'submit'
                                    }}>Register</DefaultButton>
                                </FlexCol>
                            </Grid>
                        </div>
                    );
                }}
            </Form>
        </Panel>);
    }

}