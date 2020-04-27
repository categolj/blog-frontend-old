import React from "react";
import {Panel} from 'pivotal-ui/react/panels';
import {Block} from "./Block";

export function Info() {
    const ui = `${process.env.REACT_APP_BLOG_UI}/actuator/info`;
    const api = `${process.env.REACT_APP_BLOG_API}/actuator/info`;
    return (
        <Panel>
            <h2>Build Info</h2>
            <Block header={"UI"} url={ui}/>
            <Block header={"API"} url={api}/>
            <Block header={"LIKE"} url={'https://like.dev.ik.am/actuator/info'}/>
            <Block header={"GATEWAY"} url={'https://blog.ik.am/management/info'}/>
        </Panel>
    );
}

