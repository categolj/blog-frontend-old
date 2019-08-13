import React from "react";
import marked from "./Marked";
import {Link} from "react-router-dom";
import {Category} from "../categories/Category";
import {Tag} from "../tags/Tag";
import {NoMatch} from "../components/NoMatch";
import {UnexpectedError} from "../components/UnexpectedError";
import {Divider} from 'pivotal-ui/react/dividers';
import {Panel} from 'pivotal-ui/react/panels';
import {BackToTop} from 'pivotal-ui/react/back-to-top';

import 'pivotal-ui/css/code';
import hljs from 'highlight.js/lib/highlight';
import java from 'highlight.js/lib/languages/java';
import bash from 'highlight.js/lib/languages/bash';
import yaml from 'highlight.js/lib/languages/yaml';
import xml from 'highlight.js/lib/languages/xml';
import 'highlight.js/styles/monokai-sublime.css';

hljs.registerLanguage('java', java);
hljs.registerLanguage('bash', bash);
hljs.registerLanguage('yaml', yaml);
hljs.registerLanguage('xml', xml);

export class Entry extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            entry: {
                updated: {},
                created: {},
                frontMatter: {
                    title: null,
                    categories: [],
                    tags: [],
                    updated: {},
                    created: {},
                }
            }
        };
        this.ref = React.createRef();
    }

    highlight() {
        if (this.ref && this.ref.current) {
            const nodes = this.ref.current.querySelectorAll('pre, details > code');
            nodes.forEach((node) => {
                hljs.highlightBlock(node);
            });
        }
    }

    componentDidMount() {
        fetch(`${process.env.REACT_APP_BLOG_API}/entries/${this.props.match.params.id}`)
            .then(result => result.json())
            .then(res => {
                this.setState({
                    entry: res
                });
            })
            .catch(e => {
                    console.log({e});
                    this.setState({error: e});
                }
            );
        this.highlight();
    }

    componentDidUpdate() {
        this.highlight();
    }

    render() {
        if (this.state.error) {
            return <UnexpectedError message={this.state.error.message}/>
        }
        const entry = this.state.entry;
        if (entry.status === 404) {
            return <NoMatch/>;
        }
        const category = entry.frontMatter.categories.map(x => x.name);
        const tags = entry.frontMatter.tags.map(x => <span key={x.name}><Tag name={x.name}/>&nbsp;</span>);
        const isLoaded = !!entry.frontMatter.title;
        return <Panel loading={!isLoaded}>{(isLoaded ? <div>
            <h2>
                <Link to={`/entries/${entry.entryId}`}>{`${entry.frontMatter.title}`}</Link>
            </h2>
            <br/>
            <Category category={category}/>
            <br/><br/>
            {tags}
            <br/><br/>
            🗓 <span className={"visible-inline-on-wide"}>Updated at </span>{entry.updated.date}&nbsp;&nbsp;
            <span className={"visible-inline-on-wide"}>🗓 Created at {entry.created.date}&nbsp;
                {`{`}✒️️&nbsp;<a href={`https://github.com/making/blog.ik.am/edit/master/content/${Entry.format(entry.entryId)}.md`}>Edit</a>&nbsp;
                ⏰&nbsp;<a href={`https://github.com/making/blog.ik.am/commits/master/content/${Entry.format(entry.entryId)}.md`}>History</a>{`}`}</span>
            <Divider/>
            <p ref={this.ref} dangerouslySetInnerHTML={Entry.content(entry)}>
            </p>
            <BackToTop/>
        </div> : <h2>Loading...</h2>)}
        </Panel>;
    }


    static content(entry) {
        return {
            __html: entry.content && marked.render(entry.content)
        }
    }

    static format(id) {
        return ("0000" + id).substr(-5);
    }

}