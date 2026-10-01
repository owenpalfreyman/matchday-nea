import { cn } from "cn"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldGroup,
} from "@/components/ui/field"
import { supabase } from "@/lib/supabase"

async function signInWithGoogle() {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${window.location.origin}/dashboard`,
    },
  })

  if (error) {
    console.error("Google sign-in failed:", error.message)
  }
}

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Login to Matchday</CardTitle>
          <CardDescription>
            Let's get you signed in with Google.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={(event) => {
              event.preventDefault()
              void signInWithGoogle()
            }}
          >
            <FieldGroup>
              <Field>
                <Button variant="outline" type="submit">
                  Login with Google
                </Button>
                <FieldDescription className="text-center">
                  Don&apos;t have an account? This will also get you sorted.
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
