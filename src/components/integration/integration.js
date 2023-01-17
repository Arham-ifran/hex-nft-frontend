import React, { Component } from 'react'
import { connect } from 'react-redux';
import { beforeIntegration, createIntegration } from './integration.action.js';
import { beforeCategory, getCategories } from '../categories/categories.action';
import { emptyError } from '../../redux/shared/error/error.action';
import $ from 'jquery'
import SimpleReactValidator from 'simple-react-validator'
import FullPageLoader from '../../components/loaders/full-page-loader';
import { ENV } from '../../config/config';

class Integration extends Component {
    constructor(props) {
        super(props)
        this.state = {
            isSubmitted: false,
            formValid: true,
            loader: false,
            errors: '',
            integration: {
                address: '',
                categoryId: '',
                bscType: ''
            },
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
        window.scroll(0, 0)
        const { _id } = ENV.getUserKeys('_id')
        if (!_id)
            window.location.href = '/login'// this.props.navigation('/login')
        else
            this.props.getCategories()
    }

    componentDidUpdate() {
        if (this.props.error) {
            this.setState({ loader: false }, () => {
                this.props.emptyError()
            })
        }

        if (this.props.category.getAuth) {
            const { categories } = this.props.category
            this.setState({ categories, loader: false }, () => {
                this.props.beforeCategory()
            })
        }

        if (this.props.integration.createAuth) {
            this.setState({
                loader: false
            }, () => {
                const { collectionUrl } = this.props.integration.integration
                this.props.beforeIntegration()
                this.props.navigation(`/collection/${collectionUrl}`)
            })
        }
    }

    onChange(e) {
        let { name, value } = e.target
        let { integration } = this.state
        integration = { ...integration, [name]: value }
        this.setState({ integration })
    }

    reset = () => {
        const integration = {
            address: '',
            categoryId: '',
            bscType: ''
        }
        this.setState({ integration, isSubmitted: false })
    }

    submit = (e) => {
        e.preventDefault();

        // get usr address
        const { address } = ENV.getUserKeys('address')

        this.setState({ isSubmitted: true, formValid: this.validator.allValid() && address }, () => {
            const { formValid } = this.state
            if (formValid) {
                this.setState({
                    loader: true,
                }, async () => {
                    let { integration } = this.state
                    this.props.createIntegration({ ...integration, userAddr: address })
                })
            } else {
                this.validator.showMessages()
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
        const { integration, errors, loader, isSubmitted, categories } = this.state

        return (
            <section className="author-area">
                {loader && <FullPageLoader />}
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-12 col-md-8 col-lg-7">
                            <div className="mt-5 mt-lg-0 mb-4 mb-lg-5">
                                <div className="intro text-center">
                                    <h3 className="my-4">{"Integration"}</h3>
                                    <p>You can integrate your customized NFTs to input your NFT smart contract address and select collection type. Your NFT collection will show up in a few mins once your registration success.</p>
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
                            <form id="create-collection" className="item-form integration-form card no-hover" onSubmit={(e) => this.submit(e)}>
                                <div className="row">
                                    {/* <div className="col-12">
                                        <div className="form-group">
                                            <span className="no-padding">
                                                <select className="form-control" id="bscType" name="bscType" onChange={(e) => this.onChange(e)}>
                                                    <option value={null}>Select BSC Type*</option>
                                                    <option value={1}>BSC - Mainnet</option>
                                                    <option value={2}>BSC - Testnet</option>
                                                </select>
                                            </span>
                                            <span className="text-danger">{this.validator.message('bscType', integration.bscType, 'required')}</span>
                                        </div>
                                    </div> */}
                                    <div className="col-12">
                                        <div className="form-group">
                                            <span className="no-padding">
                                                <select className="form-control" id="category" name="categoryId" onChange={(e) => this.onChange(e)}>
                                                    <option value="">Select Category *</option>
                                                    {
                                                        categories && categories.map((category, index) => {
                                                            return (
                                                                <option key={index} value={category._id}>{category.name}</option>
                                                            )
                                                        })
                                                    }
                                                </select>
                                            </span>
                                            <span className="text-danger">{this.validator.message('category', integration.categoryId, 'required')}</span>
                                        </div>
                                    </div>
                                    <div className="col-12">
                                        <div className="form-group">
                                            <input type="text" className="form-control" name="address" placeholder="Address *" onChange={(e) => this.onChange(e)} defaultValue={integration.address} />
                                            <span className="text-danger">{this.validator.message('address', integration.address, 'required')}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-12">
                                    <button disabled={loader} className="btn w-100 mt-3 mt-sm-4 btn-filled transition no-border" type="submit">
                                        <span className="d-block transition">Submit</span>
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </section>
        )
    }
}

const mapStateToProps = state => ({
    integration: state.integration,
    category: state.category,
    error: state.error
});

export default connect(mapStateToProps, { beforeIntegration, createIntegration, beforeCategory, getCategories, emptyError })(Integration);