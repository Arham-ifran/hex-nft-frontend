import React, { Component } from 'react'
import { connect } from 'react-redux';
import NFTPreview from "../nft-preview/nft-preview"
import { upsertNFT, beforeNFT } from "./../nfts/nfts.action";
import { mint } from './../../utils/web3'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import $ from 'jquery'
import SimpleReactValidator from 'simple-react-validator'
import FullPageLoader from '../../components/loaders/full-page-loader';
import { beforeCollection, getCollections } from '../collections/collections.actions';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMinus, faPlus, faCircleInfo, faXmark } from '@fortawesome/free-solid-svg-icons'
import { } from '@fortawesome/free-solid-svg-icons'
import { ENV } from '../../config/config';
import Gamification from '../gamification/gamification';
const Tiff = require('tiff.js');
const { cdnBaseUrl } = ENV
const { integerNumberValidator } = ENV
const placeholderImg = ''
const nftPlaceholder = `${cdnBaseUrl}v1652166290/hex-nft/assets/transparent-placeholder_wrydvd.png`

class CreateNFT extends Component {
    constructor(props) {
        super(props)
        this.state = {
            isSubmitted: false,
            formValid: true,
            loader: true,
            errors: '',
            nft: {
                image: '', // image/thumbnail
                file: '',  // image, audio, ppt, .etc
                mediaType: 0, // 1 for image, 2 for audio, .etc
                mediaTypeThumbnail: 0,
                name: '',
                description: '',
                currentPrice: '',
                copies: '',
                collectionId: '',
                status: 1, // 1 = put on sale, 2 = instant sale price, 3 = unlock purchased
                attributes: false,
            },
            collectionURL: '',
            collections: null,
            attributes: [
                {
                    trait_type: '',
                    value: ''
                }
            ],
            attrCheck: true,
            copiesCheck: true,
            collectionId: null,
            hasFile: false,
            fileTypes: ENV.nftFileTypes,
            supportedTypes: [],
            supportedFileTypes: [],
            supportedThumbnailTypes: [],
            textStringThumbnail: 'Thumbnail Types Supported',
            textClassThumbnail: 'text-white',
            showThumbnailInput: false,
            isImgTiff: false,
            idImageAi: false,
            dataURI: '',
            mediaType: 0,
            eventType: '',
            showTooltipMessage: false
        }
        this.gamificationRef = React.createRef();
        this.validator = new SimpleReactValidator({
            autoForceUpdate: this,
            messages: {
                required: 'This field is required.'  // will override all messages
            },
        })
    }

    componentDidMount() {
        const { _id } = ENV.getUserKeys('_id')

        if (_id) {
            window.scroll(0, 0)
            const filter = {
                userId: ENV.getUserKeys()?._id,
                all: true
            }
            let qs = ENV.objectToQueryString(filter)
            qs += `&nonCustom=true`
            this.props.getCollections(qs)
        }
        else this.props.navigation('/login')
    }

    componentDidUpdate(prevProps) {
        if (this.props.location.pathname.includes('/create') && this.props.location.search !== prevProps.location.search) {
            if (this.props.location.search === '') {
                let { nft } = this.state
                nft.collectionId = ''
                this.setState({ nft })
            }
            else {
                let collectionId = window.atob(new URLSearchParams(window.location.search).get('collection'))
                let { nft } = this.state
                nft.collectionId = collectionId
                this.setState({ nft })
            }
        }

        if (this.props.collection.getAuth) {
            const { collections } = this.props.collection
            this.props.beforeCollection()

            if (!collections?.length) {
                toast.info('Please add a collection first')
                return this.props.navigation('/collection/create')
            }
            else
                this.setState({
                    collections
                }, () => {
                    const search = window.location.search
                    if (search) {
                        let collectionId = new URLSearchParams(search).get('collection')
                        if (collectionId) {
                            collectionId = window.atob(collectionId)
                            const { nft } = this.state
                            this.setState({ nft: { ...nft, collectionId } })
                        }
                    }

                    this.setState({ loader: false })
                })
        }

        if (this.props.nft.upsertAuth) {
            const { collectionURL } = this.props.nft.nftsData
            this.setState({ loader: false, collectionURL, eventType: 'minting/listing' })
            this.reset()
            this.props.beforeNFT()
            return this.props.navigation(`/collection/${collectionURL}`)
        }
    }

