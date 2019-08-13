import React from "react";
import {Tag} from "./Tag";
import {Loading} from "../components/Loading";
import {Panel} from 'pivotal-ui/react/panels';
import {BackToTop} from 'pivotal-ui/react/back-to-top';
import {UnexpectedError} from "../components/UnexpectedError";

export class Tags extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            tags: []
        };
    }

    componentDidMount() {
        fetch(`${process.env.REACT_APP_BLOG_API}/tags`)
            .then(result => result.json())
            .then(tags => {
                this.setState({
                    tags: tags
                });
            })
            .catch(e => {
                    console.log({e});
                    this.setState({error: e});
                }
            )
    }

    render() {
        if (this.state.error) {
            return <UnexpectedError message={this.state.error.message}/>
        }
        const tags = this.state.tags
            .map(tag => <li key={tag.name}><Tag name={tag.name}/></li>);
        const isLoaded = tags.length > 0;
        return (
            <Panel loading={!isLoaded}>
                <h2>Tags</h2>
                <ul className={'tags'}>
                    {isLoaded ? tags : <Loading/>}
                </ul>
                <BackToTop/>
            </Panel>
        );
    }
}

