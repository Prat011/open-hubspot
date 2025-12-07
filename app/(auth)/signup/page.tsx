'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { signUp } from '@/app/actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import Link from 'next/link';

export default function SignUpPage() {
    const [errorMessage, dispatch] = useActionState(signUp, undefined);

    return (
        <div className="flex items-center justify-center min-h-screen bg-background">
            <Card className="w-full max-w-md p-8 space-y-6 glass">
                <div className="space-y-2 text-center">
                    <h1 className="text-3xl font-bold">Create Account</h1>
                    <p className="text-muted-foreground">Enter your details to get started</p>
                </div>
                <form action={dispatch} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="orgName">Organization Name</Label>
                        <Input id="orgName" name="orgName" placeholder="Acme Corp" required />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input id="name" name="name" placeholder="John Doe" required />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" name="email" type="email" placeholder="user@example.com" required />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
                        <Input id="password" name="password" type="password" required minLength={6} />
                    </div>
                    <SignUpButton />
                    <div
                        className="flex h-8 items-end space-x-1"
                        aria-live="polite"
                        aria-atomic="true"
                    >
                        {errorMessage && (
                            <p className="text-sm text-red-500">{errorMessage}</p>
                        )}
                    </div>
                </form>
                <div className="text-center text-sm text-muted-foreground border-t pt-4">
                    <p>Already have an account? <Link href="/login" className="text-primary hover:underline">Sign in</Link></p>
                </div>
            </Card>
        </div>
    );
}

function SignUpButton() {
    const { pending } = useFormStatus();
    return (
        <Button className="w-full" disabled={pending}>
            {pending ? 'Creating account...' : 'Sign Up'}
        </Button>
    );
}
