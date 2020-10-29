import * as React from "react";
import PropTypes from "prop-types";
import PageContainer from "../page/PageContainer";
import Markdown from 'markdown-to-jsx';


export default class PageMarkdown extends React.Component {
    /** Property validation **/
    static propTypes = {
        file: PropTypes.string.isRequired,
    };


    constructor(props) {
        super(props);
        this.state = {
            content: null
        }
        // console.log('props', props);
    }

    componentDidMount() {
        const filePath = this.props.file;
        fetch(filePath).then((response) => response.text()).then((content) => {
            this.setState({ content })
        })
    }

    render() {
        return (
            <PageContainer {...this.props}>
                <Markdown>
                    {this.state.content || "Loading " + this.props.file}
                </Markdown>
            </PageContainer>
        );
    }
}
