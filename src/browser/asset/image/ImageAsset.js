import React from "react";
import PropTypes from "prop-types";

import "./ImageAsset.css";

export default class ImageAsset extends React.Component {
    /** Property validation **/
    static propTypes = {
        src: PropTypes.string.isRequired,
        i: PropTypes.number
    };

    render() {
        // let i = this.props.i || 0;
        let className = 'asset-image';
        if(this.props.className)
            className += ' ' + this.props.className;
        // className += [' even', ' odd'][i % 2];
        // if(i % 4 === 0)
        //     className += ' clear';
        const altText = this.props.alt || this.props.src.split('/').pop();

        return (
            <div className={className}>
                <a href={this.props.href || this.props.src} target="_blank" rel="noopener noreferrer">
                    <img src={this.props.src} alt={altText}/>
                </a>
            </div>
        );
    }
}


