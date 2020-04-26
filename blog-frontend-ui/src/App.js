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
import {Footer} from "./components/Footer";
import {NavTab} from "react-router-tabs";
import './App.css';
import {Home} from "./home/Home";
import {Links} from "./components/Links";
import {Series} from "./series/Series";
import {Dashboard} from "./dashboard/Dashboard";
import {Login} from './note/Login';
import {Signup} from "./note/Signup";
import {AboutMe} from "./aboutme/AboutMe";

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
                            <NavTab exact to="/">{`Home`}</NavTab>
                            <NavTab exact to="/entries">{`Entries`}</NavTab>
                            <NavTab to="/categories">{`Categories`}</NavTab>
                            <NavTab to="/tags">{`Tags`}</NavTab>
                            <NavTab to="/aboutme">{`About`}</NavTab>
                            <NavTab to="/info" className={"nav-tab can-be-invisible"}>{`Info`}</NavTab>
                            <NavTab to="/dashboard" className={"nav-tab can-be-invisible"}>{`Dashboard`}</NavTab>
                            <Switch>
                                <Route exact path="/" component={Home}/>
                                <Route path="/index.html" component={Entries}/>
                                <Route exact path="/entries" component={Entries}/>
                                <Route path="/entries/:id" component={Entry}/>
                                <Route exact path="/categories" component={Categories}/>
                                <Route path="/categories/:id/entries" component={ByCategory}/>
                                <Route exact path="/tags" component={Tags}/>
                                <Route path="/tags/:id/entries" component={ByTag}/>
                                <Route path="/aboutme" component={AboutMe}/>
                                <Route path="/note/login" component={Login}/>
                                <Route path="/note/signup" component={Signup}/>
                                <Route exact path="/info" component={Info}/>
                                <Route exact path="/dashboard" component={Dashboard}/>
                                <Route path="/series/:id/entries" component={Series}/>
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