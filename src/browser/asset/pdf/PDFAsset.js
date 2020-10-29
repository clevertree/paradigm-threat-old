import React from "react";
import PropTypes from "prop-types";

import "./PDFAsset.css";

export default class PDFAsset extends React.Component {
    /** Property validation **/
    static propTypes = {
        src: PropTypes.string.isRequired,
    };


    render() {
        return (
            <div className="asset-pdf">
                <embed src={this.props.src}/>
                <a href={this.props.href || this.props.src} target="_blank" rel="noopener noreferrer">{this.props.src.split('/').pop()}</a>
            </div>
        );
    }
}

