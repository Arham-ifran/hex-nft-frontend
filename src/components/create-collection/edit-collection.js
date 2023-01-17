import React, { Component } from 'react'
import { connect } from 'react-redux';
import { beforeCollection, upsertCollection, getCollection, deleteCollection } from '../collections/collections.actions';
import { beforeCategory, getCategories } from '../categories/categories.action';
import { emptyError } from '../../redux/shared/error/error.action';
import $ from 'jquery'
import SimpleReactValidator from 'simple-react-validator'
import FullPageLoader from '../loaders/full-page-loader';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
import { Link } from 'react-router-dom';
import { ENV } from '../../config/config';
const { cdnBaseUrl } = ENV
const bannerImg = `${cdnBaseUrl}v1652166289/hex-nft/assets/placeholder-banner_mphec4.png`;
const featureImg = `${cdnBaseUrl}v1652166289/hex-nft/assets/feature-placeholder_xqd6qk.svg`;
const logoPlaceholder = `${cdnBaseUrl}v1652166289/hex-nft/assets/logo-placeholder_jsvyst.jpg`;
class EditCollection extends Component {
    constructor(props) {
        super(props)
        this.state = {
            isSubmitted: false,
            formValid: true,
            loader: true,
            errors: '',
            collection: {
                _id: '',
                userId: '',
                categoryId: '',
                logo: '',
                featuredImg: '',
                banner: '',
                name: '',
                url: '',
                description: '',
                siteLink: '',
                discordLink: '',
                instaLink: '',
                mediumLink: '',
                telegramLink: ''
            },
            submitCheck: false,
            siteUrlCheck: true,
            discordLinkCheck: true,
            telLinkCheck: true,
            urlMsg: '',
            categories: null
        }
        this.validator = new SimpleReactValidator({
            autoForceUpdate: this,
            messages: {
                required: 'This field is required.'  // will override all messages
            },
        })
    }

    componentDidMount() {
        if (localStorage.getItem('encuse')) {
            window.scroll(0, 0)
            this.props.getCategories()

            const params = window.location.pathname.split('/')
            if (params.length)
                this.props.getCollection(params[params.length - 1], 'edit')
        }
        else {
            this.props.navigation('/login')
        }

    }

    deleteCollection = (collectionId) => {
        confirmAlert({
            title: 'Delete Collection',
            message: 'Are you sure you want to delete this collection and hide all of its items? This can only be done if you own all items in the collection.',
            buttons: [
                {
                    label: 'Never mind'
                },
                {
                    label: 'Yes, Delete',
                    onClick: () => {
                        this.setState({ loader: true }, () => {
                            this.props.deleteCollection(collectionId)
                        })
                    }
                }
            ]
        });
    }

    componentDidUpdate(prevProps, prevState) {
        // when collection data is deleted
        if (this.props.collection.deleteAuth) {
            const { collectionId } = this.props.collection.collection;
            if (collectionId) {
                this.props.beforeCollection()
                this.props.navigation("/my-collections")
            }
            this.setState({ loader: false })
        }

        if (this.props.error) {
            this.setState({ loader: false }, () => {
                if (this.props.error?.invalidCol)
                    this.props.navigation("/my-collections")

                this.props.emptyError()
            })
        }

        if (this.props.collection.upsertAuth) {
            this.props.beforeCollection()
            this.props.navigation('/my-collections')
        }

        if (this.props.category.getAuth) {
            const { categories } = this.props.category
            this.setState({ categories, loader: false }, () => {
                this.props.beforeCategory()
            })
        }

        if (
            this.state.collection.name === '' &&
            this.state.collection.url === '' &&
            this.state.collection.description === '' //== &&
            // this.state.weight !== prevState.weight &&
            // this.state.gender !== prevState.gender
        ) {
            if (this.props.collection.collection) {
                const { _id, name, url, description, category, user, logo, featuredImg, banner
                    , instaLink, siteLink, discordLink, mediumLink, telegramLink
                } = this.props.collection.collection;
                let collection = { ...this.state.collection };
                collection.name = name
                collection.description = description
                collection.url = url
                collection.categoryId = category._id
                collection.categoryName = category.name
                collection.userId = user._id
                collection.logoUrl = logo
                collection.featuredImgUrl = featuredImg
                collection.bannerUrl = banner
                collection._id = _id
                //after slug added new fields
                collection.siteLink = siteLink
                collection.discordLink = discordLink
                collection.instaLink = instaLink
                collection.mediumLink = mediumLink
                collection.telegramLink = telegramLink

                this.setState({ collection })
            }
        }
    }

