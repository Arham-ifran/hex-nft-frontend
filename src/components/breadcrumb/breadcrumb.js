import React from 'react';

function Breadcrumb(props) {
    return (
        <section className="breadcrumb-area d-flex align-items-center" style={{ backgroundImage: `url(${(props.banner || props.bannerImg)})`, backgroundPosition: "center", backgroundRepeat: "no-repeat", backgroundSize: "cover" }}>
        </section>
    );
}
export default Breadcrumb;