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
        className += [' even', ' odd'][i % 2];
        // if(i % 4 === 0)
        //     className += ' clear';
        return (
            <div className={className}>
                <a href={this.props.url} target="_blank">
                    <img src={this.props.url} alt={this.props.url.split('/').pop()}/>
                </a>
            </div>
        );
    }
}


