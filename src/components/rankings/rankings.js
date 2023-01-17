import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { beforeRanking, getRankings } from './rankings.action';
import FullPageLoader from '../loaders/full-page-loader';
import Pagination from 'rc-pagination';
import localeInfo from 'rc-pagination/lib/locale/en_US';
import { ENV } from "../../config/config";
import Select from 'react-select';
import { useWindowSize } from '../../hooks/useWindowSize'
const { cdnBaseUrl } = ENV
const bnbIcon = `${cdnBaseUrl}v1652166662/hex-nft/assets/binance_r40wgm.svg`

const Rankings = (props) => {
    const [loader, setLoader] = useState(true)
    const [stats, setStats] = useState(null)
    const [pagination, setPagination] = useState(null)
    const [cat, setCat] = useState([{
        value: '',
        label: 'All'
    }])
    const sort = [
        { value: 'v24h', label: 'Last 24 Hours' },
        { value: 'v7d', label: 'Last 7 Days' },
        { value: 'v30d', label: 'Last 30 Days' },
        { value: 'volume', label: 'All Time' }
    ]


    const [isTableHorizontal, setIsTableHorizontal] = useState(true)
    const [isAddressShort, setIsAddressShort] = useState(false)

    const { width } = useWindowSize() || {};
    useEffect(() => {
        if (width <= 1100) {
            setIsTableHorizontal(false);
        } else {
            setIsTableHorizontal(true);
        }
        if (width <= 575) {
            setIsAddressShort(true);
        } else {
            setIsAddressShort(false);
        }
    }, [width]);


    // for filters only
    const [filter, setFilter] = useState(null)

    useEffect(() => {
        window.scroll(0, 0)
        getRankings({ getCategories: true })
    }, [])

    useEffect(() => {
        if (props.rankings.statsAuth) {
            const { stats, pagination, categories, getCategories } = props.rankings.stats
            setLoader(false)

            // set stats & it's pagination
            setStats(stats)
            setPagination(pagination)

            // set categories on first call only
            if (getCategories) {
                setCat([...cat, ...categories])
            }

            props.beforeRanking()
        }
    }, [props.rankings.statsAuth])

    const onPageChange = async (page) => {
        getRankings({ page })
    }

    const getRankings = (filter) => {
        setLoader(true)
        const qs = ENV.objectToQueryString(filter)
        props.getRankings(qs)
    }

    const handleChange = (selectedOption, select) => {
        const filterData = {
            ...filter,
        }
        if (selectedOption) {
            if (selectedOption.value) {
                filterData[select.name] = selectedOption.value
            }
            else {
                delete filterData[select.name]
            }
        }
        else {
            delete filterData[select.name]
        }
        setFilter(filterData)
        getRankings(filterData)
    }

    const handleSortChange = (selectedOption) => {
        const filterData = {
            ...filter,
        }
        if (selectedOption) {
            filterData['sortByVol'] = selectedOption.value
        }
        else {
            delete filterData['sortByVol']
        }
        setFilter(filterData)
        getRankings(filterData)
    }

    return (
        <section className="activity-area load-more">
            {loader && <FullPageLoader />}
            <div className="container">
                {/* intro */}
                <div className="row justify-content-center">
                    <div className="col-12 col-md-8 col-lg-7">
                        <div className="intro text-center">
                            {/* <span>Rankings</span> */}
                            <h3 className="my-4">Top NFTs</h3>
                            <p>The top NFTs on {ENV.appName}, ranked by volume and other statistics.</p>
                        </div>
                    </div>
                </div>

                {/* filters */}
                <div className="my-4">
                    <div className="col-md-12">
                        <div className="row">
                            <div className="col-md-4">
                                <div className="form-group">
                                    {
                                        cat &&
                                        <Select
                                            options={cat}
                                            value={cat.filter(option => option.value === (filter?.categoryId || null))}
                                            onChange={handleChange}
                                            className="select-custom-style"
                                            placeholder="Select Category"
                                            classNamePrefix="custom-select"
                                            name="categoryId"
                                            styles={{
                                                menu: (provided, state) => ({
                                                    ...provided,
                                                    color: state.isDisabled ? 'grey' : 'hsl(0,0%,20%)',
                                                    cursor: state.isDisabled ? 'not-allowed' : 'pointer'
                                                })
                                            }}
                                            isClearable={true}
                                            isSearchable={false}
                                        />
                                    }
                                </div>
                            </div>
                            <div className="col-md-4">
                                <div className="form-group">
                                    {
                                        cat &&
                                        <Select
                                            options={sort}
                                            onChange={handleSortChange}
                                            className="select-custom-style"
                                            placeholder="Sort"
                                            classNamePrefix="custom-select"
                                            name="categoryId"
                                            styles={{
                                                menu: (provided, state) => ({
                                                    ...provided,
                                                    color: state.isDisabled ? 'grey' : 'hsl(0,0%,20%)',
                                                    cursor: state.isDisabled ? 'not-allowed' : 'pointer'
                                                })
                                            }}
                                            isClearable={true}
                                            isSearchable={false}
                                        />
                                    }
                                </div>
                            </div>
                        </div>

                    </div>
                </div>

                {/* rankings */}
                <div className="items">
                    <div className="table-responsive mb-3">
                        <table className={`table table-dark ranking-table ${isTableHorizontal ? "border-0 table-borderless" : "border-collapse"}`}>
                            {isTableHorizontal && <thead>
                                <tr>
                                    <th className="td-start" scope="col">#</th>
                                    <th className="td-collection" scope="col">Collection</th>
                                    <th className="td-volume" scope="col">Volume</th>
                                    <th className="td-hours" scope="col">24h%</th>
                                    <th className="td-days" scope="col">7d%</th>
                                    <th className="td-owners" scope="col">Owners</th>
                                    <th className="td-assets" scope="col">Assets</th>
                                </tr>
                            </thead>}
                            <tbody>
                                {
                                    stats && stats.length ?
                                        stats.map((item, index) => {
                                            if (isTableHorizontal) {
                                                return (
                                                    <tr key={index}>
                                                        <th scope="row">{pagination && ((pagination.limit * pagination.page) - pagination.limit) + index + 1}</th>
                                                        <td>
                                                            <Link className="d-flex align-items-center ranking-collection-name" to={`/collection/${item.collection.url}`}>
                                                                <p className="p-1">
                                                                    <img className="rounded-border" src={item.collection.logo} alt="img" />
                                                                </p>
                                                                <p className="p-2">
                                                                    {item.collection.name}
                                                                </p>
                                                            </Link>
                                                        </td>
                                                        <td>
                                                            <img className="img-fluid" src={bnbIcon} alt="Bnb Icon" width={20} height={20} />
                                                            &nbsp;
                                                            {item.volume ? item.volume : 0}
                                                        </td>
                                                        <td>{item.p24h ? item.p24h : '---'}</td>
                                                        <td>{item.p7d ? item.p7d : '---'}</td>
                                                        <td>{item.owners ? item.owners : '---'}</td>
                                                        <td>{item.assets ? item.assets : '---'}</td>
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
                                                        <th className='w-50'>Collection</th>
                                                        <td className='w-50'>
                                                            <Link className="d-flex ranking-collection-name" to={`/collection/${item.collection.url}`}>
                                                                <p className="pl-0 pt-2 pb-2 pr-2">
                                                                    {
                                                                        isAddressShort ? (`${item.collection.name.substr(
                                                                            0,
                                                                            4
                                                                        )}...${item.collection.name.substr(
                                                                            item.collection.name.length - 4,
                                                                            4
                                                                        )}`) : (item.collection.name)
                                                                    }
                                                                </p>
                                                                <p className="p-1">
                                                                    <img className="rounded-circle" src={item.collection.logo} alt="img" />
                                                                </p>
                                                            </Link>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <th className='w-50'>Volume</th>
                                                        <td className='w-50'>
                                                            {item.volume ? item.volume : 0}
                                                            &nbsp;
                                                            <img className="img-fluid" src={bnbIcon} alt="Bnb Icon" width={20} height={20} />
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <th className='w-50'>24h%</th>
                                                        <td className='w-50'>{item.p24h ? item.p24h : '---'}</td>
                                                    </tr>
                                                    <tr>
                                                        <th className='w-50'>7d%</th>
                                                        <td className='w-50'>{item.p7d ? item.p7d : '---'}</td>
                                                    </tr>
                                                    <tr>
                                                        <th className='w-50'>Owners</th>
                                                        <td className='w-50'>{item.owners ? item.owners : '---'}</td>
                                                    </tr>
                                                    <tr>
                                                        <th className='w-50'>Assets</th>
                                                        <td className='w-50'>{item.assets ? item.assets : '---'}</td>
                                                    </tr>
                                                </React.Fragment>
                                            )
                                        })
                                        :
                                        <tr>
                                            <td colSpan="7" className="text-center">
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
    rankings: state.rankings
});

export default connect(mapStateToProps, { beforeRanking, getRankings })(Rankings);