import React from 'react';
import ItemDetail from '../item-details/item-details';
import LiveAuctions from '../auctions/home-auctions';
import { useNavigate, useParams } from 'react-router-dom';

function ItemDetails(props) {
    const navigate = useNavigate()
    const params = useParams()
    return (
        <>
            <ItemDetail history={props.history}
                navigate={navigate}
                params={params}
            />
            <LiveAuctions />
        </>
    );
}

export default ItemDetails;