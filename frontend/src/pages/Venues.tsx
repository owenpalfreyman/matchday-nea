import CreateVenueForm from '@/components/CreateVenueForm'
import VenueList from '@/components/VenueList'
import React from 'react'

const Venues = () => {
  return (
    <div className="grid gap-6 lg:grid-cols-2 lg:items-start">
      <VenueList />
      <CreateVenueForm />
    </div>
  )
}

export default Venues