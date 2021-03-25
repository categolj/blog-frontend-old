import React from "react";
import 'pivotal-ui/css/ellipsis';
import {Panel} from "pivotal-ui/react/panels";
import {Table, Tbody, Td, Th, Thead, Tr} from 'pivotal-ui/react/table';
import noteService from "./NoteService";
import {TokenAwareComponent} from "./TokenAwareComponent";
import {Link} from "react-router-dom";
import {Welcome} from "./Welcome";
import {Sorry} from "./Sorry";

export class Notes extends TokenAwareComponent {
    async componentDidMount() {
        await this.loadToken(token => noteService.loadNotes(token));
    }

    render() {
        return (<Panel loading={this.state.isLoaded}>
            {this.redirect()}
            <h2 id="notes" className={"home"}>Notes</h2>
            <Welcome/>
            <Sorry></Sorry>
            <p>
                {`(*) ... ✅の場合は記事が購読状態です。⛔の場合は購読状態になっていません。`}
                note.comで記事を購入済みの場合は<a href={`https://note.com/makingx/m/m2dc6f318899c`}>note.com</a>の該当ページから購読化リンクをクリックしてください。
            </p>
            <Table className="pui-table--tr-hover">
                <Thead>
                    <Tr>
                        <Th style={{width: '50%'}}>Title</Th>
                        <Th>Subscribed (*)</Th>
                        <Th>Updated Date</Th>
                    </Tr>
                </Thead>
                <Tbody>
                    {
                        this.state.content && this.state.content.map(note =>
                            <Tr key={note.entryId}>
                                <Td><Link to={`/notes/${note.entryId}`}>{note.title}</Link></Td>
                                <Td>{note.subscribed ? `✅` :
                                    <React.Fragment>{`⛔️`} <a href={note.noteUrl}
                                                              target={'_blank'}
                                                              rel={'noopener noreferrer'}>購読化リンクの確認</a> (要購入)</React.Fragment>}</Td>
                                <Td>{note.updatedDate}</Td>
                            </Tr>)
                    }
                </Tbody>
            </Table>
        </Panel>);
    }

}