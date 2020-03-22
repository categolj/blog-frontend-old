import React from "react";

export function Links() {
    return (
        <section id="links">
            <h5>Links</h5>
            <ul className="links">
                <li>{`📖`}&nbsp;<a href="https://bit.ly/hajiboot2">はじめてのSpring Boot [改訂版] (拙著)</a></li>
                <li>{`📖`}&nbsp;<a href="https://bit.ly/spring-book">Spring徹底入門 Spring FrameworkによるJavaアプリケーション開発 (共著)</a></li>
                <li>{`📖`}&nbsp;<a href="https://bit.ly/perfect-javaee">パーフェクト Java EE (共著)</a></li>
                <li><a href="https://github.com/making">Github</a></li>
                <li><a href="https://twitter.com/making">Twitter</a></li>
                <li><a href="http://www.slideshare.net/makingx">SlideShare</a></li>
                <li><a href="https://github.com/categolj/blog-ui">Source Code</a></li>
            </ul>
        </section>
    );
}
