"use client"
import { FormGenerator } from "@/components/global/form-generator"
import { Loader } from "@/components/global/loader"
import { Button } from "@/components/ui/button"
import { GROUPLE_CONSTANTS } from "@/constants"
import { useAuthSignUp } from "@/hooks/authentication"
import dynamic from "next/dynamic"
import { toast } from "sonner"

type Props = {}

const OtpInput = dynamic(
  () =>
    import("@/components/global/otp-input").then(
      (component) => component.default,
    ),
  { ssr: false },
)
const SignUpForm = (props: Props) => {
  const {
    register,
    errors,
    verifying,
    creating,
    onGenerateCode,
    onInitiateUserRegistration,
    code,
    setCode,
    getValues,
  } = useAuthSignUp()

  const handleGenerateCode = async () => {
    const email = getValues("email")
    const password = getValues("password")

    if (!email || !password) {
      toast("Error", {
        description: "Email and Password cannot be empty.",
      })
      return
    }

    await onGenerateCode(email, password)
  }

  return (
    <form
      onSubmit={onInitiateUserRegistration}
      className="flex flex-col gap-3 mt-10"
    >
      {verifying ? (
        <div className="flex justify-center mb-5">
          <OtpInput otp={code} setOtp={setCode} />
        </div>
      ) : (
        GROUPLE_CONSTANTS.signUpForm.map((field) => (
          <FormGenerator
            {...field}
            key={field.id}
            register={register}
            errors={errors}
          />
        ))
      )}

      {verifying ? (
        <Button type="submit" className="rounded-2xl" disabled={creating}>
          <Loader loading={creating}>Verify Code</Loader>
        </Button>
      ) : (
        <Button
          type="button"
          className="rounded-2xl"
          onClick={handleGenerateCode}
          disabled={creating}
        >
          <Loader loading={creating}>Generate Code</Loader>
        </Button>
      )}
    </form>
  )
}

export default SignUpForm
