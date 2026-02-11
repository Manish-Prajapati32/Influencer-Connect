'use client';

import { useEffect, useState, useRef } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter, useParams } from 'next/navigation';
import { Navbar } from '@/components/ui/Navbar';
import { Button } from '@/components/ui/Button';
import { ArrowLeft, Calendar, DollarSign, Tag } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import { Loading } from '@/components/ui/Loading';

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

export default function CampaignDetailPage() {
    const [campaign, setCampaign] = useState<Campaign | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [user, setUser] = useState<any>(null);
    const [hasApplied, setHasApplied] = useState(false);
    const [showApplicationForm, setShowApplicationForm] = useState(false);
    const [applicationMessage, setApplicationMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const params = useParams();
    const router = useRouter();
    const supabase = createClient();
    const applicationFormRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        loadCampaign();
        loadUser();
    }, [params.id]);

    // Auto-scroll to application form when it appears
    useEffect(() => {
        if (showApplicationForm && applicationFormRef.current) {
            setTimeout(() => {
                applicationFormRef.current?.scrollIntoView({
                    behavior: 'smooth',
                    block: 'center'
                });
            }, 100);
        }
    }, [showApplicationForm]);

    const loadUser = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        setUser(user);

        if (user && params.id) {
            // Check if already applied
            const { data } = await supabase
                .from('campaign_applications')
                .select('id')
                .eq('campaign_id', params.id)
                .eq('applicant_id', user.id)
                .single();

            setHasApplied(!!data);
        }
    };

    const loadCampaign = async () => {
        const { data, error } = await supabase
            .from('campaigns')
            .select('*')
            .eq('id', params.id)
            .single();

        if (!error && data) {
            setCampaign(data);
        }
        setIsLoading(false);
    };

    const handleApply = async () => {
        if (!user) {
            router.push('/login');
            return;
        }

        if (!applicationMessage.trim()) {
            alert('Please write a message explaining why you\'re a good fit for this campaign.');
            return;
        }

        setIsSubmitting(true);

        try {
            const { error } = await supabase.from('campaign_applications').insert({
                campaign_id: params.id,
                applicant_id: user.id,
                message: applicationMessage.trim(),
                status: 'pending',
            });

            if (error) {
                console.error('Application error:', error);
                alert('Failed to submit application. Please try again.');
                setIsSubmitting(false);
                return;
            }

            // Create notification for brand
            if (campaign) {
                await supabase.from('notifications').insert({
                    user_id: campaign.created_by,
                    type: 'campaign_invite',
                    title: 'New Campaign Application',
                    message: `Someone applied to your campaign "${campaign.title}"`,
                    reference_id: params.id as string,
                    reference_type: 'campaign',
                });
            }

            setHasApplied(true);
            setShowApplicationForm(false);
            setApplicationMessage('');

            alert('✅ Application submitted successfully! The brand will review your application.');
        } catch (err) {
            console.error('Unexpected error:', err);
            alert('An unexpected error occurred. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return <Loading />;
    }

    if (!campaign) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Navbar />
                <div className="container mx-auto px-4 py-8">
                    <p className="text-center text-gray-600">Campaign not found</p>
                </div>
            </div>
        );
    }

    const isOwnCampaign = user && campaign.created_by === user.id;

    return (
        <div className="min-h-screen bg-[#f8fafc]">
            <Navbar />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                {/* Back Link */}
                <button
                    onClick={() => router.back()}
                    className="group flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors mb-8 font-medium text-sm"
                >
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    Back to campaigns
                </button>

                <div className="flex flex-col lg:flex-row gap-8 items-start">
                    {/* Main Content Pillar */}
                    <div className="flex-1 space-y-8 w-full">
                        {/* Header Box */}
                        <div className="bg-white rounded-[40px] border border-slate-100 p-8 sm:p-12 shadow-sm">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-8">
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3">
                                        <span className={`px-4 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-widest ${campaign.status === 'active'
                                            ? 'bg-emerald-50 text-emerald-600'
                                            : 'bg-slate-100 text-slate-500'
                                            }`}>
                                            {campaign.status}
                                        </span>
                                        <span className="text-slate-300">•</span>
                                        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                                            Posted {formatDate(campaign.created_at)}
                                        </span>
                                    </div>
                                    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-[1.1]">
                                        {campaign.title}
                                    </h1>
                                </div>

                                {campaign.status === 'active' && !isOwnCampaign && (
                                    <div className="shrink-0">
                                        <Button
                                            variant={hasApplied ? 'secondary' : 'primary'}
                                            size="lg"
                                            onClick={() => {
                                                if (!user) {
                                                    router.push('/login');
                                                    return;
                                                }
                                                setShowApplicationForm(!showApplicationForm);
                                            }}
                                            disabled={hasApplied}
                                            className={`min-w-[180px] py-7 text-lg ${hasApplied ? 'bg-emerald-50 text-emerald-600 border-none' : ''}`}
                                        >
                                            {hasApplied ? '✓ Application Sent' : 'Apply Now'}
                                        </Button>
                                    </div>
                                )}
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 py-8 border-t border-slate-50">
                                <div className="flex flex-col gap-1">
                                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Fixed Budget</span>
                                    <div className="flex items-center gap-2 text-2xl font-black text-slate-900">
                                        <DollarSign className="w-5 h-5 text-emerald-500" />
                                        <span>${campaign.budget.toLocaleString()}</span>
                                    </div>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Primary Category</span>
                                    <div className="flex items-center gap-2 text-xl font-bold text-slate-900 capitalize">
                                        <Tag className="w-5 h-5 text-brand-indigo" />
                                        <span>{campaign.category}</span>
                                    </div>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Opportunity Ends</span>
                                    <div className="flex items-center gap-2 text-xl font-bold text-slate-900">
                                        <Calendar className="w-5 h-5 text-rose-500" />
                                        <span>{formatDate(campaign.deadline)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Details Section */}
                        <div className="bg-white rounded-[40px] border border-slate-100 p-8 sm:p-12 shadow-sm space-y-12">
                            <div>
                                <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                                    <div className="w-1.5 h-6 bg-brand-indigo rounded-full" />
                                    Campaign Description
                                </h2>
                                <p className="text-slate-600 text-lg leading-relaxed whitespace-pre-line font-medium">
                                    {campaign.description}
                                </p>
                            </div>

                            <div>
                                <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                                    <div className="w-1.5 h-6 bg-brand-violet rounded-full" />
                                    Requirements & Deliverables
                                </h2>
                                <div className="bg-slate-50 rounded-3xl p-8 border border-slate-100">
                                    <p className="text-slate-600 text-lg leading-relaxed whitespace-pre-line font-medium">
                                        {campaign.requirements}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Application Form Drawer-style */}
                        {showApplicationForm && !hasApplied && (
                            <div
                                ref={applicationFormRef}
                                className="bg-white rounded-[40px] border-2 border-brand-indigo p-8 sm:p-12 shadow-2xl shadow-indigo-100 animate-in slide-in-from-bottom-10 fade-in duration-500"
                            >
                                <div className="flex items-center justify-between mb-8">
                                    <h3 className="text-3xl font-bold text-slate-900">
                                        Submit Your Proposal
                                    </h3>
                                    <Button variant="ghost" size="sm" onClick={() => setShowApplicationForm(false)}>
                                        Close
                                    </Button>
                                </div>
                                <p className="text-slate-500 mb-6 font-medium">
                                    Explain why you're the perfect fit for this collaboration. Mention your audience demographics, past success, and your creative vision for this campaign.
                                </p>
                                <textarea
                                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 text-slate-900 px-6 py-4 mb-8 focus:outline-none focus:ring-4 focus:ring-brand-indigo/10 focus:border-brand-indigo focus:bg-white transition-all min-h-[220px] text-lg font-medium"
                                    placeholder="Write your pitch here..."
                                    value={applicationMessage}
                                    onChange={(e) => setApplicationMessage(e.target.value)}
                                />
                                <div className="flex flex-col sm:flex-row gap-4">
                                    <Button
                                        variant="primary"
                                        size="lg"
                                        onClick={handleApply}
                                        isLoading={isSubmitting}
                                        className="sm:flex-1 py-7 text-lg"
                                    >
                                        Send Proposal
                                    </Button>
                                    <Button
                                        variant="secondary"
                                        size="lg"
                                        onClick={() => setShowApplicationForm(false)}
                                        className="py-7 text-lg"
                                    >
                                        I'll think about it
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Sidebar / Quick Actions Box */}
                    <div className="w-full lg:w-[380px] space-y-6 lg:sticky lg:top-28">
                        <div className="bg-slate-900 rounded-[40px] p-8 text-white shadow-xl shadow-slate-200">
                            <h3 className="text-xl font-bold mb-6">Campaign Summary</h3>
                            <div className="space-y-6">
                                <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/10">
                                    <span className="text-slate-400 text-sm font-bold uppercase tracking-wider">Positions</span>
                                    <span className="font-bold">Multiple</span>
                                </div>
                                <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/10">
                                    <span className="text-slate-400 text-sm font-bold uppercase tracking-wider">Experience</span>
                                    <span className="font-bold">Expert</span>
                                </div>
                                <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/10">
                                    <span className="text-slate-400 text-sm font-bold uppercase tracking-wider">Location</span>
                                    <span className="font-bold">Remote</span>
                                </div>
                            </div>

                            {!isOwnCampaign && campaign.status === 'active' && !hasApplied && (
                                <Button
                                    className="w-full mt-10 py-7 bg-white text-slate-900 hover:bg-slate-100 border-none font-bold text-lg"
                                    onClick={() => setShowApplicationForm(true)}
                                >
                                    Start Application
                                </Button>
                            )}
                        </div>

                        <div className="bg-white rounded-[40px] border border-slate-100 p-8 shadow-sm">
                            <h4 className="font-bold text-slate-900 mb-4">Verification Check</h4>
                            <div className="space-y-4">
                                <div className="flex items-center gap-3 text-sm text-slate-600 font-medium">
                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                    Brand identity verified
                                </div>
                                <div className="flex items-center gap-3 text-sm text-slate-600 font-medium">
                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                    Budget escrow confirmed
                                </div>
                                <div className="flex items-center gap-3 text-sm text-slate-600 font-medium">
                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                    Secure messaging active
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );

}
