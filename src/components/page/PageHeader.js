import * as React from "react";

import "./assets/Page.css";

export default class PageHeader extends React.Component {
    constructor(props) {
        super(props);
        this.cb = {
            onScroll: e => this.updateScrollPosition(e)
        }
        this.ref = {
            // header: React.createRef(),
            headerImage: React.createRef(),
            // headerLinks: React.createRef(),
        }
        this.state = {
            floating: false
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
            <div className={`asui-page-header${this.state.floating ? ' floating' : ''}`}>
                <a href="/" className="image" ref={this.ref.headerImage}>{}</a>
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
        const headerImage = this.ref.headerImage.current;
        // const headerLinks = this.ref.headerLinks.current;
        const {top, height} = headerImage.getBoundingClientRect();
        const floating = top + height < 0;
        if(this.state.floating !== floating) {
            console.log('floating', floating, top + height, window.scrollY);
            this.setState({floating})
        }
    }
}