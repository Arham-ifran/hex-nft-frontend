import { getContentPage, beforeContent } from './cms.actions';
import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { useParams } from 'react-router-dom';

const ContentPage = (props) => {

    const { slug } = useParams()
    const dispatch = useDispatch()
    const [contentPageData, setContentPageData] = useState(null)
    const contentPageRes = useSelector((state) => state.cms)

    useEffect(() => {
        window.scroll(0, 0)
        if(slug){
            dispatch(getContentPage(slug))
        }
    }, [])

    useEffect(() =>{
        if(contentPageRes.cmsAuth){
            setContentPageData(contentPageRes.contentPageRes?.content)
        }

    },[contentPageRes.cmsAuth])
    

    return (
        <section>
            {
                contentPageData && Object.keys(contentPageData).length > 0 ?
                    <div className="container">
                        <div className="row justify-content-center">
                            <div className="col-12 col-md-8 col-lg-7">
                                <div className="intro text-center">
                                    <h3 className="mt-3 mb-0">{contentPageData.title}</h3>
                                </div>
                            </div>
                        </div>
                        <div className="row justify-content-center">
                            <div className="col-12">
                                <div className="faq-content"
                                dangerouslySetInnerHTML = {{ __html: contentPageData.description }}>
                                </div>
                            </div>
                        </div>
                    </div> : null

            }
            
        </section>
    );
}

export default ContentPage;