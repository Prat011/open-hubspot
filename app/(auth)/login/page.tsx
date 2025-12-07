'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { authenticate } from '@/app/actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import Link from 'next/link';

export default function LoginPage() {
    const [errorMessage, dispatch] = useActionState(authenticate, undefined);

    return (
        <div className="flex items-center justify-center min-h-screen bg-background">
            <Card className="w-full max-w-md p-8 space-y-6 glass">
                <div className="space-y-2 text-center">
                    <h1 className="text-3xl font-bold">Welcome Back</h1>
                    <p className="text-muted-foreground">Enter your credentials to sign in</p>
                </div>
                <form action={dispatch} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" name="email" type="email" placeholder="user@example.com" required />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
                        <Input id="password" name="password" type="password" required />
                    </div>
                    <LoginButton />
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
                <div className="text-center text-sm text-muted-foreground border-t pt-4 space-y-2">
                    <p>Don&apos;t have an account? <Link href="/signup" className="text-primary hover:underline">Sign up</Link></p>
                    <div className="text-xs">
                        <p className="font-semibold">Demo Account:</p>
                        <p>Email: user@example.com</p>
                        <p>Password: password123</p>
                    </div>
                </div>
            </Card>
        </div>
    );
}

function LoginButton() {
    const { pending } = useFormStatus();
    return (
        <Button className="w-full" disabled={pending}>
            {pending ? 'Signing in...' : 'Sign in'}
        </Button>
    );
}
