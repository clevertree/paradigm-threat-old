import React from "react";

import PropTypes from "prop-types";
import ImageAsset from "./asset-type/ImageAsset";
import MarkdownAsset from "./asset-type/MarkdownAsset";
import VideoAsset from "./asset-type/VideoAsset";
import PDFAsset from "./asset-type/PDFAsset";
import UnknownAsset from "./asset-type/UnknownAsset";

import {browserIndexURL} from "../config.json";

import "./AssetBrowser.css";

export default class AssetBrowser extends React.Component {
    /** Property validation **/
    static propTypes = {
        location: PropTypes.object.isRequired,
        onLoad: PropTypes.func
    };
    
    constructor(props) {
        super(props);
        console.log('props', props, browserIndexURL);
        this.state = {
            loading: true,
            index: null,
            files: [],
            directories: [],
        }
    }

    componentDidMount() {
        this.updateIndex()
    }


    render() {
        return (
            <div className="asset-browser">
                {this.renderIndexFile()}
                {this.renderFiles()}
                {this.renderDirectories()}
            </div>
        )
    }


    renderIndexFile() {
        if(!this.state.indexFile)
            return null;
        const url = new URL(this.state.indexFile, browserIndexURL).toString();
        return <div className="index-file">
            {this.renderAsset(url)}
        </div>;
    }

    renderDirectories() {
        if(this.state.directories.length === 0)
            return null;
        return <div className="directories">
            {this.state.directories.map(directory =>
                <a href={directory}>{directory}</a>
            )}
        </div>;
    }

    renderFiles() {
        if(this.state.files.length === 0)
            return null;
        return <div className="files">
            {this.state.files.map(file => {
                const url = new URL(file, browserIndexURL).toString();
                return this.renderAsset(url);
            })}
        </div>;
    }

    renderAsset(url) {
        switch(url.split('.').pop().toLowerCase()) {
            case 'jpg':
            case 'jpeg':
            case 'png':
                return <ImageAsset url={url} />;
            case 'md':
                return <MarkdownAsset url={url} />;
            case 'm4v':
            case 'mp4':
                return <VideoAsset url={url} />;
            case 'pdf':
                return <PDFAsset url={url} />;
            default:
                return <UnknownAsset url={url} />;
        }
    }

    async updateIndex() {
        const response = await fetch(browserIndexURL);
        const indexJSON = await response.json();
        const currentPath = '.' + this.props.location.pathname;
        const state = {
            files: [],
            directories: [],
            indexFile: null
        }
        for (const filePath of indexJSON) {
            if(!filePath.startsWith(currentPath))
                continue;
            const relativeFilePath = filePath.replace(currentPath, '');
            if(relativeFilePath.indexOf('/') === -1) {
                if(relativeFilePath === 'index.md') {
                    state.indexFile = relativeFilePath;
                } else {
                    state.files.push(filePath);
                }
            } else {
                const directory = relativeFilePath.split('/').shift();
                if(state.directories.indexOf(directory) === -1)
                    state.directories.push(directory)
            }
        }
        console.log('indexJSON', state);

        this.setState(state);
        if(this.props.onLoad) {
            const links = state.directories.map(directory =>
                [new URL(directory, browserIndexURL).toString(), directory]
            )
            this.props.onLoad(links, this);
        }
    }
}













