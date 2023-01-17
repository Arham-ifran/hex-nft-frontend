import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { connect } from 'react-redux';
import { beforeEarning, getEarnings } from './earnings.action';
import FullPageLoader from '../loaders/full-page-loader';
import Pagination from 'rc-pagination';
import localeInfo from 'rc-pagination/lib/locale/en_US';
import { useWindowSize } from '../../hooks/useWindowSize'
import { ENV } from '../../config/config'
import { ipfsToUrl } from '../../utils/functions'
const { globalPlaceholderImage } = ENV

const Earnings = (props) => {
    const navigate = useNavigate();
    const userId = ENV.getUserKeys()?._id
    const [loader, setLoader] = useState(true)
    const [earnings, setEarnings] = useState(null)
    const [pagination, setPagination] = useState(null)

    const [isTableHorizontal, setIsTableHorizontal] = useState(true)
    const [isNameShort, setIsNameShort] = useState(false)

    const { width } = useWindowSize() || {};
    useEffect(() => {
        if (width <= 1100) {
            setIsTableHorizontal(false);
        } else {
            setIsTableHorizontal(true);
        }
        if (width <= 575) {
            setIsNameShort(true);
        } else {
            setIsNameShort(false);
        }
    }, [width])

    useEffect(() => {
        window.scroll(0, 0)
        if (userId)
            props.getEarnings()
        else
            navigate('/login')
    }, [])

    // useEffect(() => {
    //     // when an error is received
    //     if (props.error && props.error.invalidOwner)
    //         props.history.push('/profile')
    // }, [props.error && props.error.invalidOwner])

    useEffect(() => {
        if (props.earnings.earningsAuth) {
            const { earnings, pagination } = props.earnings.earnings
            setLoader(false)

            // set earnings & it's pagination
            setEarnings(earnings)
            setPagination(pagination)

            props.beforeEarning()
        }
    }, [props.earnings.earningsAuth])

    const onPageChange = async (page) => {
        setLoader(true)
        props.getEarnings({ page })
    }

    return (
        <section className="activity-area load-more">
            {loader && <FullPageLoader />}
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-12 col-md-8 col-lg-7">
                        <div className="intro text-center">
                            <h3 className="my-4">Owner Commission Earnings</h3>
                            <p>After your old NFTs are transferred to valid owners, your completed earnings to you will appear here.</p>
                        </div>
                    </div>
                </div>

                {/* earnings */}
                <div className="items">
                    <div className="table-responsive mb-3">
                        <table className={`table table-dark ranking-table ${isTableHorizontal ? "border-0 table-borderless" : "border-collapse"}`}>
                            {isTableHorizontal && <thead>
                                <tr>
                                    <th className="td-start" scope="col">#</th>
                                    <th className="td-item" scope="col">Item</th>
                                    <th className="td-fee" scope="col">Fee Earned</th>
                                    <th className="td-earning" scope="col">Earning Status</th>
                                </tr>
                            </thead>}
                            <tbody>
                                {
                                    earnings && earnings.length ?
                                        earnings.map((item, index) => {
                                            if (isTableHorizontal) {
                                                return (
                                                    <tr key={index}>
                                                        <th scope="row">{pagination && ((pagination.limit * pagination.page) - pagination.limit) + index + 1}</th>
                                                        <td>
                                                            <Link className="d-flex align-items-center ranking-collection-name" to={`/item-details/${window.btoa(item.nft._id)}`}>
                                                                <p className="p-1">
                                                                <img className="rounded-border" src={ipfsToUrl(item.nft.image ? item.nft.image : globalPlaceholderImage)} alt={`NFT-image-${index}`} />
                                                                </p>
                                                                <p className="p-2">
                                                                    {item.nft.name}
                                                                </p>
                                                            </Link>
                                                        </td>
                                                        <td>{item.price.amount} {item.price.currency}</td>
                                                        <td>{item.status}</td>
                                                    </tr>
                                                )
                                            }
                                            return (
                                                <React.Fragment key={index}>
                                                    <tr className={index !== 0 ? 'border-top-thick' : 'border-0'}>
                                                        <th className='w-50'>#</th>
                                                        <th className='w-50'>{pagination && ((pagination.limit * pagination.page) - pagination.limit) + index + 1}</th>
                                                    </tr>
                                                    <tr>
                                                        <th className='w-50'>Item</th>
                                                        <td className='w-50'>
                                                            <Link className="d-flex ranking-collection-name" to={`/item-details/${window.btoa(item.nft._id)}`}>
                                                                <p className="pl-0 pt-2 pb-2 pr-2">
                                                                    {
                                                                        isNameShort ? (`${item.nft.name.substr(
                                                                            0,
                                                                            4
                                                                        )}...${item.nft.name.substr(
                                                                            item.nft.name.length - 4,
                                                                            4
                                                                        )}`) : (item.nft.name)
                                                                    }
                                                                </p>
                                                                <p className="p-1">
                                                                    <img className="rounded-border" src={ipfsToUrl(item.nft.image ? item.nft.image : globalPlaceholderImage)} alt={`NFT-image-${index}`} />
                                                                </p>
                                                            </Link>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <th className='w-50'>Fee Earned</th>
                                                        <td className='w-50'>{item.price.amount} {item.price.currency}</td>
                                                    </tr>
                                                    <tr>
                                                        <th className='w-50'>Owner Earnings</th>
                                                        <td className='w-50'>{item.status}</td>
                                                    </tr>
                                                </React.Fragment>
                                            )
                                        })
                                        :
                                        <tr>
                                            <td colSpan="4" className="text-center">
                                                <span className="no-data-table">No Data Found</span>
                                            </td>
                                        </tr>
                                }
                            </tbody>
                        </table>
                    </div>
                    {
                        pagination && pagination.total > 0 &&
                        <Pagination
                            defaultCurrent={1}
                            pageSize // items per page
                            current={pagination.page} // current active page
                            total={pagination.pages} // total pages
                            onChange={onPageChange}
                            locale={localeInfo}
                        />
                    }
                </div>
            </div>
        </section>
    );
}

const mapStateToProps = state => ({
    earnings: state.earnings,
    error: state.error
});

export default connect(mapStateToProps, { beforeEarning, getEarnings })(Earnings)