import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { ENV } from '../../config/config';
import FullPageLoader from '../loaders/full-page-loader';
import Pagination from 'rc-pagination';
import 'rc-pagination/assets/index.css';
import localeInfo from 'rc-pagination/lib/locale/en_US';
import { beforeReports, getUserNftReports, getReportedNftUsers } from './nftReportings.action';
import moment from 'moment';
import { useWindowSize } from '../../hooks/useWindowSize'
import Select from 'react-select';
import { Link, useNavigate } from 'react-router-dom';
var CryptoJS = require("crypto-js");

const NftReportings = (props) => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [user, setUser] = useState()
    const [userNftReports, setNftReports] = useState()
    const [reportedUsers, setReportedUsers] = useState()
    const [pagination, setPagination] = useState(null)
    const [loader, setLoader] = useState(false)
    const [isTableHorizontal, setIsTableHorizontal] = useState(true)
    const [filters, setFilters] = useState()
    let statusOptions = [
        { value: '1', label: 'Pending' },
        { value: '2', label: 'In Review' },
        { value: '3', label: 'Resolved' },
    ]

    const [searchTitle, setSearchTitle] = useState('')

    const getUserNftReportsRes = useSelector(state => state.reports.getUserNftReportsRes)
    const getReportedNftUsersRes = useSelector(state => state.reports.getReportedNftUsersRes)

    const { width } = useWindowSize() || {};
    useEffect(() => {
        if (width <= 1100) {
            setIsTableHorizontal(false);
        } else {
            setIsTableHorizontal(true);
        }

    }, [width]);

    useEffect(() => {
        window.scroll(0, 0)
        let userDecrypted = '';
        if (localStorage.getItem('encuse')) {
            let encryptedUser = localStorage.getItem('encuse')
            userDecrypted = JSON.parse(CryptoJS.AES.decrypt(encryptedUser, ENV.dataEncryptionKey).toString(CryptoJS.enc.Utf8));
            setUser(userDecrypted)

            let filter = {}
            filter.page = 1
            filter.limit = 10

            dispatch(beforeReports())
            dispatch(getUserNftReports(filter, userDecrypted?._id))
            dispatch(getReportedNftUsers(userDecrypted?._id))
        }
        else {
            navigate('/login')
        }
        
        
        
    }, [])

    useEffect(() => {
        if (getReportedNftUsersRes.reportedUsers) {
            let options = getReportedNftUsersRes.reportedUsers?.map((user) => ({ value: user._id, label: user.name }))
            setReportedUsers(options)
        }
    }, [getReportedNftUsersRes])


    useEffect(() => {
        if (getUserNftReportsRes && Object.keys(getUserNftReportsRes).length > 0) {
            setLoader(false)
            setNftReports(getUserNftReportsRes.reports)
            setPagination(getUserNftReportsRes.pagination)
        }
    }, [getUserNftReportsRes])


    const onPageChange = async (page) => {
        setLoader(true)
        dispatch(getUserNftReports({ page }, user._id))
    }
    const handleOnChange = (option, select) => {
        let filter = {
            ...filters
        }

        if (option) {
            filter[select.name] = option.value
            if (searchTitle && searchTitle !== '') {
                filter.nftTitle = searchTitle
            }
        }
        else {
            if (searchTitle === '') {
                delete filter[select.name]
                dispatch(getUserNftReports({}, user._id))
            }
            else {
                delete filter[select.name]
                filter.nftTitle = searchTitle

            }
        }
        setFilters(filter)

    }
    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            setFilters({ ...filters, nftTitle: searchTitle })
        }
    }

    useEffect(() => {
        if (filters && Object.keys(filters).length > 0) {
            dispatch(getUserNftReports(filters, user._id))
            setLoader(true)
        }
    }, [filters])


    return (
        <section className="activity-area load-more">
            {loader && <FullPageLoader />}
            <div className="container">
                {/* intro */}
                <div className="row justify-content-center">
                    <div className="col-12 col-md-8 col-lg-7">
                        <div className="intro text-center">
                            <h3 className="mt-3 mb-0">NFTs Reporting</h3>
                        </div>
                    </div>
                </div>

                {/* filters */}
                <div className="my-4">
                    <div className="col-md-12">
                        <div className="row">
                            <div className="col-md-4">
                                <div className="form-group">
                                    <input type="text" name="searchTitle" value={searchTitle} placeholder="NFT Report Title" onKeyPress={handleKeyPress} onChange={(e) => setSearchTitle(e.target.value)}></input>
                                </div>
                            </div>
                            <div className="col-md-4">
                                <div className="form-group">
                                    <Select
                                        options={statusOptions}
                                        value={statusOptions.filter(option => option.value === (filters?.status || null))}
                                        onChange={handleOnChange}
                                        className="select-custom-style"
                                        placeholder="Select Status"
                                        classNamePrefix="custom-select"
                                        name="status"
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
                                </div>
                            </div>
                            <div className="col-md-4">
                                <div className="form-group">
                                    <Select
                                        options={reportedUsers && reportedUsers.length ? reportedUsers : []}
                                        value={reportedUsers && reportedUsers.length ? reportedUsers.filter(option => option.value === (filters?.reportedTo || null)) : null}
                                        onChange={handleOnChange}
                                        className="select-custom-style"
                                        placeholder="Select Reported To"
                                        classNamePrefix="custom-select"
                                        name="reportedTo"
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
                                </div>
                            </div>
                        </div>

                    </div>
                </div>

                {/* rankings */}
                <div className="items">
                    <div className="table-responsive mb-3">
                        <table className={`table nft-report-table table-dark nft-reporting-table ${isTableHorizontal ? "border-0 table-borderless" : "border-collapse"}`}>
                            {isTableHorizontal && <thead>
                                <tr>
                                    <th className="td-start" scope="col">#</th>
                                    <th className="td-nft-report" scope="col">NFT Report Title</th>
                                    <th className="td-reported-to" scope="col">Reported To</th>
                                    <th className="td-status" scope="col">Status</th>
                                    <th className="td-reported-at" scope="col">Reported At</th>
                                </tr>
                            </thead>}
                            <tbody>
                                {
                                    userNftReports && userNftReports.length ?
                                        userNftReports.map((item, index) => {
                                            if (isTableHorizontal) {
                                                return (
                                                    <tr key={index}>
                                                        <th scope="row">{pagination && ((pagination.limit * pagination.page) - pagination.limit) + index + 1}</th>
                                                        <td>
                                                            <Link className="d-flex ranking-collection-name" to={`${item._id}`}>
                                                                <p className="p-2 td-pink-color">
                                                                    {item.nft ? item.nft.name : ''}
                                                                </p>

                                                            </Link>
                                                        </td>
                                                        {/* <td>{item.nft ? item.nft.name : ''}</td> */}
                                                        <td>{item.reportedUser ? item.reportedUser.name : ''}</td>
                                                        <td>{item.status ? item.status === 1 ? 'Pending' : item.status === 2 ? 'In Review' : 'Resolved' : ''}</td>
                                                        <td>{item.createdAt ? moment(item.createdAt).format('DD MMM YYYY') : ''}</td>
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
                                                        <th className='w-50 td-pink-color'>NFT Report Title</th>
                                                        <td className='w-50'>
                                                            <Link className="d-flex ranking-collection-name" to={`${item._id}`}>
                                                                <p className="pl-0 pt-2 pb-2 pr-2">
                                                                    {item.nft ? item.nft.name : ''}
                                                                </p>

                                                            </Link>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <th className='w-50'>Reported To</th>
                                                        <td className='w-50'>{item.reportedUser ? item.reportedUser.name : ''}</td>
                                                    </tr>
                                                    <tr>
                                                        <th className='w-50'>24h%</th>
                                                        <td className='w-50'>{item.status ? item.status === 1 ? 'Pending' : item.status === 2 ? 'In Review' : 'Resolved' : ''}</td>
                                                    </tr>
                                                    <tr>
                                                        <th className='w-50'>7d%</th>
                                                        <td className='w-50'>{item.createdAt ? moment(item.createdAt).format('DD MMM YYYY') : ''}</td>
                                                    </tr>
                                                </React.Fragment>
                                            )
                                        })
                                        :
                                        <tr>
                                            <td colSpan="5" className="text-center">
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
    )
}

export default NftReportings;