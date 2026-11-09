import React from 'react'
import { useParams } from 'react-router-dom'

const Scheduler = () => {
	const { leagueId } = useParams<{ leagueId: string }>()
	return (
		<div>Scheduler</div>
	)
}

export default Scheduler
