import React from "react";
import 'pivotal-ui/css/ellipsis';
import {Panel} from "pivotal-ui/react/panels";
import {Form} from 'pivotal-ui/react/forms';
import {Input} from 'pivotal-ui/react/inputs';
import {DefaultButton} from 'pivotal-ui/react/buttons';
import {FlexCol, Grid} from 'pivotal-ui/react/flex-grids';
import {ErrorAlert, SuccessAlert} from "pivotal-ui/react/alerts";
import {Link} from "react-router-dom";
import noteService from "./NoteService";

export class PasswordReset extends React.Component {
    state = {
        errorMessage: null,
        successMessage: null,
    };

    async resetPassword(newPassword) {
        const resetId = this.props.match.params.id;
        await noteService.resetPassword(resetId, newPassword);
        try {
            this.setState({
                successMessage: <React.Fragment>パスワードがリセットされました。<Link
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
            <h2 id="passwordReset" className={"home"}>Password Reset</h2>
            {this.state.errorMessage && <React.Fragment>
                <ErrorAlert withIcon>{this.state.errorMessage}</ErrorAlert>
                <br/>
            </React.Fragment>}
            {this.state.successMessage && <React.Fragment>
                <SuccessAlert withIcon>{this.state.successMessage}</SuccessAlert>
                <br/>
            </React.Fragment>}
            <Form {...{
                onSubmit: ({initial, current}) => this.resetPassword(current.password1),
                fields: {
                    password1: {
                        label: 'Enter your password',
                        validator: currentValue => currentValue.length < 8 ? 'Password must be 8+ characters' : null,
                        children: <Input type="password" placeholder="Password"/>
                    },
                    password2: {
                        retainLabelHeight: true,
                        children: <Input type="password" placeholder="Re-enter password"/>
                    }
                }
            }}>
                {({fields, state, canSubmit}) => {
                    const isValid = state.current.password1 !== '' && state.current.password1 === state.current.password2;
                    return (
                        <div>
                            <Grid>
                                <FlexCol>{fields.password1}</FlexCol>
                                <FlexCol>{fields.password2}</FlexCol>
                            </Grid>
                            <Grid>
                                <FlexCol/>
                                <FlexCol fixed><DefaultButton {...{
                                    disabled: !isValid || !canSubmit(),
                                    type: 'submit'
                                }}>Reset Password</DefaultButton></FlexCol>
                            </Grid>
                        </div>
                    );
                }}
            </Form>
        </Panel>);
    }

}