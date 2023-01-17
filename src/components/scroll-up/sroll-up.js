import React, { useState } from 'react';
import $ from "jquery"

const Scrollup = () => {
    const [scroll, setScroll] = useState(false)

    window.onscroll = function () {
        let scrolledValue = document.documentElement.scrollTop;
        if (!window.location.pathname.includes('item-details')) {
            if (scrolledValue >= 200)
                setScroll(true)
            else
                setScroll(false)
        }
    }

    return (

        scroll ?
            <div id="scroll-to-top" className="scroll-to-top" onClick={() => window.scrollTo(0, 0)}>
                <a data-target="#" className="smooth-anchor">
                    <i className="fas fa-arrow-up" />
                </a>
            </div> : null
    );
};

export default Scrollup;