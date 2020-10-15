import React from "react";
import PropTypes from "prop-types";

import "./VideoAsset.css";

export default class VideoAsset extends React.Component {
    /** Property validation **/
    static propTypes = {
        url: PropTypes.string.isRequired,
    };

    render() {
        return (
            <div className="asset-video">
                <video controls>
                    <source src={this.props.url} type="video/mp4" />
                    Your browser does not support the video tag.
                </video>
            </div>
        );
    }
}