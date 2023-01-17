import React, { Component } from 'react';
import Faq from '../faq/faq';

class HelpCenter extends Component {

    componentDidMount() {
        window.scroll(0, 0)
    }

    render() {
        return (
            <Faq />
        );
    }
}

export default HelpCenter;