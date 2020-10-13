import * as React from "react";
import {PageContainer} from "../../components";
import AssetBrowser from "../../browser/AssetBrowser";


export default class AssetBrowserPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            headerLinks: [],
            footerLinks: []
        };
        this.cb = {
            onLoad: state => this.onLoad(state)
        }
    }
    render() {
        return (
            <PageContainer {...this.props} {...this.state}>
                <AssetBrowser location={this.props.location} onLoad={this.cb.onLoad} />
            </PageContainer>
        );
    }

    onLoad(links, browser) {
        this.setState({
            headerLinks: links
        })
    }
}


