import React, { useEffect, useState } from 'react'
import { connect } from "react-redux"
import { setPoints, createStats, getContestList, beforeContests } from './gamifications.action'
import ContestPopup from '../popup/contestPopup'
import { ENV } from '../../config/config'
const { getUserKeys } = ENV

const Gamification = (props) => {
    const [contestList, setContestList] = useState([])

    useEffect(() => {
        if (!props.gamification.points) {
            props.setPoints() // set points for gamification
        }
    }, [])

    useEffect(() => {
        if (window.location.pathname === '/') {
            props.getContestList()
        }
    }, [window.location.pathname])

    useEffect(() => {
        if (props.gamification.contestsAuth) {
            setContestList(props.gamification.contests)
            props.beforeContests()
        }
    }, [props.gamification.contestsAuth])

    useEffect(() => {
        if (props.gamification.points?.task?.length && props.eventType && props.eventType !== '') {
            createGStats(props.eventType)
        }
    }, [props.gamification.points, props.eventType])

    const createGStats = (eventT = '') => {
        const nftPlatform = 'NFT marketplace'.toLowerCase()
        const userId = getUserKeys('address')?.address // user wallet address
        const event = props?.gamification?.points.task.find((elem) => elem?.eventType?.toLowerCase() === eventT.toLowerCase() && elem?.platform?.toLowerCase() === nftPlatform)

        if (!userId || !event)
            return false

        const { eventType, pointType, platform } = event
        const payload = {
            userId, eventType, pointType, platform
        }
        props.createStats(payload)
    }

    return (
        <>
            {
                contestList && contestList.length &&
                <ContestPopup contestList={contestList} />
            }
        </>
    )
}

const mapStateToProps = (state) => ({
    gamification: state.gamification
})

export default connect(mapStateToProps, { setPoints, createStats, getContestList, beforeContests }, null)(Gamification)