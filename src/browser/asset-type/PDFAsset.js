import React from "react";
import PropTypes from "prop-types";

export default class PDFAsset extends React.Component {
    /** Property validation **/
    static propTypes = {
        url: PropTypes.string.isRequired,
    };

    render() {
        return (
            <div className="image-asset">
                <img src={this.props.url} alt={this.props.url.split('/').pop()}/>
            </div>
        );
    }
}

