import React from "react";
import marked from "marked";
import {Link} from "react-router-dom";
import {Category} from "../categories/Category";
import {Tag} from "../tags/Tag";
import {NoMatch} from "../components/NoMatch";

marked.setOptions({
    gfm: true,
});

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
        }
    }

    componentDidMount() {
        fetch(`${process.env.REACT_APP_BLOG_API}/entries/${this.props.match.params.id}`)
            .then(result => result.json())
            .then(res => {
                this.setState({
                    entry: res
                });
            });
    }

    render() {
        const entry = this.state.entry;
        if (entry.status === 404) {
            return <NoMatch/>;
        }
        const category = entry.frontMatter.categories.map(x => x.name);
        const tags = entry.frontMatter.tags.map(x => <span key={x.name}><Tag name={x.name}/>&nbsp;</span>);
        return (entry.title ? <div>
            <h2>
                <Link to={`/entries/${entry.entryId}`}>{`${entry.frontMatter.title}`}</Link>
            </h2>
            <Category category={category}/>
            <br/><br/>
            {tags}
            <br/><br/>
            🗓 <span className={"visible-inline-on-wide"}>Updated at </span>{entry.updated.date} by {entry.updated.name}&nbsp;
            <span className={"visible-inline-on-wide"}>🗓 Created at {entry.created.date} by {entry.created.name}&nbsp;
                {`{`}✒️️&nbsp;<a href={`https://github.com/making/blog.ik.am/edit/master/content/${Entry.format(entry.entryId)}.md`}>Edit</a>&nbsp;
                ⏰&nbsp;<a href={`https://github.com/making/blog.ik.am/commits/master/content/${Entry.format(entry.entryId)}.md`}>History</a>{`}`}</span>
            <hr/>
            <p dangerouslySetInnerHTML={Entry.content(entry)}>
            </p>
        </div> : <h2>Loading...</h2>);
    }


    static content(entry) {
        return {
            __html: entry.content && marked(entry.content)
        }
    }

    static format(id) {
        return ("0000" + id).substr(-5);
    }

}