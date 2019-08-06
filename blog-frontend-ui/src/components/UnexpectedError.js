import React from "react";

export class UnexpectedError extends React.Component {
    render() {
        return (
            <div>
                <h2>Unexpected Error</h2>
                <p>{this.props.message && `🚨${this.props.message}`}</p>
                <p>
                    ○|￣|＿
                </p>
            </div>
        );
    }
}