import React from "react";
import {Panel} from 'pivotal-ui/react/panels';
import {Block} from "./Block";
import urlProvider from "../urlProvider";

export function Info() {
    const ui = `${urlProvider.BLOG_UI}/actuator/info`;
    return (
        <Panel>
            <h2>Build Info</h2>
            <Block header={"Blog UI"} url={ui}/>
            <Block header={"Entry API"} url={'/proxy/blog-api/actuator/info'}/>
            <Block header={"Translation API"}
                   url={'/proxy/blog-translation/actuator/info'}/>
            <Block header={"Counter API"}
                   url={'/proxy/blog-counter/actuator/info'}/>
            <Block header={"Note API"} url={'https://note.dev.ik.am/actuator/info'}/>
            <Block header={"Gateway"} url={'https://ik.am/_management/info'}/>
        </Panel>
    );
}

