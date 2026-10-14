import CreateLeagueForm from '@/components/CreateLeagueForm'
import { Card, CardContent, CardTitle } from '@/components/ui/card'
import { buttonVariants } from '@/components/ui/button'
import YourLeagues from '@/components/YourLeagues'
import { supabase } from '@/lib/supabase'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

const Leagues = () => {
  const [hasOrganisation, setHasOrganisation] = useState(false)

  useEffect(() => {
    async function checkOrganisation() {
      // Fetch authenticated user
      const { data: authData, error: authError } = await supabase.auth.getUser()

      if (authError || !authData.user) {
        console.error("User could not be found.", authError)
        return
      }

      // Get the user's organisation
      const { data: membership, error: membershipError } = await supabase
        .from("organisation_members")
        .select("id")
        .eq("user_id", authData.user.id)
        .maybeSingle()

      if (membershipError) {
        console.error("Could not find organisation membership.", membershipError)
        return
      }

      setHasOrganisation(membership === null)

      if (membership === null) {
        console.log("User is not a member of an organisation")
      }
    }
    checkOrganisation()
  }, [])

  return (
    <>
      {hasOrganisation === false && (
        <Card className="w-fit max-w-lg gap-3 p-6">
          <CardTitle className="text-lg">You aren't part of an organisation.</CardTitle>
          <CardContent className="space-y-4 p-0">
            <p className="text-muted-foreground">
              Join or create an organisation first, then you can create leagues.
            </p>
            <Link
              className={buttonVariants({ className: "w-fit" })}
              to="/dashboard/organisations"
            >
              Take me to Organisations
            </Link>
          </CardContent>
        </Card>
      )}

      {hasOrganisation === true && (
        <div className="flex flex-col items-start gap-2 md:flex-row">
        <CreateLeagueForm />
        <YourLeagues />
      </div>
      )}
    </>
  )
}

export default Leagues