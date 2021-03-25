import React from "react";
import {WarningAlert} from "pivotal-ui/react/alerts";

import 'pivotal-ui/css/ellipsis';

export class Sorry extends React.Component {
    render() {
        return (
            <React.Fragment>
                <br/>
                <WarningAlert>2021-03-26: 内部システム移行に伴う問題で、記事の取得ができない状態です。(CORSの問題です。)<br/>
                    2021-03-29までには修正の予定ですが、急ぎで記事の内容が必要な場合は<a
                        href={'https://twitter.com/making'}>@making</a>までご連絡ください。
                </WarningAlert>
                <br/>
            </React.Fragment>);
    }
}