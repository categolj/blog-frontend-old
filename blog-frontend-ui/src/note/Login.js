import React from "react";
import 'pivotal-ui/css/ellipsis';
import {Panel} from "pivotal-ui/react/panels";
import {Form} from 'pivotal-ui/react/forms';
import {Input} from 'pivotal-ui/react/inputs';
import {FlexCol, Grid} from 'pivotal-ui/react/flex-grids';
import {DefaultButton} from 'pivotal-ui/react/buttons';
import {Link} from "react-router-dom";

export class Login extends React.Component {
    state = {
        content: []
    };

    async componentDidMount() {
    }

    render() {
        return (<Panel>
            <h2 id="login" className={"home"}>Emailアドレス入力</h2>
            <p>
                当システムに登録済みの<a href="https://note.com">note.com</a>のEmailアドレスを入力して下さい。<br/>
                note.comでノートまたはマガジン購入後に一度当システムにメールアドレスを登録する必要があります。<br/>
                未登録の場合は<Link to={`/note/signup`}>こちら</Link>から登録してください。
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
                                    <DefaultButton type="submit" disabled={!canSubmit()}>Enter</DefaultButton>
                                </FlexCol>
                            </Grid>
                        </div>
                    );
                }}
            </Form>
        </Panel>);
    }

}