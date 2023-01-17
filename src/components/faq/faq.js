import { faAngleLeft, faAngleRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState, useEffect } from 'react';
import { connect } from "react-redux";
import { beforeFaq, getFaqs } from "./faq.action"

const Faq = (props) => {

    const [data, setData] = useState(null)

    useEffect(() => {
        window.scroll(0, 0)
        props.getFaqs()
    }, [])

    useEffect(() => {
        if (props.faqs.faqsAuth) {
            const { faqs } = props.faqs.faqs
            setData(faqs)
        }
    }, [props.faqs.faqsAuth])

    return (
        <section className="faq-area">
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-12 col-md-8 col-lg-7">
                        {/* Intro */}
                        <div className="intro text-center">
                            {/* <span>{"FAQ"}</span> */}
                            <h3 className="my-4">{"Frequently Asked Questions"}</h3>
                            <p>{"You can find the answer for your questions."}</p>
                        </div>
                    </div>
                </div>
                <div className="row justify-content-center">
                    <div className="col-12">
                        {/* FAQ Content */}
                        <div className="faq-content">
                            {/* Netstorm Accordion */}
                            <div className="accordion" id="netstorm-accordion">
                                <div className="row justify-content-center">
                                    <div className="col-12 col-md-10">
                                        {/* Single Accordion Item */}
                                        {data ? data.map((item, idx) => {
                                            return (
                                                <div key={`fd_${idx}`} className="single-accordion-item p-0 p-sm-3 mb-3 mb-sm-0">
                                                    {/* Card Header */}
                                                    <div className="card-header bg-inherit border-0 p-0">
                                                        <h2 className="m-0">
                                                            <button className={"btn d-block d-flex justify-content-between align-items-center text-left accordian-button w-100 collapsed py-4"} type="button" data-toggle="collapse" data-target={`#helpOption-${idx}`}>
                                                                <span>{item.title}</span>
                                                                <span className="angle-left"><FontAwesomeIcon icon={faAngleRight} /></span>
                                                            </button>
                                                        </h2>
                                                    </div>
                                                    <div id={`helpOption-${idx}`} className={"collapse"} data-parent="#netstorm-accordion">
                                                        {/* Card Body */}
                                                        <div className="card-body py-3" dangerouslySetInnerHTML={{ __html: item.desc }}>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        }) : 
                                        
                                        <div className="no-data border mb-4"><p className='text-center'>No data found for FAQs</p></div>
                                        
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

const mapStateToProps = (state) => ({
    faqs: state.faqs,
    error: state.error,
});

export default connect(mapStateToProps, {
    beforeFaq,
    getFaqs
})(Faq);