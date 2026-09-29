import { LoginForm } from "@/components/login-form"

function Login() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        <LoginForm />
      </div>
    </div>
  )
}

export default Login