    onFileChange(e) {
        let file = e.target.files[0];
        if (file)
            if (file.type.includes('image')) {
                let { collection } = this.state
                collection = { ...collection, [e.target.name]: file }
                if (e.target.name) {
                    collection[`${e.target.name}Url`] = URL.createObjectURL(e.target.files[0])
                    $(`#collection-${e.target.name}-label`).html('File selected')
                }
                this.setState({ collection })
            }
    }

    onChange(e) {
        let { name, value } = e.target
        let { collection } = this.state
        collection = { ...collection, [name]: value }
        this.setState({ collection }, () => {
            let formValid = true, siteUrlCheck = true, discordLinkCheck = true, telLinkCheck = true
            if (collection.url && !this.isValidUrl(collection.url))
                formValid = false

            if (collection.discordLink && !this.isValidUrl(collection.discordLink)) {
                formValid = false
                discordLinkCheck = false
            }

            if (collection.telegramLink && !this.isValidUrl(collection.telegramLink)) {
                formValid = false
                telLinkCheck = false
            }

            if (!this.validator.allValid())
                formValid = false

            if (!this.isSiteUrl(collection.siteLink)) {
                formValid = false
                siteUrlCheck = false
            }

            this.setState({ formValid, siteUrlCheck, discordLinkCheck, telLinkCheck })
        })
    }

    isSiteUrl = (link) => {
        if (link) {
            var pattern = new RegExp('^(https?:\\/\\/)?' + // protocol
                '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
                '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
                '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
                '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
                '(\\#[-a-z\\d_]*)?$', 'i'); // fragment locator
            return !!pattern.test(link)
        }

        return true
    }

