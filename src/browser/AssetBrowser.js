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

const browserIndexURL = (new ServerConfig()).getIndexURL();


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
        const url = new URL('.' + this.state.indexFile, browserIndexURL).toString();
        return <div className="index-file">
            {this.renderAsset(url)}
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
        return <div className="assets">
            {this.state.files.map((file, i) => {
                const url = new URL('.' + file, browserIndexURL).toString();
                return this.renderAsset(url, i);
            })}
        </div>;
    }

    renderAsset(url, i=-1) {
        const props = {
            key: i,
            i,
            url
        }
        switch(url.split('.').pop().toLowerCase()) {
            case 'jpg':
            case 'jpeg':
            case 'png':
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
}













