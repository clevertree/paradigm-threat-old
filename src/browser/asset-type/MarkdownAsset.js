import React from "react";
import PropTypes from "prop-types";
import {browserIndexURL} from "../../config.json";
import ReactMarkdown from "react-markdown";

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

    render() {
        return (
            <div className="image-asset">
                {this.state.loading ? `Loading ${this.props.url}` : <ReactMarkdown
                    escapeHtml={false}
                    source={this.state.source}
                />}
            </div>
        );
    }

    async loadAsset() {
        const response = await fetch(this.props.url);
        const source = await response.text();
        this.setState({
            loading: false,
            source
        });
    }
}