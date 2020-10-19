import React from "react";
import PropTypes from "prop-types";

import "./PDFAsset.css";

export default class PDFAsset extends React.Component {
    /** Property validation **/
    static propTypes = {
        url: PropTypes.string.isRequired,
    };


    render() {
        return (
            <div className="asset-pdf">
                <embed src={this.props.url}/>
                <a href={this.props.url} target="_blank" rel="noopener noreferrer">{this.props.url.split('/').pop()}</a>
            </div>
        );
    }
}

