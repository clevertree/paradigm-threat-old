import * as React from "react";
import {PageContainer} from "../components";
import AssetBrowser from "../browser/AssetBrowser";


export default class IndexPage extends React.Component {
    render() {
        return (
            <PageContainer {...this.props}>
                <AssetBrowser location={this.props.location} />
            </PageContainer>
        );
    }
}


