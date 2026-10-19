import React, { useState } from 'react'
import { Card } from './ui/card'
import { Field, FieldDescription, FieldGroup, FieldLabel, FieldLegend, FieldSet } from './ui/field'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { supabase } from '@/lib/supabase'
import { Switch } from './ui/switch'

const CreateTeamForm = ({ leagueId, organisationId }: { leagueId: string; organisationId: string }) => {
    // State for field input and loading
    const [name, setName] = useState("")
    const [loading, setLoading] = useState(false)
    const [venueName, setVenueName] = useState("")
    const [hasVenue, setHasVenue] = useState(false)

    async function createTeam() {
        const trimmedName = name.trim()
        const trimmedVenueName = venueName.trim()

        if (!trimmedName) {
            alert("Please enter a team name")
            return
        }
        if (trimmedName.length < 3 || trimmedName.length > 41) {
            alert("Please enter a name between 3 and 41 characters")
            return
        }

        if (hasVenue) {
            if (!trimmedVenueName) {
                alert("Please enter a venue name")
                return
            }
            if (trimmedVenueName.length < 3 || trimmedVenueName.length > 41) {
                alert("Please enter a venue name between 3 and 41 characters")
                return
            }
        }

        setLoading(true)

        try {
          // Set to null initially - can be changed
          let venueId: string | null = null

          if (hasVenue) {
              const { data: venue, error: venueError } = await supabase
                  .from("venues")
                  .insert({
                    name: trimmedVenueName,
                    organisation_id: organisationId
                  })
                  .select("id")
                  .single()

              // Error checks
              if (venueError || !venue?.id) {
                  console.error("Could not create venue", venueError)
                  return
              }

              venueId = venue.id
          }

          // Create record in teams table
          const { data: team, error: insertError } = await supabase
              .from("teams")
              .insert({
                organisation_id: organisationId,
                league_id: leagueId,   // from props, not league.id
                name: trimmedName,
                home_venue_id: venueId
              })
              .select("id") // Returns the ID for later use
              .single()

            console.log("Team created:", team)

            if (insertError) {
                console.error("Could not create team", insertError)
                return
            }


          } catch (error) {
            console.error("Could not create team", error)
          } finally {
            setLoading(false)
        }
    }


  return (
    <Card className="mx-auto w-full max-w-md p-6">
      <FieldSet>
        <FieldLegend>Add Team</FieldLegend>
        <FieldDescription>
          Add a team to the current league.
        </FieldDescription>
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="name">Team Name</FieldLabel>
            <Input id="name" autoComplete="off" placeholder="Team" value={name} onChange={(e) => setName(e.target.value)}/>
            <FieldDescription>
              This is how users will search for the team to join.
            </FieldDescription>
          </Field>

          <Field orientation="horizontal" className="items-center justify-between">
            <FieldLabel htmlFor="has-venue">This team has a home venue</FieldLabel>
            <Switch id="has-venue" checked={hasVenue} onCheckedChange={setHasVenue} />
          </Field>

          {hasVenue && (
            <Field>
              <FieldLabel htmlFor="venue-name">Venue Name</FieldLabel>
              <Input id="venue-name" autoComplete="off" placeholder="Venue" value={venueName} onChange={(e) => setVenueName(e.target.value)} />
              <FieldDescription>
                This is the name of the venue where the team plays.
              </FieldDescription>
            </Field>
          )}

        </FieldGroup>
      </FieldSet>

    <Button onClick={createTeam} disabled={loading}>
      {loading ? "Creating..." : "Create Team"}
    </Button>

    </Card>
  )
}

export default CreateTeamForm