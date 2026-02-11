'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/ui/Navbar';
import {
    Search,
    Users,
    TrendingUp,
    Calendar,
    DollarSign,
    Tag,
    Briefcase,
    Filter,
    MapPin,
    Star
} from 'lucide-react';
import { formatDate, generateAvatar } from '@/lib/utils';
import { Loading } from '@/components/ui/Loading';
import { Button } from '@/components/ui/Button';

interface Profile {
    id: string;
    full_name: string;
    email: string;
    role: string;
    bio?: string;
    avatar_url?: string;
    followers_count?: number;
    category?: string;
}

export default function BrowsePage() {
    const [profiles, setProfiles] = useState<Profile[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [roleFilter, setRoleFilter] = useState<string>('all');
    const router = useRouter();
    const supabase = createClient();

    useEffect(() => {
        loadProfiles();
    }, [roleFilter]);

    const loadProfiles = async () => {
        setIsLoading(true);

        let query = supabase
            .from('profiles')
            .select('*')
            .order('created_at', { ascending: false });

        if (roleFilter !== 'all') {
            query = query.eq('role', roleFilter);
        }

        const { data, error } = await query;

        if (!error && data) {
            setProfiles(data);
        }
        setIsLoading(false);
    };

    const filteredProfiles = profiles.filter((profile) =>
        profile.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        profile.bio?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (isLoading) {
        return <Loading />;
    }

    return (
        <div className="min-h-screen bg-[#f8fafc]">
            <Navbar />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Browse Profiles</h1>
                        <p className="text-slate-500 mt-1 text-[15px]">Connect with top influencers, brands, and creative talent</p>
                    </div>
                </div>

                {/* Search and Filter Bar */}
                <div className="bg-white rounded-[28px] border border-slate-100 p-4 mb-10 shadow-sm flex flex-col lg:flex-row gap-4">
                    <div className="flex-1 relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-brand-indigo transition-colors" />
                        <input
                            type="text"
                            placeholder="Search by name, bio, or category..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-transparent rounded-[18px] focus:outline-none focus:ring-2 focus:ring-brand-indigo/10 focus:bg-white focus:border-brand-indigo transition-all text-sm"
                        />
                    </div>

                    <div className="flex bg-slate-50 p-1.5 rounded-[20px] border border-slate-50">
                        {['all', 'influencer', 'brand', 'creator'].map((role) => (
                            <button
                                key={role}
                                onClick={() => setRoleFilter(role)}
                                className={`px-5 py-2 rounded-xl text-[13px] font-bold transition-all duration-200 capitalize ${roleFilter === role
                                    ? 'bg-white text-slate-900 shadow-sm'
                                    : 'text-slate-500 hover:text-slate-700'
                                    }`}
                            >
                                {role}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Profiles Grid */}
                {filteredProfiles.length === 0 ? (
                    <div className="bg-white rounded-[32px] border border-slate-100 p-20 text-center shadow-sm">
                        <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Users className="w-10 h-10 text-slate-200" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 mb-2">
                            No profiles found
                        </h3>
                        <p className="text-slate-500 max-w-sm mx-auto">
                            We couldn't find any profiles matching your search or filters. Try adjusting your criteria.
                        </p>
                        <Button variant="secondary" className="mt-8" onClick={() => { setSearchQuery(''); setRoleFilter('all'); }}>
                            Clear all filters
                        </Button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredProfiles.map((profile) => (
                            <div
                                key={profile.id}
                                onClick={() => router.push(`/profile/${profile.id}`)}
                                className="bg-white rounded-[32px] border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer p-8 group flex flex-col"
                            >
                                <div className="flex items-center gap-5 mb-6">
                                    <div className="relative">
                                        <img
                                            src={profile.avatar_url || generateAvatar(profile.full_name || 'User')}
                                            alt={profile.full_name}
                                            className="w-16 h-16 rounded-[22px] object-cover border-2 border-slate-50 shadow-sm"
                                        />
                                        <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-lg bg-emerald-500 flex items-center justify-center border-2 border-white">
                                            <TrendingUp className="w-3 h-3 text-white" />
                                        </div>
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-lg font-bold text-slate-900 leading-tight group-hover:text-brand-indigo transition-colors line-clamp-1">
                                            {profile.full_name || 'Unknown User'}
                                        </h3>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${profile.role === 'influencer' ? 'bg-indigo-50 text-brand-indigo' :
                                                profile.role === 'brand' ? 'bg-amber-50 text-amber-600' :
                                                    'bg-slate-50 text-slate-500'
                                                }`}>
                                                {profile.role}
                                            </span>
                                            {profile.category && (
                                                <span className="text-[11px] font-medium text-slate-400 capitalize underline underline-offset-4 decoration-slate-100">
                                                    {profile.category}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {profile.bio ? (
                                    <p className="text-slate-500 text-[14px] leading-relaxed line-clamp-3 mb-6 flex-1">
                                        {profile.bio}
                                    </p>
                                ) : (
                                    <div className="flex-1 mb-6 italic text-slate-300 text-[14px]">No bio provided yet...</div>
                                )}

                                <div className="space-y-4 pt-6 border-t border-slate-50">
                                    <div className="flex items-center justify-between">
                                        <div className="flex flex-col">
                                            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1">Reach</span>
                                            <span className="text-[15px] font-bold text-slate-900">
                                                {profile.followers_count ? profile.followers_count.toLocaleString() : '1k+'}
                                            </span>
                                        </div>
                                        <div className="flex -space-x-2">
                                            {[1, 2, 3].map(i => (
                                                <div key={i} className="w-6 h-6 rounded-full border-2 border-white bg-slate-100" />
                                            ))}
                                        </div>
                                    </div>

                                    <Button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            router.push(`/profile/${profile.id}`);
                                        }}
                                        variant="secondary"
                                        className="w-full py-6 bg-slate-50 text-slate-900 hover:bg-slate-100 border-slate-100 shadow-none font-bold"
                                    >
                                        View Portfolio
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
