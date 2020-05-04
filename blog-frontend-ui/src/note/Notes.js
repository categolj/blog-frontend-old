import React from "react";
import 'pivotal-ui/css/ellipsis';
import {Panel} from "pivotal-ui/react/panels";
import {Table, Tbody, Td, Th, Thead, Tr} from 'pivotal-ui/react/table';
import noteService from "./NoteService";
import {TokenAwareComponent} from "./TokenAwareComponent";
import {Link} from "react-router-dom";
import {Welcome} from "./Welcome";

export class Notes extends TokenAwareComponent {
    async componentDidMount() {
        await this.loadToken(token => noteService.loadNotes(token));
    }

    render() {
        return (<Panel loading={this.state.isLoaded}>
            {this.redirect()}
            <h2 id="notes" className={"home"}>Notes</h2>
            <Welcome/>
            <Table className="pui-table--tr-hover">
                <Thead>
                    <Tr>
                        <Th>Title</Th>
                        <Th>Created Date</Th>
                        <Th>Updated Date</Th>
                    </Tr>
                </Thead>
                <Tbody>
                    {
                        this.state.content && this.state.content.map(note =>
                            <Tr key={note.entryId}>
                                <Td><Link to={`/notes/${note.entryId}`}>{note.title}</Link></Td>
                                <Td>{note.createdDate}</Td>
                                <Td>{note.updatedDate}</Td>
                            </Tr>)
                    }
                </Tbody>
            </Table>
        </Panel>);
    }

}