    onFileChange(e) {
        const file = e.target.files[0]
        const fileId = e.target.id

        if (file) {
            // debugger
            var fileSizeinMb = (file.size / (1000 * 1000)).toFixed(2);
            if (fileSizeinMb <= 100) {
                let fileExt = file.name.match(/\.([^\.]+)$/)[1]
                let fileTypes = this.state.fileTypes
                let typePresent = false
                let thumbnailTypesSupported = ['bmp', 'gif', 'ico', 'jpeg', 'jpg', 'png', 'svg'/* , 'tif', 'tiff' */]
                if (file.name.endsWith("." + 'gz'))
                    fileExt = 'tar.gz'

                // to make sure the file state remains empty when again selecting a file
                if (fileId === 'file' && this.state.nft.file) {
                    // $('nft-file').src = this.state.nft.file
                    let nft = this.state.nft
                    nft.file = ''
                    if (nft.image) {
                        nft.image = ''
                    }
                    this.setState({ nft, hasFile: false, showThumbnailInput: false, supportedThumbnailTypes: [], dataURI: '' })
                }

                if (fileId === 'image' && !thumbnailTypesSupported.includes(fileExt)) {
                    $('#nft-image-label').html('Choose Thumbnail *')
                    $('#nft-file').attr('src', nftPlaceholder)
                    toast.error(`Thumbnail type not supported! `)
                    let nft = this.state.nft
                    nft.image = ''
                    this.setState({ nft, textStringThumbnail: 'Please select from ', textClassThumbnail: 'text-danger', supportedThumbnailTypes: thumbnailTypesSupported })
                }

                else {
                    // if file is uploaded, check if it is included in supported types
                    fileTypes.forEach((typeDetails, index) => {
                        if (typeDetails.supportedExtensions.includes(fileExt)) {

                            typePresent = true

                            let { nft } = this.state

                            if (typeDetails.hasFile)
                                nft.mediaType = typeDetails.mediaType
                            else
                                nft.mediaTypeThumbnail = typeDetails.mediaType

                            let thisHere = this
                            nft = { ...nft, [e.target.name]: file, fileExt }

                            this.setState({
                                nft,
                                supportedFileTypes: typeDetails.supportedExtensions,
                            }, () => {

                                var reader = new FileReader()
                                let result = ''
                                reader.onload = function (e) {
                                    result = e.target.result

                                    /* if file is of type tiff/tif, then it needs to be passed in tiff image reader
                                    which outputs url which is then embedded into src of nft img */

                                    if (fileExt === 'tiff' || fileExt === 'tif') {
                                        let tiff = new Tiff({ buffer: result });
                                        let dataURI = tiff.toDataURL()
                                        let element = $(`#nft-file-tif`)

                                        if (element && element !== null) {
                                            thisHere.setState({ dataURI }, () => {
                                                element.attr('src', dataURI)
                                            })
                                        }
                                    }
                                    if (typeDetails.hasFile) {
                                        $('#nft-file').attr('src', nftPlaceholder)
                                        thisHere.setState({ showThumbnailInput: true, hasFile: true, supportedThumbnailTypes: thumbnailTypesSupported })
                                    }
                                    else {
                                        $('#nft-file').attr('src', result)
                                    }

                                    // $(`#nft-file`).attr('src', result)
                                    // if (file.type.includes('image'))
                                    // $(`#nft-${fileId}`).attr('src', result)
                                    if (fileId === 'image' && typeDetails.fileType === 'image') {
                                        $('#nft-image-label').html('Thumbnail selected')
                                        thisHere.setState({ supportedThumbnailTypes: [] })
                                        // thisHere.setState({ textStringThumbnail : 'Thumbnail types supported', textClassThumbnail : 'text-white'})
                                    }

                                    $('#nft-file-label').html('File selected')
                                    // thisHere.setState({ supportedFileTypes : []})

                                }

                                if (fileExt === 'tif' || fileExt === 'tiff')
                                    reader.readAsArrayBuffer(file)
                                else
                                    reader.readAsDataURL(file)
                            })
                        }
                    })

                    if (!typePresent) {
                        let supportedExtensions = []
                        toast.error('File Type Not Supported!')
                        let nft = this.state.nft
                        nft.image = ''
                        nft.file = ''
                        $('#nft-file-label').html('Choose File *')
                        $('#nft-file').attr('src', nftPlaceholder)

                        this.setState({ nft, hasFile: false, showThumbnailInput: false, supportedFileTypes: supportedExtensions })
                    }
                }
            }
            else {
                toast.error('File size is too large! Please upload file of size less than or equal to 100 MB')
                let nft = this.state.nft
                if (fileId === 'image') {
                    $('#nft-image-label').html('Choose Thumbnail *')
                    nft.image = ''
                    this.setState({ nft })
                }
            }
        }
    }

