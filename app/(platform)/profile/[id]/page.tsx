'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter, useParams } from 'next/navigation';
import { Navbar } from '@/components/ui/Navbar';
import { Button } from '@/components/ui/Button';
import { MessageSquare, Mail, Calendar, MapPin, Share2, Download } from 'lucide-react';
import { Loading } from '@/components/ui/Loading';
import { generateAvatar, formatDate } from '@/lib/utils';

interface Profile {
    id: string;
    full_name: string;
    email: string;
    role: string;
    bio?: string;
    avatar_url?: string;
    followers_count?: number;
    category?: string;
    location?: string;
    website?: string;
    created_at: string;
}

export default function ProfilePage() {
    const [profile, setProfile] = useState<Profile | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [currentUser, setCurrentUser] = useState<any>(null);
    const params = useParams();
    const router = useRouter();
    const supabase = createClient();

    useEffect(() => {
        loadProfile();
        loadCurrentUser();
    }, [params.id]);

    const loadCurrentUser = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        setCurrentUser(user);
    };

    const loadProfile = async () => {
        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', params.id)
            .single();

        if (!error && data) {
            setProfile(data);
        }
        setIsLoading(false);
    };

    const handleSendMessage = async () => {
        if (!currentUser) {
            router.push('/login');
            return;
        }

        // Check if conversation exists
        const { data: existingConversation } = await supabase
            .from('conversations')
            .select('id')
            .or(`and(participant1_id.eq.${currentUser.id},participant2_id.eq.${params.id}),and(participant1_id.eq.${params.id},participant2_id.eq.${currentUser.id})`)
            .single();

        if (existingConversation) {
            router.push(`/messages?conversation=${existingConversation.id}`);
        } else {
            // Create new conversation
            const { data: newConversation } = await supabase
                .from('conversations')
                .insert({
                    participant1_id: currentUser.id,
                    participant2_id: params.id,
                })
                .select()
                .single();

            if (newConversation) {
                router.push(`/messages?conversation=${newConversation.id}`);
            }
        }
    };

    if (isLoading) {
        return <Loading />;
    }

    if (!profile) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Navbar />
                <div className="container mx-auto px-4 py-8">
                    <p className="text-center text-gray-600">Profile not found</p>
                </div>
            </div>
        );
    }

    const isOwnProfile = currentUser && currentUser.id === profile.id;

    return (
        <div className="min-h-screen bg-[#f8fafc]">
            <Navbar />

            <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <div className="bg-white rounded-[40px] border border-slate-100 shadow-[0_20px_50px_rgba(0,0,0,0.03)] overflow-hidden">
                    {/* Header / Cover Image */}
                    <div className="relative h-64 sm:h-80 bg-gradient-to-br from-brand-indigo via-brand-violet to-indigo-900 overflow-hidden">
                        <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
                        <div className="absolute -bottom-16 -left-16 w-64 h-64 bg-white/10 rounded-full blur-3xl animate-pulse" />
                        <div className="absolute -top-16 -right-16 w-64 h-64 bg-brand-violet/20 rounded-full blur-3xl animate-pulse delay-700" />
                    </div>

                    {/* Profile Section */}
                    <div className="px-6 sm:px-12 pb-12">
                        <div className="flex flex-col sm:flex-row sm:items-end justify-between -mt-20 sm:-mt-24 mb-10 gap-6">
                            <div className="relative">
                                <img
                                    src={profile.avatar_url || generateAvatar(profile.full_name || 'User')}
                                    alt={profile.full_name}
                                    className="w-40 h-40 sm:w-48 sm:h-48 rounded-[48px] border-[8px] border-white object-cover shadow-2xl relative z-10"
                                />
                                <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-emerald-500 rounded-2xl border-4 border-white z-20 shadow-lg flex items-center justify-center">
                                    <div className="w-3 h-3 bg-white rounded-full animate-pulse" />
                                </div>
                            </div>

                            <div className="flex gap-4 pb-4">
                                {!isOwnProfile && (
                                    <Button
                                        variant="primary"
                                        size="lg"
                                        onClick={handleSendMessage}
                                        className="py-6 px-8 rounded-2xl bg-slate-900 text-white hover:bg-slate-800 border-none shadow-xl shadow-slate-200 text-base font-bold"
                                    >
                                        <MessageSquare className="w-5 h-5" />
                                        Send Message
                                    </Button>
                                )}

                                {isOwnProfile && (
                                    <Button
                                        variant="secondary"
                                        size="lg"
                                        onClick={() => router.push('/profile/edit')}
                                        className="py-6 px-8 rounded-2xl border-slate-200 hover:bg-slate-50 text-base font-bold"
                                    >
                                        Edit Portfolio
                                    </Button>
                                )}
                            </div>
                        </div>

                        <div className="grid lg:grid-cols-3 gap-12">
                            {/* Left Column: Basic Info */}
                            <div className="lg:col-span-2 space-y-10">
                                <div>
                                    <div className="flex items-center gap-3 mb-2">
                                        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">
                                            {profile.full_name || 'Unknown User'}
                                        </h1>
                                        <span className="px-3 py-1 bg-indigo-50 text-brand-indigo rounded-full text-[10px] font-black uppercase tracking-widest border border-indigo-100/50">
                                            {profile.role}
                                        </span>
                                    </div>
                                    <p className="text-slate-500 text-lg font-medium flex items-center gap-2">
                                        <MapPin className="w-4 h-4 text-slate-400" />
                                        {profile.location || 'Global Remote'}
                                    </p>
                                </div>

                                <div>
                                    <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-3">
                                        <div className="w-1.5 h-6 bg-brand-indigo rounded-full" />
                                        Professional Bio
                                    </h2>
                                    <p className="text-slate-600 text-[17px] leading-relaxed font-medium whitespace-pre-line">
                                        {profile.bio || "This user hasn't added a bio yet. They are likely busy building amazing things or creating high-impact content for the Influencer Connect platform."}
                                    </p>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pb-8">
                                    <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 flex items-center gap-4">
                                        <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm text-brand-indigo">
                                            <Mail className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Email Address</p>
                                            <p className="text-slate-900 font-bold">{profile.email || 'Private'}</p>
                                        </div>
                                    </div>
                                    <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 flex items-center gap-4">
                                        <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm text-brand-violet">
                                            <Calendar className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Member Since</p>
                                            <p className="text-slate-900 font-bold">{formatDate(profile.created_at)}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Right Column: Stats & Meta */}
                            <div className="space-y-6">
                                <div className="p-8 bg-slate-50 rounded-[40px] border border-slate-100">
                                    <h3 className="font-bold text-slate-900 mb-6 uppercase text-xs tracking-widest text-center">Performance Metrics</h3>
                                    <div className="space-y-8">
                                        <div className="text-center">
                                            <div className="text-4xl font-black text-slate-900 mb-1">
                                                {profile.followers_count ? profile.followers_count.toLocaleString() : '1.2k'}
                                            </div>
                                            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Total Reach</p>
                                        </div>
                                        <div className="h-px bg-slate-200/50 mx-8" />
                                        <div className="text-center">
                                            <div className="text-4xl font-black text-slate-900 mb-1">12</div>
                                            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Campaigns</p>
                                        </div>
                                        <div className="h-px bg-slate-200/50 mx-8" />
                                        <div className="text-center">
                                            <div className="text-4xl font-black text-slate-900 mb-1">98%</div>
                                            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Satisfaction</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-8 bg-brand-indigo rounded-[40px] text-white shadow-xl shadow-indigo-100">
                                    <h4 className="font-bold mb-4">Quick Links</h4>
                                    <div className="space-y-4">
                                        <button className="w-full py-3 bg-white/10 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-white/20 transition-all">
                                            <Share2 className="w-4 h-4" />
                                            Share Portfolio
                                        </button>
                                        <button className="w-full py-3 bg-white/10 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-white/20 transition-all">
                                            <Download className="w-4 h-4" />
                                            Download Kit
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );

}
