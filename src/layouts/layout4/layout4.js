import React, { Component } from "react";
import Header from "../../components/home/header/Header";

class Layout4 extends Component {
    render() {
        return (
            <>
                <Header />
                <div>
                    <div className="main">
                        {this.props.children}
                    </div>
                </div>
            </>
        );
    }
}

export default Layout4;
