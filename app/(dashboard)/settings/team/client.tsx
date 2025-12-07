'use client';

import { useState } from 'react';
import { useActionState } from 'react';
import { inviteUser, revokeInvitation } from '@/app/actions';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Modal } from "@/components/ui/modal";
import { Plus, Mail, Trash2, User, Clock } from "lucide-react";
import { useFormStatus } from 'react-dom';

export default function TeamClient({ members, invitations }: { members: any[], invitations: any[] }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [inviteState, inviteDispatch] = useActionState(async (prevState: any, formData: FormData) => {
        return await inviteUser(formData);
    }, undefined);

    return (
        <div className="space-y-8 max-w-4xl">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Team Members</h2>
                    <p className="text-muted-foreground">
                        Manage your team and pending invitations.
                    </p>
                </div>
                <Button onClick={() => setIsModalOpen(true)} className="gap-2">
                    <Plus className="h-4 w-4" />
                    Invite Member
                </Button>
            </div>

            <div className="space-y-6">
                <div>
                    <h3 className="text-lg font-medium mb-4">Active Members</h3>
                    <Card className="glass">
                        <div className="divide-y divide-border">
                            {members.map((member) => (
                                <div key={member.id} className="flex items-center justify-between p-4">
                                    <div className="flex items-center gap-4">
                                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium">
                                            {member.name ? member.name[0] : <User className="h-5 w-5" />}
                                        </div>
                                        <div>
                                            <p className="font-medium">{member.name}</p>
                                            <p className="text-sm text-muted-foreground">{member.email}</p>
                                        </div>
                                    </div>
                                    <div className="text-sm text-muted-foreground">
                                        Joined {new Date(member.created_at).toLocaleDateString()}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>

                {invitations.length > 0 && (
                    <div>
                        <h3 className="text-lg font-medium mb-4">Pending Invitations</h3>
                        <Card className="glass">
                            <div className="divide-y divide-border">
                                {invitations.map((invite) => (
                                    <div key={invite.id} className="flex items-center justify-between p-4">
                                        <div className="flex items-center gap-4">
                                            <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground">
                                                <Clock className="h-5 w-5" />
                                            </div>
                                            <div>
                                                <p className="font-medium">{invite.email}</p>
                                                <p className="text-sm text-muted-foreground">Invitation Sent</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <span className="text-sm text-muted-foreground">
                                                Sent {new Date(invite.created_at).toLocaleDateString()}
                                            </span>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                                onClick={async () => {
                                                    if (confirm('Are you sure you want to revoke this invitation?')) {
                                                        await revokeInvitation(invite.id);
                                                    }
                                                }}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </Card>
                    </div>
                )}
            </div>

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Invite Team Member"
            >
                <form action={inviteDispatch} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <Input
                            id="email"
                            name="email"
                            type="email"
                            required
                            placeholder="colleague@company.com"
                        />
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                        <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
                            Cancel
                        </Button>
                        <InviteButton />
                    </div>
                    {inviteState?.message && (
                        <p className={`text-sm ${inviteState.success ? 'text-emerald-500' : 'text-red-500'}`}>
                            {inviteState.message}
                        </p>
                    )}
                </form>
            </Modal>
        </div>
    );
}

function InviteButton() {
    const { pending } = useFormStatus();
    return (
        <Button type="submit" disabled={pending}>
            {pending ? 'Sending...' : 'Send Invitation'}
        </Button>
    );
}
