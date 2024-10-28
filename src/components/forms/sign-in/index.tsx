"use client"

import { FormGenerator } from "@/components/global/form-generator"
import { Button } from "@/components/ui/button"
import { useAuthSignIn } from "@/hooks/authentication"

type Props = {}

const SignInForm = (props: Props) => {
  const { isPending, onAuthenticateUser, register, errors } = useAuthSignIn()

  return (
    <form onSubmit={onAuthenticateUser}>
      {/* Your form fields here */}
      <FormGenerator
        type="email"
        inputType="input"
        name="email"
        register={register}
        errors={errors}
        placeholder="Email"
      />
      <FormGenerator
        type="password"
        inputType="input"
        name="password"
        register={register}
        errors={errors}
        placeholder="Password"
      />
      <Button type="submit" disabled={isPending}>
        {isPending ? "Signing in..." : "Sign in"}
      </Button>
    </form>
  )
}

export default SignInForm
