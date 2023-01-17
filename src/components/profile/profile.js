import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux';
import AuthorProfile from "../author-profile/author-profile"
import 'react-toastify/dist/ReactToastify.css'
import $ from 'jquery'
import SimpleReactValidator from 'simple-react-validator'
import { updateProfile, setIndividualUserData, beforeUser, setBanner } from './../user/user.action';
import { signRequest } from './../../utils/web3';
import { ENV } from './../../config/config';
import { useNavigate } from 'react-router-dom';
import FullPageLoader from "../loaders/full-page-loader";
import { toast } from 'react-toastify';

const Profile = (props) => {
    const key = ENV.getUserKeys('_id');
    const navigate = useNavigate();
    const [isSubmitted, setIsSubmitted] = useState(false)
    const [loader, setLoader] = useState(true)
    const [errors, setErrors] = useState('')
    const [connectedAddress, setConnectedAddress] = useState('')
    const [image, setImage] = useState('')
    const [imageUrl, setImageUrl] = useState(null)
    const [banner, setBannerImage] = useState('')
    const [address, setAddress] = useState('')
    const [username, setUsername] = useState('')
    const [description, setDescription] = useState('')
    const [facebookLink, setFbLink] = useState('')
    const [twitterLink, setTwitterLink] = useState('')
    const [gPlusLink, setgPlusLink] = useState('')
    const [vineLink, setVineLink] = useState('')
    const [submitCheck, setSubmitCheck] = useState(false)

    const [msg, setMsg] = useState({
        facebookLink: '',
        twitterLink: '',
        gPlusLink: '',
        vineLink: ''
    })

    let validator = new SimpleReactValidator({
        autoForceUpdate: this,
        messages: {
            required: 'This field is required.'  // will override all messages
        },
    })

    const isValidUrl = (userInput) => {
        var res = userInput.match(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_.~#?&//=]*)/g);
        if (res == null)
            return false;
        else
            return true;
    }

    useEffect(() => {
        toast.dismiss()
        if (key._id) {
            let user = ENV.getUserKeys('');
            props.setIndividualUserData(user);
            setConnectedAddress(user.address ? user.address : '');
            setAddress(user.address ? user.address : '');
            setDescription(user.description ? user.description : '');
            setFbLink(user.facebookLink ? user.facebookLink : '');
            setgPlusLink(user.gPlusLink ? user.gPlusLink : '');
            setTwitterLink(user.twitterLink ? user.twitterLink : '');
            setVineLink(user.vineLink ? user.vineLink : '');
            setUsername(user.username ? user.username : '');
            setImageUrl(user.profileImage ? user.profileImage : '');
            setLoader(false);
        }
        else {
            navigate('/login')
        }
    }, []);

    useEffect(() => {
        if (props.user.userAuth) {
            if (!props.user.userData?.newUser) {
                navigate('/explore-all')
            }
            props.beforeUser();
            setLoader(false);
        }
    }, [props.user.userAuth]);

    useEffect(() => {
        if (props.error) {
            setErrors(props.error.message);
            goToTop();
        }
    }, [props.error]);

    const goToTop = () => {
        $('html, body').animate({
            scrollTop: 0
        }, 600)
    }

    const onFileChange = (e) => {
        let file = e.target.files[0];
        let fileURL = '';
        if (file) {
            if (file.type.includes('image')) {
                fileURL = URL.createObjectURL(file)
            } else {
                file = {};
                fileURL = '';
            }
            setImageUrl(fileURL);
            setImage(file);
        }
    }

    const onBannerChange = (e) => {
        let file = e.target.files[0];
        let fileURL = '';
        if (file) {
            if (file.type.includes('image')) {
                fileURL = URL.createObjectURL(file)
            } else {
                file = {};
                fileURL = '';
            }
            setBannerImage(file);
            props.setBanner(fileURL);
        }
    }

    const submit = async (e) => {
        e.preventDefault();
        setSubmitCheck(true)
        setErrors("");
        setIsSubmitted(true);
        let isFormValid = validator.allValid() ? true : false;
        if (isFormValid) {

            let msgData = {
                facebookLink: '',
                twitterLink: '',
                gPlusLink: '',
                vineLink: ''
            }
            if (facebookLink) {
                if (!isValidUrl(facebookLink)) {
                    msgData.facebookLink = 'Link Is Invalid.'
                    goToTop();
                }
                else {
                    msgData.facebookLink = ''
                }
            }
            if (twitterLink) {
                if (!isValidUrl(twitterLink)) {
                    msgData.twitterLink = 'Link Is Invalid.'
                    goToTop();
                }
                else {
                    msgData.twitterLink = ''
                }
            }
            if (gPlusLink) {
                if (!isValidUrl(gPlusLink)) {
                    msgData.gPlusLink = 'Link Is Invalid.'
                    goToTop();
                }
                else {
                    msgData.gPlusLink = ''
                }
            }
            if (vineLink) {
                if (!isValidUrl(vineLink)) {
                    msgData.vineLink = 'Link Is Invalid.'
                    goToTop();
                }
                else {
                    msgData.vineLink = ''
                }
            }

            setMsg(msgData)

            let check = true

            for (const property in msgData) {
                if (msgData[property] !== '') {
                    check = false
                }
            }

            if (check) {
                try {
                    setLoader(true);
                    const signature = await signRequest();
                    if (signature) {
                        var formData = new FormData();
                        if (image)
                            formData.append('profileImage', image)
                        if (banner)
                            formData.append('bannerImage', banner)
                        formData.append('description', description)
                        formData.append('facebookLink', facebookLink)
                        formData.append('twitterLink', twitterLink)
                        formData.append('gPlusLink', gPlusLink)
                        formData.append('vineLink', vineLink)
                        if (username)
                            formData.append('username', username)
                        formData.append('signature', signature)
                        props.updateProfile(formData);
                        setBannerImage('')
                        setImage('')
                    }
                    else {
                        setLoader(false)
                        navigate('/login')
                    }
                }
                catch (e) {

                }
            }
        }
        else {
            validator.showMessages();
            setErrors('Please fill all required fields in valid format.');
            goToTop();
        }
    }

    return (
        <section className="author-area">
            {
                loader ?
                    <FullPageLoader />
                    :
                    <div className="profile-detail-banner">
                        <div className="container">
                            <div className="card">
                                <div className="row justify-content-between">
                                    <div className="col-12 col-md-4 mb-md-0 mb-5">
                                        <AuthorProfile profileImage={imageUrl} username={username} description={description} address={connectedAddress} facebookLink={facebookLink} twitterLink={twitterLink} gPlusLink={gPlusLink} vineLink={vineLink} />
                                    </div>
                                    <div className="d-none d-md-block col-1">
                                        <div className="divider text-center">
                                            <span className="divider-in"></span>
                                        </div>
                                    </div>
                                    <div className="col-12 col-md-7">
                                        <div className="mt-5 mt-lg-0 mb-4">
                                            <div className="intro-content py-4">
                                                <h3 className="text-white">Update your profile</h3>
                                            </div>
                                        </div>
                                        <form id="create-nft" className="item-form">
                                            {
                                                isSubmitted && errors &&
                                                <div className="row pb-2">
                                                    <div className="col-12">
                                                        <span id="create-nft-err" className="text-danger">{errors}</span>
                                                    </div>
                                                </div>
                                            }
                                            <div className="row form-relative">
                                                <div className="col-xl-6">
                                                    <div className="input-group form-group">
                                                        <div className="custom-file">
                                                            <input type="file" className="custom-file-input" id="banner" accept=".png,.jpeg,.jpg" onChange={(e) => onBannerChange(e)} name="banner" />
                                                            <label id="nft-imasge-label" className="custom-file-label" htmlFor="banner">
                                                                {banner && banner.name ? "File Selected" : "Choose Banner Image"}
                                                            </label>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col-xl-6">
                                                    <div className="input-group form-group">
                                                        <div className="custom-file">
                                                            <input type="file" className="custom-file-input" id="image" accept=".png,.jpeg,.jpg" onChange={(e) => onFileChange(e)} name="image" />
                                                            <label id="nft-imasge-label" className="custom-file-label" htmlFor="image">
                                                                {image && image.name ? "File Selected" : "Choose Profile Picture"}
                                                            </label>
                                                        </div>
                                                    </div>
                                                </div>
                                                {/* <div className="col-lg-6">
                                                    <div className="form-group ">
                                                        <input type="text" className="form-control" name="address" placeholder="Wallet Address *" required="required" value={address} readOnly />
                                                        <span className="text-danger">{validator.message('address', address, 'required')}</span>
                                                    </div>
                                                </div> */}
                                                <div className="col-lg-12">
                                                    <div className="form-group">
                                                        <input type="text" className="form-control" name="username" placeholder="Username *" required="required" onKeyUp={(e) => setUsername(e.target.value)} defaultValue={username} />
                                                        <span className="text-danger">{validator.message('username', username, 'required')}</span>
                                                    </div>
                                                </div>
                                                <div className="col-12">
                                                    <div className="form-group">
                                                        <textarea className="form-control" name="description" placeholder="About" cols={30} rows={3} onKeyUp={(e) => setDescription(e.target.value)} defaultValue={description} />
                                                    </div>
                                                </div>
                                                <div className="col-lg-6">
                                                    <div className="form-group">
                                                        <input type="text" className="form-control" name="facebookLink" placeholder="Facebook Link" cols={30} rows={3}
                                                            onChange={(e) => {
                                                                setFbLink(e.target.value);
                                                                if (submitCheck) {
                                                                    if (facebookLink) {
                                                                        if (!isValidUrl(facebookLink)) {
                                                                            setMsg({ ...msg, facebookLink: 'Link Is Invalid.' })
                                                                        }
                                                                        else {
                                                                            setMsg({ ...msg, facebookLink: '' })
                                                                        }
                                                                    }
                                                                }
                                                            }} defaultValue={facebookLink} />
                                                        {facebookLink ? <label className={`text-danger pl-1 ${msg.facebookLink ? `` : `d-none`}`}>{msg.facebookLink}</label> : ''}
                                                    </div>
                                                </div>
                                                <div className="col-lg-6">
                                                    <div className="form-group">
                                                        <input type="text" className="form-control" name="twitterLink" placeholder="Twitter Link" cols={30} rows={3}
                                                            onChange={(e) => {
                                                                setTwitterLink(e.target.value)
                                                                if (submitCheck) {
                                                                    if (twitterLink) {
                                                                        if (!isValidUrl(twitterLink)) {
                                                                            setMsg({ ...msg, twitterLink: 'Link Is Invalid.' })
                                                                        }
                                                                        else {
                                                                            setMsg({ ...msg, twitterLink: '' })
                                                                        }
                                                                    }
                                                                }
                                                            }} defaultValue={twitterLink} />
                                                        {twitterLink ? <label className={`text-danger pl-1 ${msg.twitterLink ? `` : `d-none`}`}>{msg.twitterLink}</label> : ''}
                                                    </div>
                                                </div>
                                                <div className="col-lg-6">
                                                    <div className="form-group">
                                                        <input type="text" className="form-control" name="gPlusLink" placeholder="Google Plus Link" cols={30} rows={3}
                                                            onChange={(e) => {
                                                                setgPlusLink(e.target.value)
                                                                if (submitCheck) {
                                                                    if (gPlusLink) {
                                                                        if (!isValidUrl(gPlusLink)) {
                                                                            setMsg({ ...msg, gPlusLink: 'Link Is Invalid.' })
                                                                        }
                                                                        else {
                                                                            setMsg({ ...msg, gPlusLink: '' })
                                                                        }
                                                                    }
                                                                }
                                                            }} defaultValue={gPlusLink} />
                                                        {gPlusLink ? <label className={`text-danger pl-1 ${msg.gPlusLink ? `` : `d-none`}`}>{msg.gPlusLink}</label> : ''}
                                                    </div>
                                                </div>
                                                <div className="col-lg-6 mb-5">
                                                    <div className="form-group">
                                                        <input type="text" className="form-control" name="vineLink" placeholder="Vine Link" cols={30} rows={3}
                                                            onChange={(e) => {
                                                                setVineLink(e.target.value)
                                                                if (submitCheck) {
                                                                    if (vineLink) {
                                                                        if (!isValidUrl(vineLink)) {
                                                                            setMsg({ ...msg, vineLink: 'Link Is Invalid.' })
                                                                        }
                                                                        else {
                                                                            setMsg({ ...msg, vineLink: '' })
                                                                        }
                                                                    }
                                                                }
                                                            }} defaultValue={vineLink} />
                                                        {vineLink ? <label className={`text-danger pl-1 ${msg.vineLink ? `` : `d-none`}`}>{msg.vineLink}</label> : ''}
                                                    </div>
                                                </div>

                                                <div className="col-12 meta-tag">
                                                    <button disabled={loader} className="btn w-100 btn-filled no-border transition" type="button" onClick={(e) => submit(e)}><span className="d-block transition">Update Profile</span></button>
                                                </div>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
            }
        </section>
    )
}

const mapStateToProps = state => ({
    wallet: state.wallet,
    user: state.user,
    error: state.error
});

export default connect(mapStateToProps, { updateProfile, setIndividualUserData, beforeUser, setBanner })(Profile);