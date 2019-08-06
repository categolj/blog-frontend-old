import React from "react";
import {Link} from "react-router-dom";

export function Header() {
    return (
        <p>
            <a href={'https://twitter.com/making'}>@making</a>'s memo
            <br className="invisible-inline-on-wide"/>&nbsp;
            (🗃&nbsp;<Link to="/categories">Categories</Link>&nbsp;
            🏷&nbsp;<Link to="/tags">Tags</Link>)
        </p>
    );
}