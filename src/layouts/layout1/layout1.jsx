import React, { useState, useEffect } from "react";
import { connect } from 'react-redux';
import { useLocation } from "react-router-dom";
import Header from '../../components/home/header/Header';
import Breadcrumb from '../../components/breadcrumb/breadcrumb';
import Footer from '../../components/home/footer/Footer';
import ModalSearch from '../../components/modal-search/modal-search';
import ModalMenu from '../../components/modal-menu/modal-menu';
import Scrollup from '../../components/scroll-up/sroll-up';
import { beforeUser } from '../../components/user/user.action'
import { ENV } from '../../config/config'
const { cdnBaseUrl } = ENV
const bannerImg = `${cdnBaseUrl}v1652166290/hex-nft/assets/profile-banner_b5f0hp.png`;

const Layout1 = (props) => {
    const { pathname } = useLocation();
    const { title } = props;
    const [banner, setBanner] = useState(null)

    useEffect(() => {
        const defaultBannerScreen = [
            '/integration',
            '/contact',
            '/privacy-and-terms',
            '/how-it-works',
            '/help-center'
        ]
        const key = ENV.getUserKeys('_id');

        if (defaultBannerScreen.includes(pathname))
            setBanner(null)
        else if (key._id)
            setBanner(null)
    }, [])

    useEffect(() => {
        if (props.category.getCategory) {
            const { category } = props.category?.category || null

            if (banner !== category?.banner)
                setBanner(category.banner)
        }
    }, [props.category.getCategory])

    useEffect(() => {
        if (props.collection.getAuth && props.collection.collection) {
            const { collection } = props.collection

            if (banner !== collection?.banner)
                setBanner(collection.banner)
        }
    }, [props.collection.getAuth, props.collection.collection])

    useEffect(() => {
        if (props.user?.individualUser) {
            const user = props.user?.individualUser
            if ((pathname.includes('/profile') || pathname.includes('/author/')) && banner !== user?.bannerImage) {
                setBanner(user?.bannerImage)
            }
        }
    }, [props.user?.individualUser])

    useEffect(() => {
        if ((pathname.includes('/integration') || pathname.includes('/contact') || pathname.includes('/how-it-works') || pathname.includes('/privacy-and-terms') || pathname.includes('/help-center'))) {
            setBanner(null)
        }
    })

    useEffect(() => {
        if (props.user.bannerAuth) {
            setBanner(props.user.banner)
            props.beforeUser()
        }
    }, [props.user.bannerAuth])

    return (
        <div className="main">
            <Header />
            <Breadcrumb title={title} banner={banner || bannerImg} />
            {props.children}
            <Footer />
            <ModalSearch />
            <ModalMenu />
            <Scrollup />
        </div>
    );
}

const mapStateToProps = state => ({
    statestore: state,
    error: state.error,
    collection: state.collection,
    user: state.user,
    category: state.category,
});

export default connect(mapStateToProps, { beforeUser })(Layout1);