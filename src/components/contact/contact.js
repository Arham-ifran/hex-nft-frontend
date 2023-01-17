import { useEffect, useState } from 'react';

import validator from 'validator';
import { connect } from "react-redux";
import { beforeContact, submitContact } from "./contact.action";

import { toast } from 'react-toastify';
import FullPageLoader from '../../components/loaders/full-page-loader'

const Contact = (props) => {

    const [data, setData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    })

    const [msg, setMsg] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    })

    const [submitCheck, setSubmitCheck] = useState(false)
    const [loader, setLoader] = useState(false)

    useEffect(() => {
        window.scroll(0, 0)
    }, [])

    useEffect(() => {
        if (props.contact.contactAuth) {
            toast.success("Contact message sent successfully.")
            setLoader(false)
            props.beforeContact()
        }
    }, [props.contact.contactAuth])

    const formSubmission = (e) => {
        e.preventDefault()
        setSubmitCheck(true)
        if (!validator.isEmpty(data.name) && validator.isEmail(data.email)
            && !validator.isEmpty(data.subject) && !validator.isEmpty(data.message)) {
            let formData = new FormData()
            for (const key in data)
                formData.append(key, data[key])
            props.submitContact(formData)
            setData({ name: '', email: '', subject: '', message: '' })
            setMsg({ name: '', email: '', subject: '', message: '' })
            e.target[0].value = ''
            e.target[1].value = ''
            e.target[2].value = ''
            e.target[3].value = ''
            setLoader(true)
        }
        else {
            let name = ''
            let email = ''
            let subject = ''
            let message = ''
            if (validator.isEmpty(data.name)) {
                name = 'Name Is Required.'
            }
            if (!validator.isEmail(data.email)) {
                email = 'Email Is Invalid.'
            }
            if (validator.isEmpty(data.subject)) {
                subject = 'Subject Is Required.'
            }
            if (validator.isEmpty(data.message)) {
                message = 'Message Is Required.'
            }
            setMsg({ name, email, subject, message })
        }
    }

    return (
        <section className="author-area">
            {
                loader ?
                    <FullPageLoader />
                    :
                    <div className="container">
                        <div className="row justify-content-center">
                            <div className="col-12 col-md-8 col-lg-7">
                                {/* Intro */}
                                <div className="intro text-center">
                                    {/* <span>{"Contact"}</span> */}
                                    <h3 className="mb-4">{"Get In Touch"}</h3>
                                    <p>{"Create, curate, and manage collections of unique NFTs to share and sell."}</p>
                                </div>
                                {/* Item Form */}
                                <form id="contact-form" className="item-form card no-hover" onSubmit={(e) => formSubmission(e)}>
                                    <div className="row">
                                        <div className="col-12">
                                            <div className="form-group">
                                                <input type="text" className="form-control" name="name" placeholder="Name" value={data.name}
                                                    id="contact-name"
                                                    onChange={(e) => {
                                                        setData({ ...data, name: e.target.value });
                                                        if (submitCheck) {
                                                            if (e.target.value) {
                                                                setMsg({ ...msg, name: '' })
                                                            }
                                                            else {
                                                                setMsg({ ...msg, name: 'Name Is Required.' })
                                                            }

                                                        }
                                                    }
                                                    } />
                                                <label className={`text-danger pl-1 ${msg.name ? `` : `d-none`}`}>{msg.name}</label>
                                            </div>
                                        </div>
                                        <div className="col-12">
                                            <div className="form-group">
                                                <input type="text" className="form-control" name="email" placeholder="Email" value={data.email}
                                                    id="contact-email"
                                                    onChange={(e) => {
                                                        setData({ ...data, email: e.target.value });
                                                        if (submitCheck) {
                                                            if (validator.isEmail(e.target.value)) {
                                                                setMsg({ ...msg, email: '' })
                                                            }
                                                            else {
                                                                setMsg({ ...msg, email: 'Email Is Invalid.' })
                                                            }
                                                        }
                                                    }
                                                    } />
                                                <label className={`text-danger pl-1 ${msg.email ? `` : `d-none`}`}>{msg.email}</label>
                                            </div>
                                        </div>
                                        <div className="col-12">
                                            <div className="form-group">
                                                <input type="text" className="form-control" name="subject" placeholder="Subject" value={data.subject}
                                                    id="contact-subject"
                                                    onChange={(e) => {
                                                        setData({ ...data, subject: e.target.value });
                                                        if (submitCheck) {
                                                            if (e.target.value) {
                                                                setMsg({ ...msg, subject: '' })
                                                            }
                                                            else {
                                                                setMsg({ ...msg, subject: 'Subject Is Required.' })
                                                            }
                                                        }
                                                    }
                                                    }
                                                />
                                                <label className={`text-danger pl-1 ${msg.subject ? `` : `d-none`}`}>{msg.subject}</label>
                                            </div>
                                        </div>
                                        <div className="col-12">
                                            <div className="form-group">
                                                <textarea className="form-control" name="message" placeholder="Message" cols={30} rows={3} defaultValue={""} value={data.message}
                                                    id="contact-message"
                                                    onChange={(e) => {
                                                        setData({ ...data, message: e.target.value });
                                                        if (submitCheck) {
                                                            if (e.target.value) {
                                                                setMsg({ ...msg, message: '' })
                                                            }
                                                            else {
                                                                setMsg({ ...msg, message: 'Message Is Required.' })
                                                            }
                                                        }
                                                    }
                                                    } />
                                                <label className={`text-danger pl-1 ${msg.message ? `` : `d-none`}`}>{msg.message}</label>
                                            </div>
                                        </div>
                                        <div className="col-12">
                                            <button className="btn w-100 mt-sm-4 btn-filled transition no-border" type="submit"><i className="icon-paper-plane mr-2" />
                                                <span className="d-block transition">Send Message</span>
                                            </button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
            }
        </section>
    );
}
const mapStateToProps = (state) => ({
    error: state.error,
    contact: state.contact,
});

export default connect(mapStateToProps, { beforeContact, submitContact })(Contact);