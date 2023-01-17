import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getCategories, beforeCategory } from '../categories/categories.action';
import MainBanner from '../home/mainBanner/mainBanner'
import NotableDrops from '../home/notableDrops/notableDrops';
import TopCollection from '../home/topCollection/topCollection';
import TendingCategories from '../home/trendingCategories/trendingCategories';
import CreateSellNft from '../home/createSellNft/createSellNft';
import BrowseByCategory from '../home/browseByCategory/browseByCategory'
import StayInLoop from '../home/stayInLoop/stayInLoop';
import Footer from '../home/footer/Footer';
import FullPageLoader from '../../components/loaders/full-page-loader';

function Template() {
	const dispatch = useDispatch()
	const [loader, setLoader] = useState(true)
	const categoriesRes = useSelector((state) => state.category)
	const [categories, setCategories] = useState([])

	useEffect(() => {
		window.scroll(0, 0)
		if (!categoriesRes)
			dispatch(getCategories())
	}, [])

	// when categories are retrieved from redux store
	useEffect(() => {
		if (categoriesRes && categoriesRes.categories?.length && !categories?.length) {
			setCategories(categoriesRes.categories)
			setLoader(false)
			dispatch(beforeCategory())
		}
	}, [categoriesRes])

	return (
		<React.Fragment>
			{loader && <FullPageLoader />}
			<MainBanner />
			<NotableDrops />
			<TopCollection />
			<TendingCategories />
			<CreateSellNft />
			<BrowseByCategory categories={categories} />
			<StayInLoop />
			<Footer />
		</React.Fragment>
	);
}

export default Template;