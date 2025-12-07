'use client';

import { useState, useMemo } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Modal } from "@/components/ui/modal";
import { Plus, DollarSign, Calendar, Building2, Search, Upload } from "lucide-react";
import { createDeal, updateDealStage } from '@/app/actions';
import { DndContext, DragOverlay, useDraggable, useDroppable, DragEndEvent, DragStartEvent } from '@dnd-kit/core';
import { createPortal } from 'react-dom';
import Papa from 'papaparse';

const STAGES = [
    'Appointment Scheduled',
    'Qualified to Buy',
    'Presentation Scheduled',
    'Decision Maker Bought-In',
    'Contract Sent',
    'Closed Won',
    'Closed Lost'
];

function DraggableDealCard({ deal, onClick }: { deal: any, onClick: () => void }) {
    const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
        id: deal.id.toString(),
        data: { deal }
    });

    const style = transform ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
    } : undefined;

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...listeners}
            {...attributes}
            onClick={onClick}
            className={`bg-background border border-border rounded-lg p-3 shadow-sm hover:shadow-md transition-shadow cursor-grab active:cursor-grabbing group relative ${isDragging ? 'opacity-50' : ''}`}
        >
            <div className="font-medium text-sm mb-1">{deal.name}</div>
            <div className="flex items-center justify-between text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                    <DollarSign className="h-3 w-3" />
                    {Number(deal.amount).toLocaleString()}
                </div>
                {deal.company_name && (
                    <div className="flex items-center gap-1" title={deal.company_name}>
                        <Building2 className="h-3 w-3" />
                        <span className="truncate max-w-[80px]">{deal.company_name}</span>
                    </div>
                )}
            </div>
            {deal.close_date && (
                <div className="flex items-center gap-1 text-xs text-muted-foreground mt-2">
                    <Calendar className="h-3 w-3" />
                    {new Date(deal.close_date).toLocaleDateString()}
                </div>
            )}
        </div>
    );
}

function DroppableColumn({ stage, deals, totalAmount, onDealClick }: { stage: string, deals: any[], totalAmount: number, onDealClick: (deal: any) => void }) {
    const { setNodeRef } = useDroppable({
        id: stage,
    });

    return (
        <div ref={setNodeRef} className="flex-1 min-w-[280px] flex flex-col gap-3 bg-surface/30 rounded-xl p-3 border border-border/50 h-full">
            <div className="flex items-center justify-between pb-2 border-b border-border/50">
                <h3 className="font-semibold text-sm truncate" title={stage}>{stage}</h3>
                <span className="text-xs text-muted-foreground">{deals.length}</span>
            </div>
            <div className="text-xs font-medium text-muted-foreground mb-2">
                ${totalAmount.toLocaleString()}
            </div>

            <div className="flex-1 overflow-y-auto space-y-3 min-h-[100px]">
                {deals.map((deal) => (
                    <DraggableDealCard key={deal.id} deal={deal} onClick={() => onDealClick(deal)} />
                ))}
            </div>
        </div>
    );
}

import { CrmStageTracker } from '@/components/hubspot/crm/CrmStageTracker';

