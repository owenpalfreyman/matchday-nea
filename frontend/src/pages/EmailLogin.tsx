import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Field, FieldDescription, FieldGroup, FieldLegend } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { supabase } from '@/lib/supabase'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const UsernameLogin = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const navigate = useNavigate()

  // Function to sign the user in
  async function signInWithEmail() {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    })

    // If there is an error (which includes if the login details are invalid)
    if (error) {
      console.error("Error signing the user in.", error)
      alert("Incorrect email or password.")
    // Navigate the user to the if the login is successful
    } else {
      navigate('/dashboard', { replace: true })
    }
  }
  
  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        <Card>
          <CardHeader>
            <CardTitle>Username and Password Login</CardTitle>
            <CardDescription>
              Login with your username and password.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Field>
              <FieldLegend>Login</FieldLegend>
              <FieldDescription>
                Enter your username and password to continue.
              </FieldDescription>
              <FieldGroup>
                <Input
                  id="email"
                  autoComplete="off"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="johndoe@matchday.com"
                />
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                />
                <Button onClick={signInWithEmail}>Login</Button>
              </FieldGroup>
            </Field>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default UsernameLogin