import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Card } from './ui/card'
import { Button } from './ui/button'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useNavigate } from 'react-router-dom'

const CreateOrgForm = () => {
    // State for input field and loading
    const [name, setName] = useState("")
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    async function createOrganisation() {
        if (!name.trim()) { // Returns true only when empty or only whitespace
            alert("Please enter an organisation name")
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

            // Insert record into organisations
            const { data: organisation, error: insertError } = await supabase
                .from("organisations")
                .insert({
                  name: name.trim(), // For screenshot: modified to trim any additional whitespace
                  owner_id: authData.user.id
                })
              .select("id") // Returns the ID for later use
              .single()

            if (insertError) {
                console.error("Could not insert user", insertError)
                return
            }

            // Insert into organisation_members
            const { error: insertMembersError } = await supabase
              .from("organisation_members")
              .insert({
                organisation_id: organisation.id,
                user_id: authData.user.id,
                role: "admin"
              })

            if (insertMembersError) {
              console.error("Could not add organisation member", insertMembersError)
              return
            }

            navigate(0) // Refreshes the tab after the button press
        } finally {
            setLoading(false)
        }
    }

  return (
    <Card className="mx-auto w-full max-w-md p-6">
      <FieldSet>
        <FieldLegend>Create Organisation</FieldLegend>
        <FieldDescription>
          Want to create an organisation? Just fill out the form.
        </FieldDescription>
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="name">Organisation Name</FieldLabel>
            <Input id="name" autoComplete="off" placeholder="Organisation" value={name} onChange={(e) => setName(e.target.value)}/>
            <FieldDescription>
              This is how users will search for your organisation.
            </FieldDescription>
          </Field>
        </FieldGroup>
      </FieldSet>

    <Button onClick={createOrganisation} disabled={loading}>
        {loading ? "Creating..." : "Create Organisation"}
    </Button>

    </Card>
  )
}

export default CreateOrgForm