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
        // console.log(this.props.location.pathname, prevProps.location.pathname);
        if(this.props.location.pathname !== prevProps.location.pathname)
            this.updateLinks()
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
        const currentPath = this.props.location.pathname;
        let parentPath = '/';
        if(currentPath.match(/\//g).length >= 2)
            parentPath = currentPath.split('/').slice(0, -1).join('/');
        const depth = getDepth(currentPath);
        // console.log('depth', depth, currentPath);
        const assetIndex = new AssetIndex();
        const directories = await assetIndex.getDirectories(currentPath);
        const headerLinks = directories
            .filter(directory => {
                const depth2 = getDepth(directory);
                if(depth === 0)
                    return depth2 === 1;
                if(depth === 1)
                    return depth2 === 1 || directory.startsWith(currentPath);
                return directory.startsWith(parentPath)
            })
            // .filter(directory => hasSameParent(directory, currentPath))
            .map(directory =>
            [directory, directory.substr(1)]
        )
        headerLinks.unshift(['/', 'home'])
        this.setState({headerLinks});

        // Meta Tags
        document.title = ORIGINAL_TITLE;
        const {indexStats} = await assetIndex.getPathFiles(currentPath);
        if(indexStats && indexStats.meta) {
            for (const [key, value] of Object.entries(indexStats.meta)) {
                let paramName = 'name';
                if(key.startsWith('og:'))
                    paramName = 'property';
                switch(key) {
                    case 'title':
                        document.title = value;
                        break;
                    default:
                        let elm = document.head.querySelector(`meta[${paramName}="${key}"]`)
                        if(!elm) {
                            elm = document.createElement('meta');
                            elm[paramName] = key;
                            document.head.appendChild(elm);
                        }
                        elm.content = value;
                        break;
                }
            }
        }

    }
}
const ORIGINAL_TITLE = document.title;

function getDepth(directory) {
    return directory === '/' ? 0 : directory.match(/\//g).length;
}

















