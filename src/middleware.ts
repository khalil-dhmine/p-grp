import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"

const isProtectedRoute = createRouteMatcher(["/group(.*)"])

export default clerkMiddleware(async (auth, req) => {
  try {
    const baseHost = process.env.NEXT_PUBLIC_BASE_HOST
    if (!baseHost) {
      console.error("BASE_HOST environment variable is not defined")
      return NextResponse.next()
    }

    const host = req.headers.get("host")
    const reqPath = req.nextUrl.pathname

    if (isProtectedRoute(req)) {
      await auth().protect()
    }

    // Only make the domain check if needed
    if (!baseHost.includes(host as string) && reqPath.includes("/group")) {
      try {
        const response = await fetch(
          `${req.nextUrl.origin}/api/domain?host=${host}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          },
        )

        if (!response.ok) {
          console.error(`Domain API failed with status ${response.status}`)
          return NextResponse.next()
        }

        const data = await response.json()

        if (data.status === 200 && data.domain) {
          return NextResponse.rewrite(
            new URL(reqPath, `https://${data.domain}`),
          )
        }
      } catch (error) {
        console.error("Domain API error:", error)
        return NextResponse.next()
      }
    }

    return NextResponse.next()
  } catch (error) {
    console.error("Middleware error:", error)
    return NextResponse.next()
  }
})

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
}
