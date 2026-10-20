import CreateVenueForm from '@/components/CreateVenueForm'
import VenueList from '@/components/VenueList'
import React from 'react'

const Venues = () => {
  return (
    <>
      <VenueList />
      <CreateVenueForm />
    </>
  )
}

export default Venues