    isValidUrl = (userInput) => {
        var res = userInput.match(/^[A-Za-z0-9_?.=/#-]*$/);
        if (res == null)
            return false;
        else
            return true;
    }


    reset = () => {
        const collection = {
            userId: '',
            categoryId: '',
            logo: '',
            featuredImg: '',
            banner: '',
            name: '',
            url: '',
            description: '',
            siteLink: '',
            discordLink: '',
            instaLink: '',
            mediumLink: '',
            telegramLink: ''
        }
        this.setState({ collection, isSubmitted: false })
    }

    submit = (e) => {
        e.preventDefault()
        let { collection } = this.state
        let formValid = true, siteUrlCheck = true
        // let discordLinkCheck = true, telLinkCheck = true     //defined but not used

        if (collection.url && !this.isValidUrl(collection.url))
            formValid = false

        if (collection.discordLink && !this.isValidUrl(collection.discordLink)) {
            formValid = false
            // discordLinkCheck = false     //defined but not used
        }

        if (collection.telegramLink && !this.isValidUrl(collection.telegramLink)) {
            formValid = false
            // telLinkCheck = false         //defined but not used
        }

        if (!this.validator.allValid())
            formValid = false

        if (!this.isSiteUrl(collection.siteLink)) {
            formValid = false
            siteUrlCheck = false
        }

        this.setState({ isSubmitted: true, formValid }, () => {
            const { formValid } = this.state
            if (formValid && siteUrlCheck) {
                this.setState({
                    loader: true,
                }, async () => {
                    const { collection } = this.state
                    var formData = new FormData()
                    for (const key in collection)
                        if (collection[key])
                            formData.append(key, collection[key])

                    this.props.upsertCollection('collection/edit', formData, 'PUT')
                })
            } else {
                this.validator.showMessages()
                $('html, body').animate({
                    scrollTop: $(".col-container").offset().top
                }, 500)

                this.setState({
                    errors: 'Please fill all required fields in valid format.',
                    formValid: false
                }, () => {
                    $('#create-collection').scrollTop(0, 0)
                })
            }
        })
    }

    render() {
        const { collection, errors, loader, isSubmitted, categories, siteUrlCheck, discordLinkCheck, telLinkCheck } = this.state
        return (
            <section className="author-area padding-wrapper">
                {loader && <FullPageLoader />}
                <div className="container">
                    <div className="col-container row justify-content-between">
                        <div className="col-12 col-md-12">
                            <div className="mt-5 mt-lg-0 mb-4 mb-lg-5">
                                <div className="intro">
                                    <div className="intro-content">
                                        <h3 className="mb-0">Edit Collection</h3>
                                    </div>
                                </div>
                                {
                                    isSubmitted && errors &&
                                    <div className="row">
                                        <div className="col-12">
                                            <span id="create-collection-err" className="text-danger">{errors}</span>
                                        </div>
                                    </div>
                                }
                            </div>
                            <form id="create-collection" className="create-item-form item-form card no-hover">
                                <div className="row">
                                    <div className="col-12">
                                        <div className="input-group form-group">
                                            <div className="custom-file">
                                                <input type="file" className="custom-file-input" id="logo" accept=".png,.jpeg,.jpg" onChange={(e) => this.onFileChange(e)} name="logo"

                                                />
                                                <label id="collection-logo-label" className="custom-file-label" htmlFor="logo">Choose Logo</label>
                                            </div>
                                            <span className="text-danger">{this.validator.message('logo', collection.logoUrl, 'required')}</span>
                                        </div>
                                    </div>
                                    <div className="col-12 ">
                                        <div className="text-center profile mb-3">
                                            <div className="image-over">
                                                <img id="logo-placeholder" className={collection.logoUrl ? "card-img-top" : "card-img-top create-collection-placeholder"} src={collection.logoUrl ? collection.logoUrl : logoPlaceholder} alt="" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-12">
                                        <div className="input-group form-group">
                                            <div className="custom-file">
                                                <input type="file" className="custom-file-input" id="featuredImg" accept=".png,.jpeg,.jpg" onChange={(e) => this.onFileChange(e)} name="featuredImg" />
                                                <label id="collection-featuredImg-label" className="custom-file-label" htmlFor="featuredImg"> Choose Featured Image</label>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-12 ">
                                        <div className="text-center featured mb-3">
                                            <div className="image-over-1">
                                                <img id="featuredImg-placeholder" className={collection.featuredImgUrl ? "card-img-top" : "card-img-top create-collection-placeholder"} src={collection.featuredImgUrl ? collection.featuredImgUrl : featureImg} alt="" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-12">
                                        <div className="input-group form-group">
                                            <div className="custom-file">
                                                <input type="file" className="custom-file-input" id="banner" accept=".png,.jpeg,.jpg" onChange={(e) => this.onFileChange(e)} name="banner" />
                                                <label id="collection-banner-label" className="custom-file-label" htmlFor="banner">Choose Banner</label>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-12">
                                        <div className="text-center banner mb-3">
                                            <div className="image-over-2">
                                                <img id="banner-placeholder" className={collection.bannerUrl ? "card-img-top" : "card-img-top create-collection-placeholder"} src={collection.bannerUrl ? collection.bannerUrl : bannerImg} alt="" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-12">
                                        <div className="form-group mt-3">
                                            <input type="text" className="form-control" name="name" placeholder="Name *" onChange={(e) => this.onChange(e)} defaultValue={collection.name} />
                                            <span className="text-danger">{this.validator.message('name', collection.name, 'required')}</span>
                                        </div>
                                    </div>
                                    <div className="col-12">
                                        {/* <div className="form-group mt-3">
                                            <input type="text" className="form-control" name="url" placeholder="URL" onChange={(e) => this.onChange(e)} defaultValue={collection.url} />
                                        </div> */}
                                        <div className="form-group">
                                            <div className="input-group mb-3">
                                                <div className="input-group-prepend">
                                                    <span className="input-group-text" id="basic-addon3">{ENV.domainUrl}collection/</span>
                                                </div>
                                                <input type="text" className="form-control" name="url" placeholder="URL"
                                                    onChange={(e) => {
                                                        this.onChange(e)
                                                        if (e.target.value) {
                                                            if (!this.isValidUrl(e.target.value)) {
                                                                let { collection } = this.state
                                                                collection = { ...collection, url: e.target.value }
                                                                this.setState({
                                                                    ...this.state,
                                                                    urlMsg: 'Entered value must only contain lowercase letters, numbers, and hyphens in between text',
                                                                    collection
                                                                })
                                                            }
                                                            else {
                                                                let { collection } = this.state
                                                                collection = { ...collection, url: e.target.value }
                                                                this.setState({
                                                                    ...this.state,
                                                                    urlMsg: '',
                                                                    collection
                                                                })
                                                            }
                                                        }
                                                    }} defaultValue={collection.url} />
                                                {this.state.collection.url ? <label className={`text-danger pl-1 ${this.state.urlMsg ? `` : `d-none`}`}>{this.state.urlMsg}</label> : ''}                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-12">
                                        <div className="form-group">
                                            <span className="no-padding">
                                                <select className="form-control" id="category" name="categoryId" onChange={(e) => this.onChange(e)} value={this.state.collection.categoryId}>
                                                    {
                                                        categories && categories.map((category, index) => {
                                                            return (
                                                                <option key={index} value={category._id}>{category.name}</option>
                                                            )
                                                        })
                                                    }
                                                </select>
                                            </span>
                                            <span className="text-danger">{this.validator.message('category', collection.categoryId, 'required')}</span>
                                        </div>
                                    </div>

                                    <div className="col-12">
                                        <div className="form-group">
                                            <input type="text" className="form-control" name="siteLink" placeholder="yoursite.io" onChange={(e) => this.onChange(e)} defaultValue={collection.siteLink} />
                                            {
                                                !siteUrlCheck &&
                                                <span className="text-danger">Invalid website URL.</span>
                                            }
                                        </div>
                                    </div>
                                    <div className="col-12">
                                        <div className="form-group">
                                            <div className="input-group mb-3">
                                                <div className="input-group-prepend">
                                                    <span className="input-group-text" id="basic-addon3">https://discord.gg/</span>
                                                </div>
                                                <input type="text" className="form-control" id="basic-url" aria-describedby="basic-addon3" placeholder="YourDiscordHandle" name="discordLink" onChange={(e) => this.onChange(e)} defaultValue={collection.discordLink} />
                                            </div>
                                            {
                                                !discordLinkCheck &&
                                                <span className="text-danger">Invalid discord URL.</span>
                                            }
                                        </div>
                                    </div>
                                    <div className="col-12">
                                        <div className="form-group">
                                            <div className="input-group mb-3">
                                                <div className="input-group-prepend">
                                                    <span className="input-group-text" id="basic-addon3">https://www.instagram.com/</span>
                                                </div>
                                                <input type="text" className="form-control" id="basic-url" aria-describedby="basic-addon3" placeholder="YourInstagramHandle" name="instaLink" onChange={(e) => this.onChange(e)} defaultValue={collection.instaLink} />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-12">
                                        <div className="form-group">
                                            <div className="input-group mb-3">
                                                <div className="input-group-prepend">
                                                    <span className="input-group-text" id="basic-addon3">https://www.medium.com/@</span>
                                                </div>
                                                <input type="text" className="form-control" id="basic-url" aria-describedby="basic-addon3" placeholder="YourMediumHandle" name="mediumLink" onChange={(e) => this.onChange(e)} defaultValue={collection.mediumLink} />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-12">
                                        <div className="form-group">
                                            <div className="input-group mb-3">
                                                <div className="input-group-prepend">
                                                    <span className="input-group-text" id="basic-addon3">https://t.me/</span>
                                                </div>
                                                <input type="text" className="form-control" id="basic-url" aria-describedby="basic-addon3" placeholder="YourTelegramHandle" name="telegramLink" onChange={(e) => this.onChange(e)} defaultValue={collection.telegramLink} />
                                            </div>
                                            {
                                                !telLinkCheck &&
                                                <span className="text-danger">Invalid telegram URL.</span>
                                            }
                                        </div>
                                    </div>

                                    <div className="col-12">
                                        <div className="form-group">
                                            <textarea className="form-control" name="description" placeholder="Description" cols={30} rows={3} onChange={(e) => this.onChange(e)} defaultValue={collection.description} />
                                        </div>
                                    </div>
                                    <div className="col-12 meta-tag">
                                        <button disabled={loader} className="btn w-100 mt-3 mt-sm-4 no-border btn-filled transition" type="button" onClick={(e) => this.submit(e)}><span className="d-block transition">Edit Collection</span></button>
                                    </div>
                                    <div className="col-12 meta-tag">
                                        <Link to="/my-collections" disabled={loader} className="btn btn-grey w-100 mt-3 mt-sm-4 no-border btn-outlined transition"><span className="d-block transition"> Cancel </span></Link>
                                    </div>
                                    <div className="col-12 meta-tag">
                                        <button className="btn btn-danger w-100 mt-3 mt-sm-4 transition" type="button" onClick={() => this.deleteCollection(collection._id)}>Delete</button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div >
            </section >
        )
    }
}

const mapStateToProps = state => {
    return {
        collection: state?.collection,
        error: state.error,
        category: state.category
    }
};

export default connect(mapStateToProps, { beforeCollection, upsertCollection, emptyError, beforeCategory, getCategories, getCollection, deleteCollection })(EditCollection);