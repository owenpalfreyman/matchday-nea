import { Card, CardContent, CardDescription, CardTitle } from '@/components/ui/card'
import { Field } from '@/components/ui/field'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import getLeagueTeams from '@/lib/get-league-teams'
import getOrganisationData from '@/lib/get-organisation-data'
import getOrganisationLeagues from '@/lib/get-organisation-leagues'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

const JoinOrg = () => {
  const [organisation, setOrganisation] = useState(null)
  const [leagues, setLeagues] = useState(null)
  const [teams, setTeams] = useState(null)
  const [teamsOptions, setTeamsOptions] = useState(null)
  const [selectedRole, setSelectedRole] = useState<string>(undefined)
  const [selectedLeague, setSelectedLeague] = useState<string>(undefined)
  const { orgId } = useParams<{ orgId: string }>()
  const navigate = useNavigate()

  const roles = [
    { label: 'Admin', value: 'admin' },
    { label: 'Player', value: 'player' },
    { label: 'Coach', value: 'coach' },
  ]

  function handleRoleChange (role: string) {
    // Change the role
    setSelectedRole(role)

    // If switching to or from admin the selected league should be cleared
    if (selectedRole === 'admin' || role === 'admin') {
      setSelectedLeague(undefined)
    }
  }

  function handleLeagueChange (league: string) {
    // Change the league
    setSelectedLeague(league)

    // Clear the selected team if any

    // Change the options for the teams that the user can pick
    setTeamsOptions(teams?.flat().filter((team) => team.league === league) ?? [])
    console.log(teamsOptions)
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

      console.log("Organisation:", organisation)
      console.log("Leagues:", leagues)
      console.log("Teams:", teams)
    }

    void getData(orgId)
  }, [navigate, orgId])

  return (
    <Card>
      <CardTitle>Join {organisation?.name}</CardTitle>
      <CardDescription>Want to join for this organisation? You can apply here.</CardDescription>
      <CardContent>
        <p>Select the role you want to apply for in this organisation.</p>
        <Select
          items={roles}
          value={selectedRole}
          onValueChange={handleRoleChange}
        >
          <SelectTrigger>
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
          <Field>
            {/* League Selection */}
            <Select
              items={leagues}
              value={selectedLeague}
              onValueChange={handleLeagueChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a league" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {leagues?.map((league) => (
                    <SelectItem key={league.name} value={league.name}>
                      {league.name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>

            {/* Team Selection */}
            <Select
              items={teamsOptions}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a team" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {teamsOptions?.map((team) => (
                    <SelectItem key={team.id} value={team.id}>
                      {team.name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>

          </Field>
        )}



      </CardContent>
    </Card>
  )
}

export default JoinOrg