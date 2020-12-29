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
import {DefaultButton} from 'pivotal-ui/react/buttons';
import rsocketFactory from '../RSocketFactory';
import likeService from "./LikeService";
import readCountService from "./ReadCountService";
import Sparkline from '../components/Sparkline';

import 'pivotal-ui/css/code';
import hljs from 'highlight.js/lib/highlight';
import java from 'highlight.js/lib/languages/java';
import bash from 'highlight.js/lib/languages/bash';
import yaml from 'highlight.js/lib/languages/yaml';
import xml from 'highlight.js/lib/languages/xml';
import python from 'highlight.js/lib/languages/python';
import 'highlight.js/styles/monokai-sublime.css';

hljs.registerLanguage('java', java);
hljs.registerLanguage('bash', bash);
hljs.registerLanguage('yaml', yaml);
hljs.registerLanguage('xml', xml);
hljs.registerLanguage('python', python);

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
            },
            likes: {
                exists: true,
                count: 0
            },
            readCounts: []
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

    async componentDidMount() {
        const renderedContent = this.props.renderedContent.get();
        if (renderedContent && renderedContent.content) {
            this.setState({
                entry: renderedContent
            });
        } else {
            const rsocket = await rsocketFactory.getRSocket();
            const response = await rsocket.requestResponse({
                metadata: rsocketFactory.routingMetadata(`entries.${this.props.match.params.id}`)
            });
            try {
                this.setState({
                    entry: response.data
                });
            } catch (e) {
                console.error({e});
                this.setState({error: e});
            }
        }
        this.highlight();
        try {
            const result = await readCountService.readCountyById(this.props.match.params.id);
            const readCounts = result.data.result[0];
            this.setState({
                readCounts: readCounts.values.map(x => {
                    return {
                        t: new Date(x[0] * 1000).toLocaleString(),
                        '3h avg': x[1] * 60 * 60 * 3
                    }
                })
            });
        } catch (e) {
            console.error(e);
        }
        await this.loadLikes(this.props.match.params.id);
    }

    async loadLikes(entryId) {
        const likes = await likeService.loadLikes(entryId);
        this.setState({likes});
    }

    async postLikes(entryId) {
        const current = this.state.likes;
        current.exists = true;
        this.setState({likes: current});
        await likeService.postLikes(entryId);
        await this.loadLikes(entryId);
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
        const tags = entry.frontMatter.tags.map(x => <span key={x.name}><Tag
            name={x.name}/>&nbsp;</span>);
        const isLoaded = !!entry.frontMatter.title;
        const fallbackUrl = `https://github.com/making/blog.ik.am/blob/master/content/${Entry.format(this.props.match.params.id)}.md`;
        return <Panel loading={!isLoaded}>{(isLoaded ? <div>
            <h2>
                <Link
                    to={`/entries/${entry.entryId}`}>{`${Entry.cleanTitle(entry.frontMatter.title)}`}</Link>
            </h2>
            <Category category={category}/>
            <br/>
            {tags}
            {tags.length > 0 && <br/>}
            {Entry.entryDate(entry)}&nbsp;&nbsp;
            {!Entry.isIgnoreUpdateDate(entry) &&
            <span
                className={"visible-inline-on-wide"}>🗓 Created at {entry.created.date}</span>}&nbsp;
            <span className={"visible-inline-on-wide"}>
                {`{`}✒️️&nbsp;<a
                href={`https://github.com/making/blog.ik.am/edit/master/content/${Entry.format(entry.entryId)}.md`}>Edit</a>&nbsp;
                ⏰&nbsp;<a
                href={`https://github.com/making/blog.ik.am/commits/master/content/${Entry.format(entry.entryId)}.md`}>History</a>&nbsp;
                🗑&nbsp;<a
                href={`https://github.com/making/blog.ik.am/delete/master/content/${Entry.format(entry.entryId)}.md`}>Delete</a>{`}`}
            </span>
            <Sparkline data={this.state.readCounts}
                       width={155}
                       height={30}
                       xKey='t'
                       yKey='3h avg'/>
            <Divider/>
            <p ref={this.ref} dangerouslySetInnerHTML={Entry.content(entry)}>
            </p>
            <Divider/>
            <a href="https://www.buymeacoffee.com/makingx"><img src="https://img.buymeacoffee.com/button-api/?text=Buy me a beer&emoji=🍺&slug=makingx&button_colour=FFDD00&font_colour=000000&font_family=Cookie&outline_colour=000000&coffee_colour=ffffff" /></a>
            <DefaultButton onClick={() => this.postLikes(entry.entryId)}
                           disabled={this.state.likes.exists}>{`💚 ${this.state.likes.count}`}</DefaultButton>
            <BackToTop/>
        </div> : <React.Fragment>
            <h2>Loading...</h2>
            <p>If the content doesn't load, go to <a
                href={fallbackUrl}>{fallbackUrl}</a> instead.</p>
        </React.Fragment>)}
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

    static isIgnoreUpdateDate(entry) {
        return new Date(entry.updated.date).getTime() === 0;
    }

    static entryDate(entry) {
        if (Entry.isIgnoreUpdateDate(entry)) {
            return <span>🗓 <span
                className={"visible-inline-on-wide"}>Created at </span>{entry.created.date}</span>;
        } else {
            return <span>🗓 <span
                className={"visible-inline-on-wide"}>Updated at </span>{entry.updated.date}</span>;
        }
    }

    static cleanTitle(title) {
        return title.replace(/^L/, '@@').replace(/[┗┝]/g, '').replace(/^@@/, 'L');
    }
}
