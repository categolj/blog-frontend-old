import React, {Component} from "react";
import {BrowserRouter, Link, Route, Switch} from "react-router-dom";
import {Tags} from "./tags/Tags";
import {Categories} from "./categories/Categories";
import {Entries} from "./entries/Entries";
import {Entry} from "./entries/Entry";
import {ByTag} from "./entries/ByTag";
import {Info} from "./info/Info";
import {Header} from "./components/Header";
import {ByCategory} from "./entries/ByCategory";
import {SearchBox} from "./components/SearchBox";
import {NoMatch} from "./components/NoMatch";
import {Links} from "./components/Links";
import {Footer} from "./components/Footer";
import {NavTab} from "react-router-tabs";
import './App.css';

class App extends Component {
    render() {
        return (
            <BrowserRouter>
                <div>
                    <h1>{`📝`} <Link to="/">BLOG.IK.AM</Link></h1>
                    <Header/>
                    <SearchBox/>
                    <section id={"main"}>
                        <article>
                            <NavTab exact to="/">{`Entries`}</NavTab>
                            <NavTab to="/categories">{`Categories`}</NavTab>
                            <NavTab to="/tags">{`Tags`}</NavTab>
                            <NavTab to="/info">{`Info`}</NavTab>
                            <Switch>
                                <Route exact path="/" component={Entries}/>
                                <Route path="/index.html" component={Entries}/>
                                <Route exact path="/entries" component={Entries}/>
                                <Route path="/entries/:id" component={Entry}/>
                                <Route exact path="/categories" component={Categories}/>
                                <Route path="/categories/:id/entries" component={ByCategory}/>
                                <Route exact path="/tags" component={Tags}/>
                                <Route path="/tags/:id/entries" component={ByTag}/>
                                <Route exact path="/info" component={Info}/>
                                <Route component={NoMatch}/>
                            </Switch>
                        </article>
                    </section>
                    <Links/>
                    <Footer/>
                </div>
            </BrowserRouter>
        );
    }
}

export default App;