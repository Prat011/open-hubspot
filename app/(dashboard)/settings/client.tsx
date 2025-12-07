'use client';

import { useActionState } from 'react';
import { updateProfile } from '@/app/actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { useFormStatus } from 'react-dom';

export default function SettingsClient({ user }: { user: any }) {
    const [state, dispatch] = useActionState(updateProfile, undefined);

    return (
        <div className="space-y-8 max-w-2xl">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
                <p className="text-muted-foreground">
                    Manage your account settings and preferences.
                </p>
            </div>

            <Card className="p-6 glass space-y-6">
                <div className="space-y-1">
                    <h3 className="text-lg font-medium">Profile Information</h3>
                    <p className="text-sm text-muted-foreground">Update your account details.</p>
                </div>

                <form action={dispatch} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            name="email"
                            type="email"
                            defaultValue={user?.email}
                            disabled
                            className="bg-muted text-muted-foreground"
                        />
                        <p className="text-xs text-muted-foreground">Email cannot be changed.</p>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input
                            id="name"
                            name="name"
                            defaultValue={user?.name}
                            placeholder="Your name"
                        />
                    </div>

                    <div className="pt-4 border-t border-border/50 space-y-4">
                        <div className="space-y-1">
                            <h3 className="text-lg font-medium">Change Password</h3>
                            <p className="text-sm text-muted-foreground">Leave blank if you don't want to change it.</p>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="currentPassword">Current Password</Label>
                            <Input
                                id="currentPassword"
                                name="currentPassword"
                                type="password"
                                placeholder="Required to set new password"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="newPassword">New Password</Label>
                            <Input
                                id="newPassword"
                                name="newPassword"
                                type="password"
                                placeholder="Min 6 characters"
                                minLength={6}
                            />
                        </div>
                    </div>

                    <div className="pt-4 flex items-center justify-between">
                        <div className="text-sm">
                            {state?.message && (
                                <span className={state.success ? "text-emerald-500" : "text-red-500"}>
                                    {state.message}
                                </span>
                            )}
                        </div>
                        <SaveButton />
                    </div>
                </form>
            </Card>
        </div>
    );
}

function SaveButton() {
    const { pending } = useFormStatus();
    return (
        <Button disabled={pending}>
            {pending ? 'Saving...' : 'Save Changes'}
        </Button>
    );
}
