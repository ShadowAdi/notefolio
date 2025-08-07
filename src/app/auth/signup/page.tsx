import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const Signup = ({
  heading = "Signup",
  logo = {
    url: "http://localhost:3000",
    title: "Notefolio",
  },
  buttonText = "Create Account",
  signupText = "Already Have an Account?",
  signupUrl = "http://localhost:3000/auth/signin",
}) => {
  return (
    <main className="flex w-full h-full flex-1 items-center justify-between flex-col md:flex-row-reverse">
      <section className="h-full flex-1  ">
        <div className="flex h-full items-center justify-center">
          <div className="flex flex-col items-center gap-10 lg:justify-start">
            <Link href={logo.url}>
              <span className="text-xl font-bold text-black">{logo.title}</span>
            </Link>
            <div className="min-w-sm border-muted bg-[#fafafa] flex w-full max-w-sm flex-col items-center gap-y-4 rounded-md border px-6 py-8 shadow-md">
              {heading && <h1 className="text-xl font-semibold">{heading}</h1>}
              <div className="flex w-full flex-col gap-2">
                <Label>Email</Label>
                <Input
                  type="email"
                  placeholder="Email"
                  className="text-sm"
                  required
                />
              </div>
              <div className="flex w-full flex-col gap-2">
                <Label>Password</Label>
                <Input
                  type="password"
                  placeholder="Password"
                  className="text-sm"
                  required
                />
              </div>
              <Button type="submit" className="w-full">
                {buttonText}
              </Button>
            </div>
            <div className="text-muted-foreground flex justify-center gap-1 text-sm">
              <p>{signupText}</p>
              <Link
                href={signupUrl}
                className="text-primary font-medium hover:underline"
              >
                Register
              </Link>
            </div>
          </div>
        </div>
      </section>
      <section className="w-1/2
    flex-1 h-screen relative">
        <Image
          src="https://images.unsplash.com/photo-1579487785973-74d2ca7abdd5?w=1600&auto=format&fit=cover&q=80"
          alt="Office image"
          fill
          className="object-cover w-1/2 h-full"
        />
      </section>
    </main>
  )
}

export default Signup