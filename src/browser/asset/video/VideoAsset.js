import React from "react";
import PropTypes from "prop-types";

import "./VideoAsset.css";

export default class VideoAsset extends React.Component {
    /** Property validation **/
    static propTypes = {
        src: PropTypes.string.isRequired,
    };

    render() {
        let i = this.props.i || 0;
        let className = 'asset-video';
        className += [' even', ' odd'][i % 2];
        return (
            <div className={className}>
                <video controls>
                    <source {...this.props} type="video/mp4" />
                    Your browser does not support the video tag.
                </video>
            </div>
        );
    }
}