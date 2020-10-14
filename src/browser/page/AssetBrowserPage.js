import * as React from "react";
import {PageContainer} from "../../components";
import AssetBrowser from "../../browser/AssetBrowser";
import AssetIndex from "../index/AssetIndex";


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

    componentDidMount() {
        this.updateLinks();
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        // this.updateLinks();
    }

    render() {
        console.log(this.constructor.name, this.props);
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

    async updateLinks() {

        const assetIndex = new AssetIndex();
        const directories = await assetIndex.getDirectories();
        const headerLinks = directories.map(directory =>
            [directory, directory.substr(1)]
        )
        headerLinks.unshift(['/', 'home'])
        this.setState({headerLinks});
    }
}

// TODO: handle page loads
function processAjaxData(response, urlPath){
    document.getElementById("content").innerHTML = response.html;
    document.title = response.pageTitle;
    window.history.pushState({"html":response.html,"pageTitle":response.pageTitle},"", urlPath);
}
