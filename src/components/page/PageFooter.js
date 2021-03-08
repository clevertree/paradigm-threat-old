import * as React from "react";

import "./assets/Page.css";
import ServerConfig from "../../server/ServerConfig";

const serverConfig = new ServerConfig();
const siteJSONURL = serverConfig.getURL('site/report.html');


export default class PageFooter extends React.Component {

    render() {
        const links = this.props.links;
        return (
            <div className="asui-page-footer" >
                <div className="links">
                    {links && links.length > 0 ? <div className="main">
                        {links.map(([href, title], i) => {
                            const props = {
                                href
                            };
                            if(this.props.currentPath === href)
                                props.className = 'selected';
                            return <a key={i} {...props}>{title}</a>
                        } )}
                    </div> : null}
                </div>
                <div className="text">
                    <div className="text-rss">
                        <a href="https://files.paradigmthreat.net/rss.xml" target="_blank" rel="noopener noreferrer">RSS Feed</a>
                    </div>
                    {typeof this.props.hitCount !== "undefined" ? <div className="text-visitors">
                        <a href={siteJSONURL} target="_blank" rel="noopener noreferrer">
                            {this.props.hitCount} Visitors
                        </a>
                    </div> : null}
                    <div className="text-created-by">
                        Created by <a href="https://github.com/clevertree/" target="_blank" rel="noopener noreferrer">Ari Asulin</a>
                    </div>
                </div>
            </div>
        );
    }


}

