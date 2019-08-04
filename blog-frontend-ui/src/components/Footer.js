import React from "react";

export class Footer extends React.Component {
    render() {
        return (
            <footer>
                <a href="/">BLOG.IK.AM</a> — &copy; 2010-{new Date().getFullYear()} <a href="https://twitter.com/making">Toshiaki Maki</a>
            </footer>
        );
    }
}