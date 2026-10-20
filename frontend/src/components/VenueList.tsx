import React, { useEffect, useState } from 'react'
import getOrganisationId from '../lib/get-current-organisation-id'
import { supabase } from '@/lib/supabase'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table'
import { Button } from './ui/button'
import { Link } from 'react-router-dom'
import { Plus } from 'lucide-react'

// Shape of a venue row once the league has been worked out
type Venue = {
  id: string
  name: string
  league: string
}

const VenueList = () => {
  // Set useStates
  const [organisationId, setOrganisationId] = useState<string | null>(null)
  const [venues, setVenues] = useState<Venue[]>([])

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
      // Also pulls in the league of any team using the venue as its home venue
      const { data, error: venuesError } = await supabase
        .from("venues")
        .select("id, name, teams(leagues(name))")
        .eq("organisation_id", currentOrganisationId)
        .order("name", { ascending: true })

      if (!mounted) return

      // Error handling
      if (venuesError) {
        console.error("Error fetching venues.", venuesError)
        return
      }

      // Turn each venue's team into a single League string or global if it has no home teams
      const formatted: Venue[] = (data ?? []).map((venue: any) => {
        const leagueNames: string[] = (venue.teams ?? [])
          .map((team: any) => team.leagues?.name)
          .filter(Boolean)

        return {
          id: venue.id,
          name: venue.name,
          league: leagueNames[0] ?? "All Leagues",
        }
      })

      setVenues(formatted)
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
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>League</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {venues.length === 0 ? (
            <TableRow>
              <TableCell colSpan={3} className="text-center text-muted-foreground">
                No venues yet.
              </TableCell>
            </TableRow>
          ) : (
            venues.map((venue) => (

              <TableRow key={venue.id}>
                <TableCell>{venue.name}</TableCell>
                <TableCell>{venue.league}</TableCell>
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

      <div className="flex justify-end">
        <Button>
          <Plus />
          Add Venue
        </Button>
      </div>
    </div>
  )
}

export default VenueList