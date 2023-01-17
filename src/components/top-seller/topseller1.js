import React, { Component } from 'react';
import axios from 'axios';

const BASE_URL = "https://my-json-server.typicode.com/themeland/netstorm-json/seller";

class TopSeller extends Component {
    state = {
        data: {},
        sellerData: []
    }
    componentDidMount() {
        axios.get(`${BASE_URL}`)
            .then(res => {
                this.setState({
                    data: res.data,
                    sellerData: res.data.sellerData
                })
            })
            .catch(err => { })
    }
    render() {
        return (
            <section className="top-seller-area p-0">
                <div className="container">
                    <div className="row">
                        <div className="col-12">
                            {/* Intro */}
                            <div className="intro m-0">
                                <div className="intro-content">
                                    <span>{this.state.data.preHeading}</span>
                                    <h3 className="mt-3 mb-0">{this.state.data.heading}</h3>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="row items">
                        {this.state.sellerData.map((item, idx) => {
                            return (
                                <div key={`ts_${idx}`} className="col-12 col-sm-6 col-lg-4 item">
                                    {/* Single Seller */}
                                    <div className="card no-hover">
                                        <div className="single-seller d-flex align-items-center">
                                            <Link to={`/author/${item._id}`}>
                                                <img className="avatar-md rounded-circle" src={item.img} alt="" />
                                            </Link>
                                            {/* Seller Info */}
                                            <div className="seller-info ml-3">
                                                <Link className="seller mb-2" to={`/author/${item._id}`}>{item.seller}</Link>
                                                <span>{item.price}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>
        );
    }
}

export default TopSeller;