    onChange(e) {
        let { name, value } = e.target
        let { nft, formValid } = this.state

        // if attribute is provided
        if (name === 'attributes')
            value = !nft.attributes ? true : false

        nft = { ...nft, [name]: value }

        let copies = parseInt(nft.copies) || 0
        let copiesCheck = (copies >= 1 && copies <= 115)
        formValid = this.validator.allValid() && copiesCheck

        this.setState({ nft, formValid, copiesCheck })
    }

    onAttrChange = (e) => {
        const { name, value } = e.target
        const { attributes } = this.state

        const startIndex = name.indexOf('[') + 1
        const endIndex = name.indexOf(']')
        const index = name.substring(startIndex, endIndex)
        const prop = name.split('].')[1] // trait_type OR value

        attributes[index][prop] = value

        if (attributes[index].trait_type && attributes[index].value)
            this.setState({ attrCheck: true })

        this.setState({ attributes })
    }

    removeAttr = (index = -1) => {
        let { attributes } = this.state
        if (attributes.length > 1 && index > -1) {
            attributes.splice(index, 1)
            this.setState({ attributes })
        }
    }

    addAttr = () => {
        const valid = this.checkValidity()
        if (valid) {
            const { attributes } = this.state
            const data = { trait_type: '', value: '' }
            attributes.push(data)
            this.setState({ attributes, attrCheck: true })
        } else {
            this.setState({ attrCheck: false })
        }
    }

    checkValidity() {
        const { attributes } = this.state
        return (attributes[attributes.length - 1].trait_type && attributes[attributes.length - 1].value ? true : false)
    }

    reset = () => {
        const nft = {
            image: '',
            name: '',
            description: '',
            currentPrice: '',
            copies: '',
            collectionId: '',
            status: 1, // 1 = put on sale, 2 = instant sale price, 3 = unlock purchased
            attributes: false
        }
        this.setState({ nft, copiesCheck: true, loader: false, attributes: [], attrCheck: true })
    }
    submit = async (e) => {
        e.preventDefault()

        const { nft } = this.state

        if (nft.mediaTypeThumbnail !== 0 && nft.mediaType !== 0)
            delete nft['mediaTypeThumbnail']

        if (nft.mediaType === 0 && nft.mediaTypeThumbnail !== 0) {
            nft.mediaType = nft.mediaTypeThumbnail
            delete nft['mediaTypeThumbnail']

        }

        let { copiesCheck, attrCheck } = this.state
        copiesCheck = nft.copies ? copiesCheck : true
        attrCheck = nft.attributes ? this.checkValidity() : true

        this.setState({
            isSubmitted: true,
            formValid: this.validator.allValid() && copiesCheck && attrCheck,
            copiesCheck, attrCheck
        }, () => {
            const { formValid } = this.state
            if (formValid) {
                this.setState({
                    loader: true,
                }, async () => {
                    const signature = await mint();
                    if (signature) {
                        var formData = new FormData()
                        for (const key in nft)
                            if (nft[key] && key !== 'attributes')
                                formData.append(key, nft[key])

                        if (nft.attributes) {
                            const { attributes } = this.state
                            formData.append('attributes', window.btoa(JSON.stringify(attributes)))
                        }

                        formData.append('createdSign', signature)

                        this.props.upsertNFT('create', formData, 'POST');
                    }
                    else
                        this.setState({ loader: false })
                })
            } else {
                this.validator.showMessages()
                this.setState({
                    errors: 'Please fill all required fields in valid format.',
                    formValid: false
                }, () => {
                    $('#create-nft').scrollTop(0, 0)
                })
            }
        })
    }

