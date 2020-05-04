import React from "react";
import 'pivotal-ui/css/ellipsis';
import {Panel} from "pivotal-ui/react/panels";
import {Form} from 'pivotal-ui/react/forms';
import {Input} from 'pivotal-ui/react/inputs';
import {FlexCol, Grid} from 'pivotal-ui/react/flex-grids';
import {DefaultButton} from 'pivotal-ui/react/buttons';
import {Link} from "react-router-dom";

export class Signup extends React.Component {
    state = {
        content: []
    };

    async componentDidMount() {
    }

    render() {
        return (<Panel>
            <h2 id="login" className={"home"}>Sign up</h2>
            <p>
                <a href="https://note.com">note.com</a>のEmailアドレスを登録して下さい。<br/>
                登録後に確認メールが送信されます。メールに記載されているアクティベーションリンクをクリックしてください。<br/>
                アクティベーション後は<Link to={`/note/login`}>こちら</Link>からログインしてください。
            </p>
            <Form {...{
                onSubmit: ({initial, current}) => alert(`Login with ${current.email}`),
                fields: {
                    email: {
                        children: <Input type="email" placeholder="note.comのEmail"/>
                    }
                }
            }}>
                {({fields, canSubmit, onSubmit}) => {
                    return (
                        <div>
                            <Grid>
                                <FlexCol>{fields.email}</FlexCol>
                                <FlexCol>
                                    <DefaultButton type="submit" disabled={!canSubmit()}>Register</DefaultButton>
                                </FlexCol>
                            </Grid>
                        </div>
                    );
                }}
            </Form>
        </Panel>);
    }

}