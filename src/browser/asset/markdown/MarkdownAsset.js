import React from "react";
import PropTypes from "prop-types";
import ReactMarkdown from "react-markdown";

import "./MarkdownAsset.css";

export default class MarkdownAsset extends React.Component {
    /** Property validation **/
    static propTypes = {
        url: PropTypes.string.isRequired,
    };

    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            source: null
        }
    }

    componentDidMount() {
        this.loadAsset();
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if(this.props.url !== prevProps.url)
            this.loadAsset()
    }

    render() {
        return (
            <div className="asset-markdown">
                {this.state.loading ? `Loading ${this.props.url}` : <ReactMarkdown
                    escapeHtml={false}
                    source={this.state.source}
                />}
            </div>
        );
    }

    async loadAsset() {
        this.setState({
            loading: true,
            source: `Loading: [${this.props.url}](${this.props.url})`
        });
        const response = await fetch(this.props.url);
        const source = await response.text();
        this.setState({
            loading: false,
            source
        });
    }
}