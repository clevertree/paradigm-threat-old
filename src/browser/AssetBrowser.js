import React from "react";

import PropTypes from "prop-types";
import ImageAsset from "./asset/image/ImageAsset";
import MarkdownAsset from "./asset/markdown/MarkdownAsset";
import VideoAsset from "./asset/video/VideoAsset";
import PDFAsset from "./asset/pdf/PDFAsset";
import UnknownAsset from "./asset/unknown/UnknownAsset";
import AssetIndex from "./index/AssetIndex";
import ServerConfig from "../server/ServerConfig";

import "./AssetBrowser.css";
import AssetList from "./asset/list/AssetList";

const serverConfig = new ServerConfig();


export default class AssetBrowser extends React.Component {
    /** Property validation **/
    static propTypes = {
        location: PropTypes.object.isRequired,
    };
    
    constructor(props) {
        super(props);
        // console.log('props', props, browserIndexURL);
        this.state = {
            loading: true,
            indexFile: null,
            indexJSON: null,
            files: [],
            // directories: [],
        }
        this.cb = {
            scrollToTop: e => this.scrollToTop(e)
        }
    }

    componentDidMount() {
        this.updateIndex()
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        // console.log(this.props.location.pathname, prevProps.location.pathname);
        if(this.props.location.pathname !== prevProps.location.pathname)
            this.updateIndex()
    }


    render() {
        return (
            <div className="asset-browser">
                <a id="asset-browser-top" href="/" >
                    <i aria-hidden="true"/>
                </a>
                {this.renderAssets()}
                {/*{this.renderDirectories()}*/}
                <div className="bottom-text"
                    onClick={this.cb.scrollToTop}
                    >
                    Back to top
                </div>
            </div>
        )
    }


    renderIndexFile() {
        if(!this.state.indexFile)
            return null;
        const src = serverConfig.getURL(this.state.indexFile);
        return <div className="index-file">
            <MarkdownAsset src={src} files={this.state.files} />
        </div>;
    }

    // renderDirectories() {
    //     if(this.state.directories.length === 0)
    //         return null;
    //     return <div className="directories">
    //         {this.state.directories.map(directory =>
    //             <a href={directory}>{directory}</a>
    //         )}
    //     </div>;
    // }

    renderAssets() {
        if(this.state.indexFile)
            return this.renderIndexFile();

        if(this.state.files.length === 0)
            return null;
        return <AssetList className="spread">
            {this.state.files.map((file, i) => {
                const url = serverConfig.getURL(file);
                return AssetBrowser.renderAsset(url, i);
            })}
        </AssetList>;
    }

    async updateIndex() {
        const currentPath = this.props.location.pathname;
        const assetIndex = new AssetIndex();
        const state = await assetIndex.getPathFiles(currentPath);
        // state.directories = state.directories.filter(
        //     directory => directory !== currentPath
        // )

        this.setState(state);
    }

    scrollToTop() {
        window.scroll({
            top: 0,
            left: 0,
            behavior: 'smooth'
        });
    }

    /** Static **/


    static renderAsset(src, i=-1) {
        const props = {
            key: i,
            className: 'list',
            src
        }
        switch(src.split('.').pop().toLowerCase()) {
            case 'jpg':
            case 'jpeg':
            case 'png':
            case 'gif':
                return <ImageAsset {...props} />;
            case 'md':
                return <MarkdownAsset {...props} />;
            case 'm4v':
            case 'mp4':
                return <VideoAsset {...props} />;
            case 'pdf':
                return <PDFAsset {...props} />;
            default:
                return <UnknownAsset {...props} />;
        }
    }

}













