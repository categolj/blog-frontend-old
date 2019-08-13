import React from "react";
import {Category} from "./Category";
import {Loading} from "../components/Loading";
import {UnexpectedError} from "../components/UnexpectedError";
import {Panel} from 'pivotal-ui/react/panels';
import {BackToTop} from 'pivotal-ui/react/back-to-top';

export class Categories extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            categories: []
        };
    }

    componentDidMount() {
        fetch(`${process.env.REACT_APP_BLOG_API}/categories`)
            .then(result => result.json())
            .then(categories => {
                this.setState({
                    categories: categories
                });
            })
            .catch(e => {
                    console.log({e});
                    this.setState({error: e});
                }
            );
    }

    render() {
        if (this.state.error) {
            return <UnexpectedError message={this.state.error.message}/>
        }
        const categories = this.state.categories
            .map(category => {
                const c = category.map(x => x.name);
                const key = c.join('-');
                return <li key={key}>
                    <Category category={c}/>
                </li>
            });
        const isLoaded = categories.length > 0;
        return (
            <Panel loading={!isLoaded}>
                <h2>Categories</h2>
                <ul className={'categories'}>
                    {isLoaded ? categories : <Loading/>}
                </ul>
                <BackToTop/>
            </Panel>
        );
    }
}