import React from "react";
import {Link} from "react-router-dom";

export class SeriesList extends React.Component {
    static content = [
        {name: 'Spring WebFlux.fnハンズオン資料', tag: 'Spring WebFlux.fn Handson'}
    ];

    render() {
        const list = SeriesList.content.map(s =>
            <li key={s.name}><Link to={`/series/${s.tag}/entries`}>{s.name}</Link></li>);
        return (<div>
            <h3 id="series" className={"home"}>Series</h3>
            <ul>
                {list}
            </ul>
        </div>);
    }

}