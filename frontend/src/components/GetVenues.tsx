import React from 'react'
import getOrganisationId from '../lib/get-current-organisation-id'

const GetVenues = async () => {
  const organisation = await getOrganisationId()

  return (
    <div>{organisation.organisationId}</div>
  )
}

export default GetVenues