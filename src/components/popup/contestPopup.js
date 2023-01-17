import React, { useEffect, useState } from 'react'
import { Modal } from 'react-bootstrap'
import Slider from "react-slick";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';

const ContestPopup = (props) => {
    const [contestList, setContestList] = useState([])
    const [isOpen, setOpen] = useState(false)
    const settings = {
        dots: false,
        infinite: true,
        autoplay: true,
        autoplaySpeed: 4000,
        speed: 1000,
        arrows: true,
        slidesToShow: 1,
        slidesToScroll: 1,
        pauseOnHover: false,
        pauseOnFocus: false,
        // responsive: [
        // 	{
        // 		breakpoint: 1024,
        // 		settings: {
        // 			slidesToShow: 3,
        // 		}
        // 	},
        // 	{
        // 		breakpoint: 600,
        // 		settings: {
        // 			slidesToShow: 2,
        // 		}
        // 	},
        // 	{
        // 		breakpoint: 480,
        // 		settings: {
        // 			slidesToShow: 1,
        // 		}
        // 	}
        // ]
    }
    useEffect(() => {
        if (props.contestList && props.contestList.length) {
            setContestList(props.contestList)
            setOpen(true)
        }
    }, [props.contestList])


    return (
        <div>
                <Modal
                    centered
                    size="md"
                    className="offer-modal contest-modal"
                    show={isOpen}
                    onHide={() => setOpen(false)}
                >
                    <Modal.Header className="text-center modal-title-wrapper position-relative">
                        <Modal.Title>
                            Contests
                            <span className="cross-icon"><FontAwesomeIcon icon={faXmark} className="cross-icon-in" onClick={() => setOpen(false)} /></span>
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body className="row pt-2 pb-0">
                        <Slider {...settings}>
                            {
                                contestList && contestList.length &&
                                contestList.map((contest, index) => {
                                    return (
                                        <div key={index} className="col-12 d-flex justify-content-center">
                                            <div>
                                                <span className="contest-name">{contest.name}</span>
                                                <div >{`Points : ${contest.points}`}</div>
                                                <div >{contest.description}</div>
                                            </div>
                                        </div>
                                    )
                                })
                            }
                        </Slider>
                    </Modal.Body>
                    {/* <Modal.Footer>
                    <button
                        className="btn btn-danger"
                        
                    >
                        Close
                    </button>
                </Modal.Footer> */}
                </Modal>
        </div>
    )
}

export default ContestPopup