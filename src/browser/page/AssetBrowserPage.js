import * as React from "react";
import {PageContainer} from "../../components";
import AssetBrowser from "../../browser/AssetBrowser";
import AssetIndex from "../index/AssetIndex";


export default class AssetBrowserPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            headerLinks: [],
            subHeaderLinks: [],
            footerLinks: [],
            hitCount: 0
        };
        this.cb = {
            onLoad: state => this.onLoad(state)
        }
    }

    componentDidMount() {
        this.updateLinks();
        this.updateMetaTags();
    }


    componentDidUpdate(prevProps, prevState, snapshot) {
        // console.log(this.props.location.pathname, prevProps.location.pathname);
        if(this.props.location.pathname !== prevProps.location.pathname) {
            this.updateLinks()
            this.updateMetaTags();
        }
    }

    render() {
        // console.log(this.constructor.name, this.props);
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
        const currentPath = this.props.location.pathname;
        const directories = await assetIndex.getDirectories();
        const hitCount = await assetIndex.getHitCounter();
        const currentDepth = getDepth(currentPath);
        let subHeaderPath = currentPath;
        while(subHeaderPath.match(/\//g).length >= 2)
            subHeaderPath = subHeaderPath.split('/').slice(0, -1).join('/');

        // let parentPath = '/';
        // if(currentPath.match(/\//g).length >= 2)
        //     parentPath = currentPath.split('/').slice(0, -1).join('/');
        const headerLinks = directories
            .filter(directory => {
                const depth = getDepth(directory);
                return (depth < 2)
            })
            .map(formatLink);
        const subHeaderLinks = directories
            .filter(directory => {
                if(currentDepth === 0)
                    return false;
                const depth = getDepth(directory);
                if (depth < 2)
                    return false;
                return directory.startsWith(subHeaderPath)
            })
            // .filter(directory => hasSameParent(directory, currentPath))
            .map(formatLink);

        headerLinks.unshift(['/', 'home'])
        // console.log('updateLinks', {directories, headerLinks, subHeaderLinks, currentPath, subHeaderPath, currentDepth, hitCount});

        this.setState({headerLinks, subHeaderLinks, hitCount});
    }

    async updateMetaTags() {
        const currentPath = this.props.location.pathname;
        const assetIndex = new AssetIndex();
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
    if(!directory.endsWith('/'))
        directory += '/';
    return directory.match(/\//g).length - 1;
}

function formatLink(directory) {
    let title = directory.substr(1);
    title = title.replace(/_+/g, ' ');
    // title = ucwords(title);

    return [directory, title];
}

function ucwords(str) {
    str = str.toLowerCase();
    return str.replace(/(^([a-zA-Z\p{M}]))|([ -][a-zA-Z\p{M}])/g,
        function(s){
            return s.toUpperCase();
        });
}








