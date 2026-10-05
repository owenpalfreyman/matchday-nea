import React, { useEffect, useState } from 'react'
import { FieldLegend, FieldSet, FieldDescription, FieldGroup, Field, FieldLabel } from './ui/field'
import { Card } from './ui/card'
import { Input } from './ui/input'

type SearchState =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'error' }
  | { status: 'empty' }
  | { status: 'results'; orgs: Org[] }

const SearchOrg = () => {
    const [searchTerm, setearchTerm] = useState('')
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

      if (debounceTerm.length < 2 || debounceTerm.length > 41) {
        setSearchStatus({ status: 'idle' })
        return
      }

      setSearchStatus({ status: 'loading' })

      console.log("Debounced term:", debounceTerm)

      // Todo: Implement Supabase DB query
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
            <Input id="name" autoComplete="off" placeholder="Organisation" value={searchTerm} onChange={(e) => setearchTerm(e.target.value)} />
          </Field>
        </FieldGroup>
      </FieldSet>

    </Card>
  )
}

export default SearchOrg