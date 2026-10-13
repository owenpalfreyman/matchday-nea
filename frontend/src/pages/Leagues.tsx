import CreateLeagueForm from '@/components/CreateLeagueForm'
import YourLeagues from '@/components/YourLeagues'
import React from 'react'

const Leagues = () => {
  return (
    <>
      <div>Here are your organisation's Leagues</div>
      <CreateLeagueForm />
      <YourLeagues />
    </>
  )
}

export default Leagues