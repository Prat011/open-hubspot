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
import { Plus, MoreHorizontal, Globe, MapPin, Search } from "lucide-react";
import { createCompany, updateCompany } from '@/app/actions';

export default function CompaniesClient({ initialCompanies }: { initialCompanies: any[] }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedCompany, setSelectedCompany] = useState<any>(null);

    async function handleSubmit(formData: FormData) {
        setIsLoading(true);
        if (selectedCompany) {
            await updateCompany(selectedCompany.id, formData);
        } else {
            await createCompany(formData);
        }
        setIsLoading(false);
        setIsModalOpen(false);
        setSelectedCompany(null);
    }

    function handleEdit(company: any, e: React.MouseEvent) {
        e.stopPropagation();
        setSelectedCompany(company);
        setIsModalOpen(true);
    }

    function handleClose() {
        setIsModalOpen(false);
        setSelectedCompany(null);
    }

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Companies</h2>
                    <p className="text-muted-foreground">
                        Track organizations and their details.
                    </p>
                </div>
                <Button onClick={() => setIsModalOpen(true)} className="gap-2">
                    <Plus className="h-4 w-4" />
                    Add Company
                </Button>
            </div>

            <Card className="glass">
                <div className="p-4 border-b border-border">
                    <div className="relative w-full max-w-sm">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input placeholder="Search companies..." className="pl-8" />
                    </div>
                </div>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[300px]">Company Name</TableHead>
                            <TableHead>Industry</TableHead>
                            <TableHead>Location</TableHead>
                            <TableHead>Employees</TableHead>
                            <TableHead>Annual Revenue</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {initialCompanies.map((company) => (
                            <TableRow
                                key={company.id}
                                className="group cursor-pointer hover:bg-surface-hover/50"
                                onClick={() => {
                                    setSelectedCompany(company);
                                    setIsModalOpen(true);
                                }}
                            >
                                <TableCell className="font-medium">
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 rounded-lg bg-secondary flex items-center justify-center text-lg font-bold text-muted-foreground">
                                            {company.name[0]}
                                        </div>
                                        <div>
                                            <div className="font-semibold">{company.name}</div>
                                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                                <Globe className="h-3 w-3" />
                                                {company.domain || 'N/A'}
                                            </div>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell>{company.industry || '-'}</TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-1 text-muted-foreground">
                                        <MapPin className="h-3 w-3" />
                                        {[company.city, company.state].filter(Boolean).join(', ') || '-'}
                                    </div>
                                </TableCell>
                                <TableCell>{company.employees || '-'}</TableCell>
                                <TableCell>{company.revenue || '-'}</TableCell>
                                <TableCell className="text-right">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                                        onClick={(e) => handleEdit(company, e)}
                                    >
                                        <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                        {initialCompanies.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                                    No companies found. Create one to get started.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </Card>

            <Modal
                isOpen={isModalOpen}
                onClose={handleClose}
                title={selectedCompany ? "Edit Company" : "Add New Company"}
            >
                <form action={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Company Name *</Label>
                            <Input
                                id="name"
                                name="name"
                                required
                                placeholder="Acme Inc."
                                defaultValue={selectedCompany?.name}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="domain">Domain Name</Label>
                            <Input
                                id="domain"
                                name="domain"
                                placeholder="acme.com"
                                defaultValue={selectedCompany?.domain}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="industry">Industry</Label>
                            <Input
                                id="industry"
                                name="industry"
                                placeholder="Technology"
                                defaultValue={selectedCompany?.industry}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="lifecycle_stage">Lifecycle Stage</Label>
                            <select
                                id="lifecycle_stage"
                                name="lifecycle_stage"
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                defaultValue={selectedCompany?.lifecycle_stage || "Subscriber"}
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

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="employees">Number of Employees</Label>
                            <Input
                                id="employees"
                                name="employees"
                                placeholder="10-50"
                                defaultValue={selectedCompany?.employees}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="revenue">Annual Revenue</Label>
                            <Input
                                id="revenue"
                                name="revenue"
                                placeholder="$1M - $5M"
                                defaultValue={selectedCompany?.revenue}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="city">City</Label>
                            <Input
                                id="city"
                                name="city"
                                placeholder="San Francisco"
                                defaultValue={selectedCompany?.city}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="state">State</Label>
                            <Input
                                id="state"
                                name="state"
                                placeholder="CA"
                                defaultValue={selectedCompany?.state}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="country">Country</Label>
                            <Input
                                id="country"
                                name="country"
                                placeholder="USA"
                                defaultValue={selectedCompany?.country}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Input
                            id="description"
                            name="description"
                            placeholder="Brief description of the company"
                            defaultValue={selectedCompany?.description}
                        />
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                        <Button type="button" variant="outline" onClick={handleClose}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isLoading}>
                            {isLoading ? 'Saving...' : (selectedCompany ? 'Update Company' : 'Create Company')}
                        </Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}
