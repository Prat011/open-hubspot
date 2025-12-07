'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Modal } from "@/components/ui/modal";
import { Plus, MoreHorizontal, Mail, Phone, Search } from "lucide-react";
import { createContact, updateContact } from '@/app/actions';

export default function ContactsClient({ initialContacts, companies }: { initialContacts: any[], companies: any[] }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedContact, setSelectedContact] = useState<any>(null);

    async function handleSubmit(formData: FormData) {
        setIsLoading(true);
        if (selectedContact) {
            await updateContact(selectedContact.id, formData);
        } else {
            await createContact(formData);
        }
        setIsLoading(false);
        setIsModalOpen(false);
        setSelectedContact(null);
    }

    function handleEdit(contact: any, e: React.MouseEvent) {
        e.stopPropagation();
        setSelectedContact(contact);
        setIsModalOpen(true);
    }

    function handleClose() {
        setIsModalOpen(false);
        setSelectedContact(null);
    }

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Contacts</h2>
                    <p className="text-muted-foreground">
                        Manage your contacts and leads here.
                    </p>
                </div>
                <Button onClick={() => setIsModalOpen(true)} className="gap-2">
                    <Plus className="h-4 w-4" />
                    Add Contact
                </Button>
            </div>

            <Card className="glass">
                <div className="p-4 border-b border-border">
                    <div className="relative w-full max-w-sm">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input placeholder="Search contacts..." className="pl-8" />
                    </div>
                </div>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[250px]">Name</TableHead>
                            <TableHead>Contact Info</TableHead>
                            <TableHead>Company</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Last Activity</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {initialContacts.map((contact) => (
                            <TableRow
                                key={contact.id}
                                className="group cursor-pointer hover:bg-surface-hover/50"
                                onClick={() => {
                                    setSelectedContact(contact);
                                    setIsModalOpen(true);
                                }}
                            >
                                <TableCell className="font-medium">
                                    <div className="flex items-center gap-3">
                                        <div className="h-9 w-9 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-medium">
                                            {contact.first_name[0]}{contact.last_name[0]}
                                        </div>
                                        <div>
                                            <div>{contact.first_name} {contact.last_name}</div>
                                            <div className="text-xs text-muted-foreground">{contact.job_title}</div>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="flex flex-col gap-1 text-sm">
                                        <div className="flex items-center gap-2 text-muted-foreground">
                                            <Mail className="h-3 w-3" />
                                            {contact.email}
                                        </div>
                                        <div className="flex items-center gap-2 text-muted-foreground">
                                            <Phone className="h-3 w-3" />
                                            {contact.phone || '-'}
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell>{contact.company_name || '-'}</TableCell>
                                <TableCell>
                                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${contact.lifecycle_stage === "Customer"
                                        ? "bg-success/10 text-success"
                                        : contact.lifecycle_stage === "Opportunity"
                                            ? "bg-warning/10 text-warning"
                                            : "bg-primary/10 text-primary"
                                        }`}>
                                        {contact.lifecycle_stage}
                                    </span>
                                </TableCell>
                                <TableCell className="text-muted-foreground">
                                    {new Date(contact.last_activity).toLocaleDateString()}
                                </TableCell>
                                <TableCell className="text-right">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                                        onClick={(e) => handleEdit(contact, e)}
                                    >
                                        <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                        {initialContacts.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                                    No contacts found. Create one to get started.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </Card>

            <Modal
                isOpen={isModalOpen}
                onClose={handleClose}
                title={selectedContact ? "Edit Contact" : "Add New Contact"}
            >
                <form action={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="first_name">First Name *</Label>
                            <Input
                                id="first_name"
                                name="first_name"
                                required
                                placeholder="John"
                                defaultValue={selectedContact?.first_name}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="last_name">Last Name *</Label>
                            <Input
                                id="last_name"
                                name="last_name"
                                required
                                placeholder="Doe"
                                defaultValue={selectedContact?.last_name}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="email">Email *</Label>
                        <Input
                            id="email"
                            name="email"
                            type="email"
                            required
                            placeholder="john@example.com"
                            defaultValue={selectedContact?.email}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="phone">Phone Number</Label>
                            <Input
                                id="phone"
                                name="phone"
                                placeholder="+1 (555) 000-0000"
                                defaultValue={selectedContact?.phone}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="job_title">Job Title</Label>
                            <Input
                                id="job_title"
                                name="job_title"
                                placeholder="CEO"
                                defaultValue={selectedContact?.job_title}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="company_id">Company</Label>
                            <select
                                id="company_id"
                                name="company_id"
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                defaultValue={selectedContact?.company_id || ""}
                            >
                                <option value="">Select a company...</option>
                                {companies.map((company) => (
                                    <option key={company.id} value={company.id}>
                                        {company.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="lifecycle_stage">Lifecycle Stage</Label>
                            <select
                                id="lifecycle_stage"
                                name="lifecycle_stage"
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                defaultValue={selectedContact?.lifecycle_stage || "Subscriber"}
                            >
                                <option value="Subscriber">Subscriber</option>
                                <option value="Lead">Lead</option>
                                <option value="Marketing Qualified Lead">Marketing Qualified Lead</option>
                                <option value="Sales Qualified Lead">Sales Qualified Lead</option>
                                <option value="Opportunity">Opportunity</option>
                                <option value="Customer">Customer</option>
                                <option value="Evangelist">Evangelist</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                        <Button type="button" variant="outline" onClick={handleClose}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isLoading}>
                            {isLoading ? 'Saving...' : (selectedContact ? 'Update Contact' : 'Create Contact')}
                        </Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}
