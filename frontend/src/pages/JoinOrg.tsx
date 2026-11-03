import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardTitle } from '@/components/ui/card'
import { Field } from '@/components/ui/field'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import getLeagueTeams from '@/lib/get-league-teams'
import getOrganisationData from '@/lib/get-organisation-data'
import getOrganisationLeagues from '@/lib/get-organisation-leagues'
import { getUserData, getUserId } from '@/lib/get-user-data'
import { supabase } from '@/lib/supabase'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

const JoinOrg = () => {
  const [organisation, setOrganisation] = useState(null)
  const [leagues, setLeagues] = useState(null)
  const [teams, setTeams] = useState(null)
  const [teamsOptions, setTeamsOptions] = useState(null)
  const [selectedRole, setSelectedRole] = useState<string>(undefined)
  const [selectedLeague, setSelectedLeague] = useState<string>(undefined)
  const [selectedTeam, setSelectedTeam] = useState<string>(undefined)
  const { orgId } = useParams<{ orgId: string }>()
  const navigate = useNavigate()

  const roles = [
    { label: 'Admin', value: 'admin' },
    { label: 'Player', value: 'player' },
    { label: 'Coach', value: 'coach' },
  ]
  
  // TODO: Prevent user's from sending a request if there is already data

  // Function to send the request to the table
  async function sendRequest () {
    // Get the user ID
    const {data: { user }} = await supabase.auth.getUser()

    // Ensure the user does not already have a pending request for any organisation
    const { data: existingRequest, error: existingRequestError } = await supabase
      .from("requests")
      .select("*")
      .eq("profile_id", user?.id)
      .eq("status", "pending")
      .single()

    // Error handling
    if (existingRequestError) {
      console.error("Error checking for existing request.", existingRequestError)
    }

    if (existingRequest) {
      alert("You already have a pending request for an organisation. Please wait for it to be processed before sending another request.")
      return
    } else {
        const { data: requestData, error: requestError } = await supabase
          .from("requests")
          .insert({
            profile_id: user?.id,
            role: selectedRole,
            status: "pending" // Should be pending by default
        })

        // Code below to be removed so it is not reported as an error in Supabase, but for now it is useful to have it for testing purposes
        if (requestError) {
          console.error("Error adding request to join.", requestError)
          alert("There was an error sending your request. Please try again later.")
          return
        }

    }

    

    // Error handling
    if (requestError) {
      console.error("Error adding request to join.", requestError)
    } else { // For testing only - to be deleted afterwards
      console.log(requestData)
    }
  }

  function handleRoleChange (role: string) {
    // Change the role
    setSelectedRole(role)

    // If switching to or from admin the selected league should be cleared
    if (selectedRole === 'admin' || role === 'admin') {
      setSelectedLeague(undefined)
    }
  }

  function handleLeagueChange (league: string) {
    // Handle the league change and reset the selected team
    setSelectedLeague(league)
    setSelectedTeam(undefined)

    // Filter the teams based on the selected league
    const options = teams?.flat().filter((team) => String(team.league_id) === league) ?? []
    setTeamsOptions(options)
  }


  useEffect(() => {
    // Get the data about the relevant organisation
    async function getData (orgId: string) {
      if (!orgId) {
        navigate('/organisations')
        return
      }

      // Call function which gets the organisation ID and name
      const organisation = await getOrganisationData(orgId)
      setOrganisation(organisation)

      // If there is no organisation, rediret the user back to organisations
      if (!organisation) {
        navigate('/dashboard/organisations', { replace: true })
        return
      }

      // Call function which gets the leagues
      const leagues = await getOrganisationLeagues(orgId)
      setLeagues(leagues)

      const teams = await Promise.all(
        leagues.map((league) => getLeagueTeams(league.id))
      )
      setTeams(teams)
    }

    void getData(orgId)
  }, [navigate, orgId])

  return (
    <Card className="w-full max-w-md gap-4 p-6">
        <CardTitle className="text-xl">Join {organisation?.name}</CardTitle>
        <CardDescription>Want to join for this organisation? You can apply here.</CardDescription>
      <CardContent className="flex flex-col gap-4 p-0">
        <p className="text-sm text-muted-foreground">Select the role you want to apply for in this organisation.</p>
        <Select
          items={roles}
          value={selectedRole}
          onValueChange={handleRoleChange}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select a role" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {roles.map((role) => (
                <SelectItem key={role.value} value={role.value}>
                  {role.label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>

        {/* Display the teams that the user can apply for if they are not an admin */}
        {selectedRole !== "admin" && selectedRole !== undefined && (
          <Field className="gap-4">
            {/* League Selection */}
            <Select
              items={leagues}
              value={selectedLeague}
              onValueChange={handleLeagueChange}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a league" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {leagues?.map((league) => (
                    <SelectItem key={league.id} value={String(league.id)}>
                      {league.name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>

            {/* Team Selection */}
            <Select
              items={teamsOptions}
              value={selectedTeam}
              onValueChange={(team) => setSelectedTeam(team)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a team" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {teamsOptions?.map((team) => (
                    <SelectItem key={team.id} value={String(team.id)}>
                      {team.name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>

            <Button onClick={sendRequest}>Request to Join</Button>
          </Field>
        )}

      </CardContent>
    </Card>
  )
}

export default JoinOrg