import React, { useState } from 'react'
import { Card } from './ui/card'
import { Field, FieldDescription, FieldGroup, FieldLabel, FieldLegend, FieldSet } from './ui/field'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { supabase } from '@/lib/supabase'

const CreateTeamForm = ({ leagueId }: { leagueId: string}) => {
    // State for field input and loading
    const [name, setName] = useState("")
    const [loading, setLoading] = useState(false)

    async function createTeam() {
        if (!name.trim()) { // Returns true only when empty or only whitespace
            alert("Please enter a team name")
            return
        } else if (name.length < 3 || name.length > 41) {
          alert("Please enter a name at least 4 characters")
          return
        }

        setLoading(true)

        try {
            // Fetch authenticated user
            const { data: authData, error: authError } = await supabase.auth.getUser()
            
            if (authError) {
                console.error("User could not be found.", authError)
                return
            }

            // Get the currennt league ID, which first requires the organisation
            const { data: organisation, error: orgError } = await supabase
                .from("organisations")
                .select("id")
                .eq("owner_id", authData.user.id)
                .single()

            if (orgError) {
                console.error("Could not find organisation", orgError)
                return
            }

            // TODO: Create the venue before the team so it can be used for the venue ID

            // Create record in teams table
            // TODO: Properly add the venue ID
            const { data: team, error: insertError } = await supabase
                .from("teams")
                .insert({
                  organisation_id: organisation.id,
                  league_id: leagueId,   // from props, not league.id
                  name: name.trim(),
                  home_venue_id: null
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
        </FieldGroup>
      </FieldSet>

    <Button onClick={createTeam} disabled={loading}>
      {loading ? "Creating..." : "Create Team"}
    </Button>

    </Card>
  )
}

export default CreateTeamForm