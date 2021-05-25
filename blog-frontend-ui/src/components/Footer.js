import React from "react";

export function Footer() {
    return (
        <footer>
            <a href="/">IK.AM</a> — &copy; 2010-{new Date().getFullYear()} <a href="https://twitter.com/making">Toshiaki Maki</a>
        </footer>
    );
}