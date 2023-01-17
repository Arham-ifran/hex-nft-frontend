import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { listTrade, beforeUser } from '../user/user.action'
import FullPageLoader from '../loaders/full-page-loader';
import Pagination from 'rc-pagination';
import localeInfo from 'rc-pagination/lib/locale/en_US';
import { ENV } from "../../config/config";
import { Button } from "react-bootstrap";
import DateRangePicker from 'react-bootstrap-daterangepicker';
import 'bootstrap-daterangepicker/daterangepicker.css';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';

const Trading = (props) => {
    const key = ENV.getUserKeys('_id');
    const navigate = useNavigate();
    const [loader, setLoader] = useState(true)
    const [pagination, setPagination] = useState(null)
    const [totalVol, setTotalVol] = useState(0)
    const [tradeList, setTradeList] = useState(null)
    const [query, setQuery] = useState(null)
    const [dispDate, setDispDate] = useState({
        startDate: '',
        endDate: ''
    })

    useEffect(() => {
        if (key._id) {
            window.scroll(0, 0)
            props.listTrade()
        }
        else
            navigate('/login')
    }, [])

    useEffect(() => {
        if (props.user.userTradeAuth) {
            const { list, pagination, totalVol } = props.user.userTrade
            setTradeList(list)
            setPagination(pagination)
            setTotalVol(totalVol)
            setLoader(false)
            props.beforeUser()
        }
    }, [props.user.userTradeAuth])

    const onPageChange = async (page) => {
        getTradingHistory({ ...query, page })
    }

    const getTradingHistory = (filter) => {
        setLoader(true)
        const qs = ENV.objectToQueryString(filter)
        props.listTrade(qs)
    }

    const handleEvent = (event, picker) => {
        let startDate = new Date(picker.startDate._d)
        let endDate = new Date(picker.endDate._d)
        setDispDate({
            startDate: moment(startDate).format("DD-MMM-YY"),
            endDate: moment(endDate).format("DD-MMM-YY")
        })
        const qs = ENV.objectToQueryString({
            ...query,
            startDate: startDate.toISOString(),
            endDate: endDate.toISOString()
        })
        props.listTrade(qs)
        setLoader(true)
        setQuery({
            ...query,
            startDate: startDate.toISOString(),
            endDate: endDate.toISOString()
        })
    }

    const resetBtn = () => {
        setQuery({
            wbnb: query.wbnb,
            mynt: query.mynt
        })
        setDispDate({
            startDate: '',
            endDate: ''
        })
        const qs = ENV.objectToQueryString({
            wbnb: query.wbnb,
            mynt: query.mynt
        })
        props.listTrade(qs)
        setLoader(true)
    }

    return (
        <section className="activity-area load-more">
            {loader && <FullPageLoader />}
            <div className="container">
                {/* intro */}
                <div className="row justify-content-center">
                    <div className="col-12 col-md-8 col-lg-7">
                        <div className="intro text-center">
                            <h3 className="mt-3 mb-0">Trading History</h3>
                        </div>
                    </div>
                </div>

                {/* filters */}
                <div className="my-4">
                    <div className="col-md-12">
                        <div className="row">
                            <div className="col-md-12">
                                <div className="form-group d-flex align-items-center justify-content-between">
                                    <div className="trading-buttons">
                                        <DateRangePicker
                                            onApply={handleEvent}
                                        >
                                            <Button className="select-date">
                                                {/* <span className="d-block transition"> */}
                                                    {
                                                        dispDate.startDate ?
                                                            dispDate.startDate + " To " + dispDate.endDate
                                                            : "Select Date"
                                                    }
                                                {/* </span> */}
                                            </Button>
                                        </DateRangePicker>
                                        {
                                            dispDate.startDate ?
                                                <Button className="btn-outlined transition" onClick={resetBtn}>
                                                    <span className="d-block transition">Reset</span>
                                                </Button>
                                                : ''
                                        }
                                    </div>
                                    <div className="ms-4">
                                        <h4 className='mb-0'>Total Volume: {totalVol.toFixed(4)} $</h4>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>

                {/* rankings */}
                <div className="items">
                    <div className="table-responsive mb-3">
                        <table className="table table-borderless table-dark trading-table">
                            <thead>
                                <tr>
                                    <th className="td-start" scope="col">#</th>
                                    <th className="td-date" scope="col">Date &amp; Time</th>
                                    <th className="td-type" scope="col">Type</th>
                                    <th className="td-volume" scope="col">Volume</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    tradeList && tradeList.length ?
                                        tradeList.map((item, index) => {
                                            return (
                                                <tr key={index}>
                                                    <th scope="row">{pagination && ((pagination.limit * pagination.page) - pagination.limit) + index + 1}</th>
                                                    <td>{moment(item.updatedAt).format('MMMM Do YYYY, h:mm:ss a')}</td>
                                                    <td>{item.type}</td>
                                                    <td>{item.price.amount} {item.price.currency} (${item.priceInDollars.toFixed(7)})</td>
                                                </tr>
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
    app: state.app,
    user: state.user
});

export default connect(mapStateToProps, { listTrade, beforeUser })(Trading);