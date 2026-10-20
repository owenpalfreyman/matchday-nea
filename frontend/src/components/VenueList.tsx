import React, { useEffect, useState } from 'react'
import getOrganisationId from '../lib/get-current-organisation-id'
import { supabase } from '@/lib/supabase'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table'
import { Button } from './ui/button'
import { Link } from 'react-router-dom'

const VenueList = () => {
  // Set useStates
  const [organisationId, setOrganisationId] = useState<string | null>(null)
  const [venues, setVenues] = useState<{ id: string; name: string }[]>([])

  useEffect(() => {
    let mounted = true

    // Function to load the venues from the venues table with the matching org ID
    async function loadVenues() {
      // Get the organisation ID from the helper function
      const organisation = await getOrganisationId()
      // Set variable so it can be used for the select this render
      const currentOrganisationId = organisation.organisationId

      if (!mounted) return
      // Set org ID
      setOrganisationId(currentOrganisationId)

      // Select the venues with the matching organisation ID
      const { data: venues, error: venuesError } = await supabase
        .from("venues")
        .select("id, name")
        .eq("organisation_id", currentOrganisationId)

      if (!mounted) return

        // Error handling
      if (venuesError) {
        console.error("Error fetching venues.", venuesError)
        return
      }

      setVenues(venues ?? [])
    }
    
    loadVenues()

    return () => {
      mounted = false
    }
  }, [])

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Venues</h1>
        {/* TODO: Add venue button and link */}
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {venues.length === 0 ? (
            <TableRow>
              <TableCell colSpan={2} className="text-center text-muted-foreground">
                No venues yet.
              </TableCell>
            </TableRow>
          ) : (
            venues.map((venue) => (
              
              <TableRow key={venue.id}>
                <TableCell>{venue.name}</TableCell>
                <TableCell className="text-right">
                  <Button variant="outline" size="sm">
                    <Link to={`/venues/${venue.id}`}>Manage</Link>
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}

export default VenueList