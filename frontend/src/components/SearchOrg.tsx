import React, { useEffect, useState } from 'react'
import { FieldLegend, FieldSet, FieldDescription, FieldGroup, Field, FieldLabel } from './ui/field'
import { Card } from './ui/card'
import { Input } from './ui/input'
import { supabase } from '@/lib/supabase'

// Define types to satisfy TypeScript
type Org = {
  id: string
  name: string
}

type SearchState =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'error' }
  | { status: 'empty' }
  | { status: 'results'; orgs: Org[] }

// SearchOrg component
const SearchOrg = () => {
    const [searchTerm, setSearchTerm] = useState('')
    const [searchStatus, setSearchStatus] = useState<SearchState>({ status: 'idle' })
    const [debounceTerm, setDebounceTerm] = useState('')

    // Debounce the search term to avoid excessive API calls
    useEffect(() => {
      const timer = setTimeout(async () => {
        setDebounceTerm(searchTerm)
      }, 300)
      
      return () => clearTimeout(timer)
    }, [searchTerm])

    // Run the search when the debounce term changes
    useEffect(() => {
      const term = debounceTerm.trim()

      // Ensures length of the query is proper length
      if (term.length < 2 || term.length > 41) {
        setSearchStatus({ status: 'idle' })
        return
      }

      // Otherwise, change status
      setSearchStatus({ status: 'loading' })

      console.log("Debounced term:", debounceTerm)

      // Function to query the database of the value in the input (term)
      async function queryDatabase () {
        const { data, error } = await supabase
          .from("organisations")
          .select("id, name")
          .ilike("name", `%${term}%`)
          .limit(5)

          // Error handling
          if (error) {
            console.error("Error retrieving search result", error)
            setSearchStatus({ status: "error" })
            return
          }

          // If changed to empty, status should be too
          if (data.length === 0) {
            setSearchStatus({ status: "empty" })
            return
          }

          // Otherwise, set the status to the results
          console.log(data)
          setSearchStatus({ status: 'results', orgs: data})
      }

      queryDatabase()

    }, [debounceTerm])


  return (
    <Card className="mx-auto w-full max-w-md p-6">
      <FieldSet>
        <FieldLegend>Join an Organisation</FieldLegend>
        <FieldDescription>
          Looking to join an organisation? Just search for it below. If you can't find it, you can create a new one.
        </FieldDescription>
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="name">Search Organisation</FieldLabel>
            <Input id="name" autoComplete="off" placeholder="Organisation" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          </Field>
        </FieldGroup>
      </FieldSet>

    </Card>
  )
}

export default SearchOrg