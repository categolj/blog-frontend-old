import React from "react";
import {BrowserRouter, Link, Route, Switch, withRouter} from "react-router-dom";
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
import {Login} from './note/Login';
import {Signup} from "./note/Signup";
import {AboutMe} from "./aboutme/AboutMe";
import {Notes} from "./note/Notes";
import {Note} from "./note/Note";
import {SubscribeNote} from "./note/SubscribeNote";
import {PasswordReset} from "./note/PasswordReset";
import {Activation} from "./note/Activation";
import {EventViewer} from "./eventviewer/EventViewer";

export default function App({renderedContent}) {
    const EntryWithRouter = withRouter(Entry);
    return (
        <BrowserRouter>
            <div>
                <h1>{`📝`} <Link to="/">IK.AM</Link></h1>
                <Header/>
                <SearchBox/>
                <section id={"main"}>
                    <article>
                        <NavTab exact to="/">{`Home`}</NavTab>
                        <NavTab exact to="/entries">{`Entries`}</NavTab>
                        <NavTab to="/categories">{`Categories`}</NavTab>
                        <NavTab to="/tags">{`Tags`}</NavTab>
                        <NavTab exact to="/notes">{`Note`}</NavTab>
                        <NavTab to="/eventviewer"
                                className={"nav-tab can-be-invisible"}>{`Event Viewer`}</NavTab>
                        <NavTab to="/aboutme"
                                className={"nav-tab can-be-invisible"}>{`About`}</NavTab>
                        <NavTab to="/info"
                                className={"nav-tab can-be-invisible"}>{`Info`}</NavTab>
                        <Switch>
                            <Route exact path="/" render={() => <Home
                                renderedContent={renderedContent}/>}/>
                            <Route path="/index.html" render={() => <Home
                                renderedContent={renderedContent}/>}/>
                            <Route exact path="/entries" component={Entries}/>
                            <Route path="/entries/:id/:language"
                                   render={({match}) => <EntryWithRouter match={match}
                                                                         renderedContent={renderedContent}/>}/>
                            <Route path="/entries/:id"
                                   render={({match}) => <Entry match={match}
                                                                         renderedContent={renderedContent}/>}/>
                            <Route exact path="/categories" component={Categories}/>
                            <Route path="/categories/:id/entries" component={ByCategory}/>
                            <Route exact path="/tags" component={Tags}/>
                            <Route path="/tags/:id/entries" component={ByTag}/>
                            <Route path="/aboutme" component={AboutMe}/>
                            <Route path="/eventviewer" component={EventViewer}/>
                            <Route path="/note/login" component={Login}/>
                            <Route path="/note/signup" component={Signup}/>
                            <Route path="/note/password_reset/:id"
                                   component={PasswordReset}/>
                            <Route
                                path="/note/readers/:readerId/activations/:activationLinkId"
                                component={Activation}/>
                            <Route path="/notes/:id/subscribe" component={SubscribeNote}/>
                            <Route path="/notes/:id" component={Note}/>
                            <Route path="/notes" component={Notes}/>
                            <Route exact path="/info" component={Info}/>
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