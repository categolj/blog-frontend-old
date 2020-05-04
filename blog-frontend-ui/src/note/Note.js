import React from "react";
import 'pivotal-ui/css/ellipsis';
import {Panel} from "pivotal-ui/react/panels";
import noteService from "./NoteService";
import {TokenAwareComponent} from "./TokenAwareComponent";
import {WarningAlert} from "pivotal-ui/react/alerts";
import marked from "../entries/Marked";
import {Divider} from "pivotal-ui/react/dividers";
import 'pivotal-ui/css/code';
import hljs from 'highlight.js/lib/highlight';
import java from 'highlight.js/lib/languages/java';
import xml from 'highlight.js/lib/languages/xml';
import 'highlight.js/styles/monokai-sublime.css';
import {BackToTop} from "pivotal-ui/react/back-to-top";
import {Icon} from 'pivotal-ui/react/iconography';
import {Welcome} from "./Welcome";

hljs.registerLanguage('java', java);
hljs.registerLanguage('xml', xml);

export class Note extends TokenAwareComponent {
    state = {
        warningMessage: null,
    };

    constructor(props) {
        super(props);
        this.ref = React.createRef();
    }

    async componentDidMount() {
        const entryId = this.props.match.params.id;
        await this.loadToken(async token => {
            try {
                return await noteService.loadNoteByEntryId(entryId, token)
            } catch (e) {
                const error = JSON.parse(e.message);
                this.setState({
                    warningMessage: {
                        __html: error.message
                    }
                });
            }
        });
        this.highlight();
    }

    highlight() {
        if (this.ref && this.ref.current) {
            const nodes = this.ref.current.querySelectorAll('pre, details > code');
            nodes.forEach((node) => {
                hljs.highlightBlock(node);
            });
            const tables = this.ref.current.querySelectorAll('table');
            tables.forEach(table => {
                table.className = 'pui-table pui-table--tr-hover';
                const th = table.children[0].children[0].children[0];
                if (th.innerText === '番号') {
                    th.style = 'width: 50px;'
                } else {
                    th.style = 'width: 25%;'
                }
            });
        }
    }

    render() {
        return (<Panel loading={this.state.isLoaded}>
            {this.redirect()}
            <h2 id="notes" className={"home"}>Notes {this.state.content && `- ${this.state.content.title}`}</h2>
            <Welcome/>
            {this.state.warningMessage && <React.Fragment>
                <WarningAlert withIcon><span dangerouslySetInnerHTML={this.state.warningMessage}/></WarningAlert>
                <br/>
            </React.Fragment>}
            {this.state.isLoaded ? <Icon style={{'fontSize': '48px'}} src="spinner-md"/>
                : this.note(this.state.content)}
        </Panel>);
    }

    note(note) {
        if (!note) {
            return (<React.Fragment/>);
        } else {
            return (<div>
                <span className={"visible-inline-on-wide"}>🗓 Created at {note.createdDate}</span>&nbsp;
                <span className={"visible-inline-on-wide"}>🗓 Updated at </span>{note.updatedDate}
                <Divider/>
                <p ref={this.ref} dangerouslySetInnerHTML={Note.content(note)}/>
                <BackToTop/>
            </div>)
        }
    }

    static content(note) {
        return {
            __html: note.content ? marked.render(note.content) : "未執筆です🙇‍"
        }
    }
}