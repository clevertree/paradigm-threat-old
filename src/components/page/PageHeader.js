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
            headerImage: React.createRef(),
            // headerLinks: React.createRef(),
        }
        this.state = {
            floating: false,
            height: 0
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
            <div
                style={this.state.height ? {height: this.state.height + 'px'} : null}
                ref={this.ref.header}
                className={`asui-page-header${this.state.floating ? ' floating' : ''}`}>
                <a
                    ref={this.ref.headerImage}
                    href="/"
                    className="image">
                    <div />
                </a>
                {links ? <div className="links">
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
        const header = this.ref.header.current;
        const headerImage = this.ref.headerImage.current;
        // const headerLinks = this.ref.headerLinks.current;
        const headerHeight = header.getBoundingClientRect().height;
        const {top, height} = headerImage.getBoundingClientRect();
        const floating = top + height < 0;
        if(this.state.floating !== floating) {
            console.log('floating', floating, top + height, window.scrollY);
            this.setState({floating, height: floating ? headerHeight : 0})
        }
    }
}