import * as React from "react";

import PageHeader from "./PageHeader";
import PageContent from "./PageContent";
import PageFooter from "./PageFooter";
import PropTypes from "prop-types";

import "./assets/Page.css";
import "./assets/PageStyles.css";

import "./themes/DefaultPageTheme.css"

export default class PageContainer extends React.Component {

    /** Property validation **/
    static propTypes = {
        location: PropTypes.object.isRequired,
        pageList: PropTypes.array,
        themeName: PropTypes.string,
    };

    static defaultProps = {
        themeName: 'theme-default'
    }

    render() {
        const currentPath = this.props.location.pathname;

        let className = `asui-page-container`;
        if(this.props.className)
            className += ' ' + this.props.className;
        if(this.props.themeName)
            className += ' ' + this.props.themeName;

        return (
            <div className={className}>
                <PageHeader currentPath={currentPath} links={this.props.headerLinks}/>
                <PageContent>
                    {this.props.children}
                </PageContent>
                <PageFooter currentPath={currentPath} links={this.props.footerLinks}/>
            </div>
        );
    }
}
