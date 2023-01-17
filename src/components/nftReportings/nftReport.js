import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { ENV } from '../../config/config';
import FullPageLoader from '../loaders/full-page-loader';
import { beforeReports, getReport, addReportResponse } from './nftReportings.action';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { uploadPlugin } from '../../components/ckEditor/ckEditor'
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from "react-bootstrap";
import validator from 'validator';


const ViewNftReport = (props) => {

    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [userId, setUserId] = useState(ENV.getUserKeys()?._id)
    const [loader, setLoader] = useState(true)
    const [reportDetails, setReportDetails] = useState()
    const [reportMessages, setReportMessages] = useState()
    const [user, setUser] = useState()
    const [messageContent, setContent] = useState('')
    const [msg, setMsg] = useState('')
    const { reportId } = useParams()
    const reportRes = useSelector((state) => state.reports.getReportRes)
    const addReportRes = useSelector((state) => state.reports.addReportResponseData)
    useEffect(() => {
        if (userId) {
            dispatch(getReport(reportId))
        }
        else {
            navigate('/login')
        }
    }, [])

    useEffect(() => {
        if (reportRes.success) {
            setLoader(false)
            setReportDetails(reportRes.reportDetails && reportRes.reportDetails.length ? reportRes.reportDetails[0] : {})
            setReportMessages(reportRes.reportMessages && reportRes.reportMessages.length ? reportRes.reportMessages : [])
            setUser(reportRes.reportDetails && reportRes.reportDetails.length ? reportRes.reportDetails[0].reportedFrom : {})
        }
    }, [reportRes])

    useEffect(() => {
        if (addReportRes && Object.keys(addReportRes).length > 0) {
            if (addReportRes.success) {
                setLoader(false)
            }
        }
    }, [addReportRes])

    const onEditorChange = (event, editor) => {
        let editorData = editor.getData();
        setContent(editorData)
        setMsg('')
    }


    const addReportResponseHandler = () => {
        if (messageContent !== '') {
            setReportMessages([...reportMessages, { reportId, user: { userId: user.id, name: user.name }, userResponse: messageContent }])
            let payload = {
                reportId,
                id: user.id,
                content: messageContent
            }
            setContent('')
            setMsg('')
            dispatch(addReportResponse(payload))
            setLoader(true)
        }
        else{
            setMsg('This field is required')
        }
    }

    return (
        <section className="activity-area load-more text-white nft-report">
            {loader ?
                <FullPageLoader /> :
                <>
                    {
                        reportDetails ?
                            <div className="container">
                                <div className="row justify-content-center">
                                    <div className="col-12 col-md-8 col-lg-7">
                                        <div className="intro text-center">
                                            <h3 className="mt-3 mb-0">NFT Report</h3>
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-group ">
                                            <label className="form-check-label">Title</label>
                                            <input type="text" className="form-control" name="title" value={reportDetails?.nft?.nftTitle} readOnly />
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-group ">
                                            <label className="form-check-label">Reported To</label>
                                            <input type="text" className="form-control" name="reportedTo" value={reportDetails?.reportedUser?.reportedTo} readOnly />
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-group ">
                                            <label className="form-check-label">Description</label>
                                            <div className="form-control" name="description" dangerouslySetInnerHTML={{ __html: reportDetails?.description }} readOnly />
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-group ">
                                            <label className="form-check-label">Status</label>
                                            <input type="text" className="form-control" name="status" value={reportDetails && reportDetails?.status ? reportDetails?.status === 1 ? 'Pending' : reportDetails?.status === 2 ? 'In Review' : 'Resolved' : ''} readOnly />
                                        </div>
                                    </div>
                                    <div className="col-12">
                                        <div className="form-group ">
                                            <label className="form-check-label">Messages</label>
                                            <div>
                                                {
                                                    reportMessages && reportMessages.length ?
                                                        reportMessages.map((msg, index) => {
                                                            return <span key={index} dangerouslySetInnerHTML={{ __html: msg.adminResponse ? `${msg.admin?.name} : ${msg.adminResponse}` : `${msg.user.name} : ${msg.userResponse}` }}></span>
                                                        })
                                                        :
                                                        <div className="no-data border m-0"><p className="text-center">No Messages Found</p></div>
                                                }
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-12">
                                        <div className="form-group mb-5">
                                            <label className="form-check-label">Message Content<span>*</span></label>
                                            <CKEditor
                                                // config={{
                                                //     extraPlugins: [uploadPlugin]
                                                // }}
                                                editor={ClassicEditor}
                                                data={messageContent || ''}
                                                content={messageContent || ''}
                                                onChange={(event, editor) => {
                                                    onEditorChange(event, editor);
                                                }}
                                                onError={(error) => {
                                                    console.log('CKEDITOR ERR: ', error);
                                                }}
                                            />
                                        <span className={`text-danger pl-1 ${msg ? `` : `d-none`}`}>{msg}</span>
                                        </div>
                                    </div>
                                    <div className="col-12">
                                        <Button type="button" className="btn btn-filled no-border transition" onClick={addReportResponseHandler} >
                                            <span className="d-block transition">Add Response</span>
                                        </Button>
                                    </div>
                                </div>
                            </div> :
                            <div className="no-data border"><p className="text-center">No report found</p></div>

                    }
                </>
            }
        </section>
    )
}

export default ViewNftReport