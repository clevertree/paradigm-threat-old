import * as React from "react";

import "./assets/Page.css";

export default class PageHeader extends React.Component {
    constructor(props) {
        super(props);
        this.cb = {
            onScroll: e => this.updateScrollPosition(e)
        }
        this.ref = {
            header: React.createRef(),
            headerLinks: React.createRef(),
        }
    }

    componentDidMount() {
        window.addEventListener('scroll', this.cb.onScroll)
    }

    componentWillUnmount() {
        window.removeEventListener('scroll', this.cb.onScroll)
    }

    render() {
        const links = this.props.links;
        return (
            <div className="asui-page-header" ref={this.ref.header}>
                <a href="/" className="image">{}</a>
                {links ? <div className="links" ref={this.ref.headerLinks}>
                    {links.map(([href, title], i) => {
                        const props = {
                            href
                        };
                        if(this.props.currentPath === href)
                            props.className = 'selected';
                        if( /^https?:\/\//i.test(href))
                            props.target = '_blank';
                        return <a key={i} {...props}>{title}</a>
                    } )}
                </div> : null}
            </div>

        );
    }

    updateScrollPosition(e) {
        const headerLinks = this.ref.headerLinks.current;
        const {top} = headerLinks.getBoundingClientRect();
        console.log(e.type, window.scrollY, top);

    }
}