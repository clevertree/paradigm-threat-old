import * as React from "react";

import "./assets/Page.css";

export default class PageContent extends React.Component {
    render() {
        return (
            <div className="asui-page-content">
                {this.props.children}
            </div>
        );
    }
}