    render() {
        const { nft, errors, loader, isSubmitted, collections, attributes, copiesCheck, attrCheck, dataURI } = this.state
        return (
            <section className="author-area">
                {loader && <FullPageLoader />}
                <div className="profile-detail-banner">
                    <div className="container">
                        <Gamification eventType={this.state.eventType}/* ref={this.gamificationRef} */ />
                        <div className="card">
                            <div className="row justify-content-between">
                                <div className="col-12 col-md-4 mb-md-0 mb-5">
                                    <NFTPreview {...nft} dataURI={dataURI} hasFile={this.state.hasFile} showThumbnailInput={this.state.showThumbnailInput} />
                                </div>
                                <div className="d-none d-md-block col-1">
                                    <div className="divider text-center">
                                        <span className="divider-in"></span>
                                    </div>
                                </div>
                                <div className="col-12 col-md-7">
                                    <div className="mt-5 mt-lg-0 mb-1 mb-lg-1">
                                        <div className="intro mb-4">
                                            <div className="intro-content">
                                                <h3 className="mt-3 mb-0">Create NFT</h3>
                                            </div>
                                        </div>
                                        {/* Form Error */}
                                        {
                                            isSubmitted && errors &&
                                            <div className="row">
                                                <div className="col-12">
                                                    <span id="create-nft-err" className="form-error-msg text-danger">{errors}</span>
                                                </div>
                                            </div>
                                        }
                                    </div>
                                    {/* Item Form */}
                                    <form id="create-nft" className="item-form">
                                        <div className="row">
                                            <div className='col-12'>
                                                <div className="d-flex align-items-center justify-content-between text-white mb-4">
                                                    <span className="format-main-head">Supported File Types</span>
                                                    <div className="create-nft-tooltip">
                                                        <div className="tooltip mobile-view"><FontAwesomeIcon icon={faCircleInfo} className="pink-color" onClick={() => this.setState({ showTooltipMessage: !this.state.showTooltipMessage })} />
                                                            {
                                                                this.state.showTooltipMessage && this.state.fileTypes &&
                                                                <span className="tooltiptext">
                                                                    <span className="create-nft-cross"><FontAwesomeIcon icon={faXmark} className="pink-color" onClick={() => this.setState({ showTooltipMessage: false })} /></span>
                                                                    {
                                                                        this.state.fileTypes.map((type, index) => {
                                                                            return (
                                                                                <div key={index} className="mb-2">
                                                                                    <div className="format-heads">{`${type.fileType.charAt(0).toUpperCase() + type.fileType.slice(1)} files`}</div>
                                                                                    {
                                                                                        <div className="formats">
                                                                                            {
                                                                                                type.supportedExtensions.map((ext, indx) => {
                                                                                                    return <span key={indx}>{`.${ext}${type.supportedExtensions.length - 1 === indx ? '' : ','} `}</span>
                                                                                                })
                                                                                            }
                                                                                        </div>
                                                                                    }
                                                                                </div>
                                                                            )
                                                                        })
                                                                    }
                                                                </span>
                                                            }
                                                        </div>
                                                        <div className="tooltip desktop-view"><FontAwesomeIcon icon={faCircleInfo} className="pink-color" />
                                                            {
                                                                this.state.fileTypes &&
                                                                <span className="tooltiptext">
                                                                    {
                                                                        this.state.fileTypes.map((type, index) => {
                                                                            return (
                                                                                <div key={index} className="mb-2">
                                                                                    <div className="format-heads">{`${type.fileType.charAt(0).toUpperCase() + type.fileType.slice(1)} files`}</div>
                                                                                    {
                                                                                        <div className="formats">
                                                                                            {
                                                                                                type.supportedExtensions.map((ext, indx) => {
                                                                                                    return <span key={indx}>{`.${ext}${type.supportedExtensions.length - 1 === indx ? '' : ','} `}</span>
                                                                                                })
                                                                                            }
                                                                                        </div>
                                                                                    }
                                                                                </div>
                                                                            )
                                                                        })
                                                                    }
                                                                </span>
                                                            }
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-12">
                                                <div className="input-group form-group">
                                                    <div className="custom-file">
                                                        <input type="file" className="custom-file-input" id="file" onChange={(e) => this.onFileChange(e)} name="file" />
                                                        <label id="nft-file-label" className="custom-file-label" htmlFor="file">Choose File *</label>
                                                    </div>
                                                    <span className="text-danger">{this.validator.message('file', nft.file, 'required')}</span>
                                                </div>
                                                {
                                                    this.state.supportedFileTypes && this.state.supportedFileTypes.length ?
                                                        <div className="col-12">
                                                            <div className="form-group">
                                                                <span className="text-white">{`File Types Supported : `} </span>
                                                                {
                                                                    this.state.supportedFileTypes.map((type, ind) => {
                                                                        return <span key={ind} className="text-white">{`${type}${this.state.supportedFileTypes.length - 1 !== ind ? ',' : ''} `}</span>
                                                                    })
                                                                }
                                                            </div>
                                                        </div>
                                                        : null
                                                }
                                                {
                                                    this.state.showThumbnailInput ?
                                                        <div className="input-group form-group">
                                                            <div className="custom-file">
                                                                <input type="file" className="custom-file-input" id="image" accept=".ai, .bmp, .gif, .ico, .jpeg, .jpg, .png, .ps, .psd, .svg, .tif, .tiff" onChange={(e) => this.onFileChange(e)} name="image" />
                                                                <label id="nft-image-label" className="custom-file-label" htmlFor="image">Choose Thumbnail *</label>
                                                            </div>
                                                            <span className="text-danger">{this.validator.message('image', nft.image, 'required')}</span>
                                                        </div> :
                                                        null
                                                }
                                                {
                                                    this.state.supportedThumbnailTypes && this.state.supportedThumbnailTypes.length ?
                                                        <div className="col-12">
                                                            <div className="form-group">
                                                                <span className={this.state.textClassThumbnail}>{`${this.state.textStringThumbnail}: `} </span>
                                                                {
                                                                    this.state.supportedThumbnailTypes.map((type, ind) => {
                                                                        return <span key={ind} className={this.state.textClassThumbnail}>{`${type}${this.state.supportedThumbnailTypes.length - 1 !== ind ? ',' : ''} `}</span>
                                                                    })
                                                                }
                                                            </div>
                                                        </div>
                                                        : null
                                                }
                                            </div>
                                            <div className="col-12">
                                                <div className="form-group">
                                                    <input type="text" className="form-control" name="name" placeholder="Item Name *" onChange={(e) => this.onChange(e)} defaultValue={nft.name} />
                                                    <span className="text-danger">{this.validator.message('name', nft.name, 'required')}</span>
                                                </div>
                                            </div>
                                            <div className="col-12">
                                                <div className="form-group">
                                                    <textarea className="form-control" name="description" placeholder="Description *" cols={30} rows={3} onChange={(e) => this.onChange(e)} defaultValue={nft.description} />
                                                    <span className="text-danger">{this.validator.message('description', nft.description, 'required')}</span>
                                                </div>
                                            </div>
                                            <div className="col-12">
                                                <div className="form-group">
                                                    <select className="form-control" id="collection" name="collectionId" onChange={(e) => this.onChange(e)} value={nft.collectionId}>
                                                        <option className="" value="">Select Collection</option>
                                                        {
                                                            collections && collections.map((collection, index) => {
                                                                return (
                                                                    <option key={index} value={collection._id}>{collection.name}</option>
                                                                )
                                                            })
                                                        }
                                                    </select>
                                                    <span className="text-danger">{this.validator.message('collection', nft.collectionId, 'required')}</span>
                                                </div>
                                            </div>
                                            {/* no. of copies hidden temp. */}
                                            {/* <div className="col-sm-6">
                                                <div className="form-group">
                                                    <input type="text" className="form-control" name="copies" placeholder="No. of Copies" onChange={(e) => this.onChange(e)} defaultValue={nft.copies} onKeyDown={(e) => integerNumberValidator(e)} />
                                                </div>
                                                {
                                                    nft.copies && !copiesCheck && isSubmitted &&
                                                    <span className="text-danger">Allowed count of copies is from 1-115 only.</span>
                                                }
                                            </div> */}


                                            {/* attributes */}
                                            <div className="col-sm-12">
                                                <div className="form-group">
                                                    <div className="form-check form-check-inline">
                                                        <input className="form-check-input cursor-pointer mt-0 me-2" type="checkbox" name="attributes" id="attributes" checked={nft.attributes} onChange={(e) => this.onChange(e)} />
                                                        <label onChange={(e) => this.onChange(e)} className="form-check-label text-white cal-width" htmlFor="attributes">Do you want to add some Attributes to your NFT?</label>
                                                    </div>
                                                </div>
                                            </div>

                                            {
                                                nft.attributes &&
                                                <>
                                                    {
                                                        ((!this.checkValidity() && isSubmitted) || !attrCheck) &&
                                                        <div className="col-sm-12 mb-3">
                                                            <span className="text-danger">If you want to add Attributes, then please provide all the missing attributes first.</span>
                                                        </div>
                                                    }
                                                    {
                                                        attributes.map((attr, index) => {
                                                            return (
                                                                <React.Fragment key={index}>
                                                                    <div className="row position-relative attribute-row">
                                                                        <div className="col-sm-6">
                                                                            <div className="form-group">
                                                                                <input
                                                                                    className="form-control" type="text"
                                                                                    id={`attributes[${index}].trait_type`}
                                                                                    name={`attributes[${index}].trait_type`}
                                                                                    value={attributes[index].trait_type}
                                                                                    placeholder="Attribute Trait Type *"
                                                                                    onChange={(e) => this.onAttrChange(e)}
                                                                                />
                                                                            </div>
                                                                        </div>
                                                                        <div className="col-sm-6">
                                                                            <div className="form-group">
                                                                                <input
                                                                                    className="form-control" type="text"
                                                                                    id={`attributes[${index}].value`}
                                                                                    name={`attributes[${index}].value`}
                                                                                    value={attributes[index].value}
                                                                                    placeholder="Attribute Trait Value *"
                                                                                    onChange={(e) => this.onAttrChange(e)}
                                                                                />
                                                                            </div>
                                                                        </div>
                                                                        {
                                                                            index > 0 &&
                                                                            <span type="button" className="btn-action btn-minus" onClick={() => this.removeAttr(index)}>
                                                                                <FontAwesomeIcon icon={faMinus} />
                                                                            </span>
                                                                        }
                                                                    </div>
                                                                    {
                                                                        (attributes.length - 1) === index &&
                                                                        <div className="col-sm-3">
                                                                            <span type="button" className="btn-action btn-plus" onClick={this.addAttr}>
                                                                                <FontAwesomeIcon icon={faPlus} />
                                                                            </span>
                                                                        </div>
                                                                    }
                                                                </React.Fragment>
                                                            )
                                                        })
                                                    }
                                                </>
                                            }
                                            <div className="col-12 meta-tag">
                                                <button disabled={loader} className="btn w-100 mt-3 mt-sm-4 btn-filled transition no-border" type="button" onClick={(e) => this.submit(e)}><span className="d-block transition">Create NFT</span></button>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>

            </section>
        )
    }
}

const mapStateToProps = state => ({
    error: state.error,
    nft: state.nft,
    collection: state.collection,
});
export default connect(mapStateToProps, { beforeCollection, getCollections, upsertNFT, beforeNFT })(CreateNFT);