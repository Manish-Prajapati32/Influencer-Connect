'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/ui/Navbar';
import { Calendar, DollarSign, Tag, Briefcase } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import { Loading } from '@/components/ui/Loading';
import { Button } from '@/components/ui/Button';

interface Campaign {
    id: string;
    title: string;
    description: string;
    budget: number;
    category: string;
    status: string;
    created_at: string;
    deadline: string;
    requirements: string;
    created_by: string;
}

export default function CampaignsPage() {
    const [campaigns, setCampaigns] = useState<Campaign[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('active');
    const router = useRouter();
    const supabase = createClient();

    useEffect(() => {
        loadCampaigns();
    }, [filter]);

    const loadCampaigns = async () => {
        setIsLoading(true);

        let query = supabase
            .from('campaigns')
            .select('*')
            .order('created_at', { ascending: false });

        if (filter !== 'all') {
            query = query.eq('status', filter);
        }

        const { data, error } = await query;

        if (!error && data) {
            setCampaigns(data);
        }
        setIsLoading(false);
    };

    if (isLoading) {
        return <Loading />;
    }

    return (
        <div className="min-h-screen bg-[#f8fafc]">
            <Navbar />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Campaigns</h1>
                        <p className="text-slate-500 mt-1 text-[15px]">Discover and apply to high-impact collaboration opportunities</p>
                    </div>

                    {/* Filter Tabs */}
                    <div className="bg-slate-100/50 p-1.5 rounded-2xl flex items-center border border-slate-100">
                        {(['all', 'active', 'completed'] as const).map((status) => (
                            <button
                                key={status}
                                onClick={() => setFilter(status)}
                                className={`px-5 py-2 rounded-xl text-[13px] font-bold transition-all duration-200 capitalize ${filter === status
                                    ? 'bg-white text-slate-900 shadow-sm'
                                    : 'text-slate-500 hover:text-slate-700'
                                    }`}
                            >
                                {status}
                            </button>
                        ))}
                    </div>
                </div>

                {campaigns.length === 0 ? (
                    <div className="bg-white rounded-[32px] border border-slate-100 p-20 text-center shadow-sm">
                        <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Briefcase className="w-10 h-10 text-slate-200" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 mb-2">
                            No campaigns found
                        </h3>
                        <p className="text-slate-500 max-w-sm mx-auto">
                            {filter === 'all'
                                ? 'The marketplace is quiet right now. Check back soon for new opportunities.'
                                : `There are no ${filter} campaigns matching your current filter.`}
                        </p>
                        <Button variant="secondary" className="mt-8" onClick={() => setFilter('all')}>
                            View all campaigns
                        </Button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {campaigns.map((campaign) => (
                            <div
                                key={campaign.id}
                                onClick={() => router.push(`/campaigns/${campaign.id}`)}
                                className="bg-white rounded-[28px] border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col group"
                            >
                                <div className="p-8 flex flex-col flex-1">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="p-3 rounded-2xl bg-indigo-50 text-brand-indigo group-hover:bg-brand-indigo group-hover:text-white transition-colors">
                                            <Tag className="w-5 h-5" />
                                        </div>
                                        <div className={`px-4 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wider ${campaign.status === 'active'
                                            ? 'bg-emerald-50 text-emerald-600'
                                            : 'bg-slate-50 text-slate-500'
                                            }`}>
                                            {campaign.status}
                                        </div>
                                    </div>

                                    <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-brand-indigo transition-colors">
                                        {campaign.title}
                                    </h3>

                                    <p className="text-slate-500 text-[14px] leading-relaxed line-clamp-2 mb-6">
                                        {campaign.description}
                                    </p>

                                    <div className="mt-auto space-y-4 pt-6 border-t border-slate-50">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="flex flex-col">
                                                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1">Budget</span>
                                                <div className="flex items-center gap-1.5 text-slate-900 font-bold">
                                                    <DollarSign className="w-4 h-4 text-emerald-500" />
                                                    <span>${campaign.budget.toLocaleString()}</span>
                                                </div>
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1">Category</span>
                                                <div className="flex items-center gap-1.5 text-slate-900 font-bold capitalize">
                                                    <Tag className="w-4 h-4 text-brand-indigo" />
                                                    <span>{campaign.category}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2 text-[13px] text-slate-500 bg-slate-50/50 p-2.5 rounded-xl">
                                            <Calendar className="w-4 h-4 text-slate-400" />
                                            <span>Deadline: <span className="font-semibold text-slate-700">{formatDate(campaign.deadline)}</span></span>
                                        </div>
                                    </div>
                                </div>

                                <div className="px-8 pb-8">
                                    <Button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            router.push(`/campaigns/${campaign.id}`);
                                        }}
                                        variant="secondary"
                                        className="w-full py-6 bg-slate-900 text-white hover:bg-slate-800 border-none group-hover:shadow-lg group-hover:shadow-indigo-100"
                                    >
                                        View Details
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}