export default function DealsClient({ initialDeals, companies }: { initialDeals: any[], companies: any[] }) {
    const [deals, setDeals] = useState(initialDeals);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isImportModalOpen, setIsImportModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeDragDeal, setActiveDragDeal] = useState<any>(null);
    const [mounted, setMounted] = useState(false);
    const [selectedStage, setSelectedStage] = useState(STAGES[0]);

    useMemo(() => {
        setMounted(true);
    }, []);

    // Filter deals based on search
    const filteredDeals = useMemo(() => {
        return deals.filter(deal =>
            deal.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            deal.company_name?.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [deals, searchQuery]);

    async function handleSubmit(formData: FormData) {
        setIsLoading(true);
        await createDeal(formData);
        setIsLoading(false);
        setIsModalOpen(false);
        window.location.reload();
    }

    async function handleDragEnd(event: DragEndEvent) {
        const { active, over } = event;
        setActiveDragDeal(null);

        if (!over) return;

        const dealId = parseInt(active.id as string);
        const newStage = over.id as string;
        const deal = deals.find(d => d.id === dealId);

        if (deal && deal.stage !== newStage) {
            setDeals(deals.map(d => d.id === dealId ? { ...d, stage: newStage } : d));
            await updateDealStage(dealId, newStage);
        }
    }

    function handleDragStart(event: DragStartEvent) {
        const deal = event.active.data.current?.deal;
        setActiveDragDeal(deal);
    }

    const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        Papa.parse(file, {
            header: true,
            complete: async (results) => {
                setIsLoading(true);
                for (const row of results.data as any[]) {
                    if (row.name && row.stage) {
                        const formData = new FormData();
                        formData.append('name', row.name);
                        formData.append('amount', row.amount || '0');
                        formData.append('stage', row.stage);
                        formData.append('close_date', row.close_date || '');
                        await createDeal(formData);
                    }
                }
                setIsLoading(false);
                setIsImportModalOpen(false);
                window.location.reload();
            }
        });
    };

    return (
        <div className="space-y-8 h-full flex flex-col">
            <div className="flex items-center justify-between shrink-0">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Deals Pipeline</h2>
                    <p className="text-muted-foreground">
                        Manage your sales pipeline and track revenue.
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <div className="relative w-64">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search deals..."
                            className="pl-8"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <Button variant="outline" onClick={() => setIsImportModalOpen(true)} className="gap-2">
                        <Upload className="h-4 w-4" />
                        Import
                    </Button>
                    <Button onClick={() => setIsModalOpen(true)} className="gap-2">
                        <Plus className="h-4 w-4" />
                        Add Deal
                    </Button>
                </div>
            </div>

            <DndContext onDragEnd={handleDragEnd} onDragStart={handleDragStart}>
                <div className="flex-1 overflow-x-auto pb-4">
                    <div className="flex gap-4 h-full min-w-[1200px]">
                        {STAGES.map((stage) => {
                            const stageDeals = filteredDeals.filter(d => d.stage === stage);
                            const totalAmount = stageDeals.reduce((sum, deal) => sum + Number(deal.amount), 0);

                            return (
                                <DroppableColumn
                                    key={stage}
                                    stage={stage}
                                    deals={stageDeals}
                                    totalAmount={totalAmount}
                                    onDealClick={(deal) => {
                                        // Handle edit if needed
                                    }}
                                />
                            );
                        })}
                    </div>
                </div>
                {mounted && createPortal(
                    <DragOverlay>
                        {activeDragDeal ? (
                            <div className="bg-background border border-border rounded-lg p-3 shadow-xl w-[280px] rotate-3 cursor-grabbing">
                                <div className="font-medium text-sm mb-1">{activeDragDeal.name}</div>
                                <div className="flex items-center justify-between text-xs text-muted-foreground">
                                    <div className="flex items-center gap-1">
                                        <DollarSign className="h-3 w-3" />
                                        {Number(activeDragDeal.amount).toLocaleString()}
                                    </div>
                                </div>
                            </div>
                        ) : null}
                    </DragOverlay>,
                    document.body
                )}
            </DndContext>

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Add New Deal"
            >
                <form action={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Deal Name *</Label>
                        <Input id="name" name="name" required placeholder="Enterprise License - TechCorp" />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="amount">Amount ($)</Label>
                            <Input id="amount" name="amount" type="number" placeholder="5000" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="close_date">Close Date</Label>
                            <Input id="close_date" name="close_date" type="date" />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2 col-span-2">
                            <Label htmlFor="stage">Stage</Label>
                            <input type="hidden" name="stage" value={selectedStage} />
                            <CrmStageTracker
                                stages={STAGES}
                                currentStage={selectedStage}
                                onStageClick={setSelectedStage}
                                className="pt-2 pb-4"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="company_id">Company</Label>
                            <select
                                id="company_id"
                                name="company_id"
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                            >
                                <option value="">Select a company...</option>
                                {companies.map((company) => (
                                    <option key={company.id} value={company.id}>
                                        {company.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                        <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isLoading}>
                            {isLoading ? 'Creating...' : 'Create Deal'}
                        </Button>
                    </div>
                </form>
            </Modal>

            <Modal
                isOpen={isImportModalOpen}
                onClose={() => setIsImportModalOpen(false)}
                title="Import Deals"
            >
                <div className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                        Upload a CSV file with columns: <code>name, amount, stage, close_date</code>
                    </p>
                    <div className="grid w-full max-w-sm items-center gap-1.5">
                        <Label htmlFor="csv">CSV File</Label>
                        <Input id="csv" type="file" accept=".csv" onChange={handleImport} />
                    </div>
                    {isLoading && <p className="text-sm text-muted-foreground">Importing...</p>}
                </div>
            </Modal>
        </div >
    );
}
