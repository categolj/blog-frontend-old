import React from "react";
import 'pivotal-ui/css/ellipsis';
import {Panel} from "pivotal-ui/react/panels";
import {Table, Tbody, Td, Th, Thead, Tr} from 'pivotal-ui/react/table';
import noteService from "./NoteService";
import {TokenAwareComponent} from "./TokenAwareComponent";

export class Notes extends TokenAwareComponent {
    async componentDidMount() {
        await this.loadToken(token => noteService.loadNotes(token));
    }

    render() {
        const decoded = this.decodeToken();
        return (<Panel>
            {this.redirect()}
            <h2 id="notes" className={"home"}>Note一覧</h2>
            <p>{decoded && `ようこそ、${decoded.preferred_username}さん`}</p>
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
                                <Td>{note.title}</Td>
                                <Td>{note.createdDate}</Td>
                                <Td>{note.updatedDate}</Td>
                            </Tr>)
                    }
                </Tbody>
            </Table>
        </Panel>);
    }

}