import React from "react";
import {Panel} from 'pivotal-ui/react/panels';
import {Block} from "./Block";
import urlProvider from "../urlProvider";

export function Info() {
    const ui = `${urlProvider.BLOG_UI}/actuator/info`;
    const api = `${urlProvider.BLOG_API}/actuator/info`;
    return (
        <Panel>
            <h2>Build Info</h2>
            <Block header={"UI"} url={ui}/>
            <Block header={"API"} url={api}/>
            <Block header={"NOTE"} url={'https://note.dev.ik.am/actuator/info'}/>
        </Panel>
    );
}

