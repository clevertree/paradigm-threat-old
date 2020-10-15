import React from "react";
import PropTypes from "prop-types";

import "./ImageAsset.css";

export default class ImageAsset extends React.Component {
    /** Property validation **/
    static propTypes = {
        url: PropTypes.string.isRequired,
        i: PropTypes.number
    };

    render() {
        let i = this.props.i || 0;
        let className = 'asset-image';
        if (i % 2 === 1)
            className += ' odd';
        return (
            <div className={className}>
                <a href={this.props.url} target="_blank">
                    <img src={this.props.url} alt={this.props.url.split('/').pop()}/>
                </a>
            </div>
        );
    }
}


