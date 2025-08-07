import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RegisterInterfaceType } from '@/types/auth/register/RegisterType'
import React from 'react'

const RegisterForm = ({ heading, buttonText,onSubmit }: RegisterInterfaceType) => {
  return (
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
  )
}

export default RegisterForm