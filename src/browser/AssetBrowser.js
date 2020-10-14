import React from "react";

import PropTypes from "prop-types";
import ImageAsset from "./asset-type/ImageAsset";
import MarkdownAsset from "./asset-type/MarkdownAsset";
import VideoAsset from "./asset-type/VideoAsset";
import PDFAsset from "./asset-type/PDFAsset";
import UnknownAsset from "./asset-type/UnknownAsset";

import {browserIndexURL} from "../config.json";

import "./AssetBrowser.css";
import AssetIndex from "./index/AssetIndex";

export default class AssetBrowser extends React.Component {
    /** Property validation **/
    static propTypes = {
        location: PropTypes.object.isRequired,
    };
    
    constructor(props) {
        super(props);
        console.log('props', props, browserIndexURL);
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
                <a id="asset-browser-top" />
                {this.renderIndexFile()}
                {this.renderFiles()}
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

    renderFiles() {
        if(this.state.files.length === 0)
            return null;
        return <div className="files">
            {this.state.files.map((file, i) => {
                const url = new URL('.' + file, browserIndexURL).toString();
                return this.renderAsset(url, i);
            })}
        </div>;
    }

    renderAsset(url, i=-1) {
        switch(url.split('.').pop().toLowerCase()) {
            case 'jpg':
            case 'jpeg':
            case 'png':
                return <ImageAsset url={url} i={i} />;
            case 'md':
                return <MarkdownAsset url={url} i={i} />;
            case 'm4v':
            case 'mp4':
                return <VideoAsset url={url} i={i} />;
            case 'pdf':
                return <PDFAsset url={url} i={i} />;
            default:
                return <UnknownAsset url={url} i={i} />;
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













