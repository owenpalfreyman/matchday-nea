import CreateLeagueForm from '@/components/CreateLeagueForm'
import YourLeagues from '@/components/YourLeagues'
import React from 'react'

const Leagues = () => {
  return (
    <div className="space-y-4">
      <div>Here are your organisation's Leagues</div>
      <div className="flex flex-col items-start gap-2 md:flex-row">
        <CreateLeagueForm />
        <YourLeagues />
      </div>
    </div>
  )
}

export default Leagues