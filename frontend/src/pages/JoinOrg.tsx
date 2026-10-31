import { Card, CardContent, CardDescription, CardTitle } from '@/components/ui/card'
import getLeagueTeams from '@/lib/get-league-teams'
import getOrganisationData from '@/lib/get-organisation-data'
import getOrganisationLeagues from '@/lib/get-organisation-leagues'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

const JoinOrg = () => {
  const [organisation, setOrganisation] = useState(null)
  const [leagues, setLeagues] = useState(null)
  const [teams, setTeams] = useState(null)
  const { orgId } = useParams<{ orgId: string }>()
  const navigate = useNavigate()

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
      </CardContent>
    </Card>
  )
}

export default JoinOrg