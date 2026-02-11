import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Navbar } from '@/components/ui/Navbar';
import {
    LayoutDashboard,
    MessageSquare,
    Briefcase,
    Users,
    TrendingUp,
    Clock,
    CheckCircle2,
    Plus,
    ArrowUpRight
} from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default async function DashboardPage() {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect('/login');
    }

    const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

    const stats = [
        { label: 'Active Applications', value: '12', icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
        { label: 'Unread Messages', value: '4', icon: MessageSquare, color: 'text-brand-indigo', bg: 'bg-indigo-50' },
        { label: 'Profile Views', value: '1.2k', icon: TrendingUp, color: 'text-emerald-600', bg: 'bg-emerald-50' },
        { label: 'Active Campaigns', value: '3', icon: Briefcase, color: 'text-brand-violet', bg: 'bg-violet-50' },
    ];

    return (
        <div className="min-h-screen bg-[#f8fafc]">
            <Navbar />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                {/* Hero Header */}
                <div className="relative overflow-hidden rounded-[32px] bg-slate-900 px-8 py-12 mb-10 shadow-2xl shadow-slate-200">
                    <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-brand-indigo opacity-20 blur-[100px]" />
                    <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 bg-brand-violet opacity-10 blur-[100px]" />

                    <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div>
                            <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
                                Welcome back, <span className="text-brand-indigo">{profile?.full_name?.split(' ')[0] || 'User'}</span>!
                            </h1>
                            <p className="text-slate-400 mt-2 text-lg">
                                {profile?.role === 'brand'
                                    ? "Manage your campaigns and discover top talent today."
                                    : "Browse new opportunities and build your professional network."}
                            </p>
                        </div>
                        <div className="flex gap-3">
                            <Button variant="primary" size="lg" className="bg-white text-slate-900 hover:bg-slate-100 border-none shadow-lg">
                                <Plus className="w-5 h-5" />
                                <span>{profile?.role === 'brand' ? 'Create Campaign' : 'Find Gigs'}</span>
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                    {stats.map((stat, i) => (
                        <div key={i} className="bg-white border border-slate-100 p-6 rounded-[24px] shadow-sm hover:shadow-md transition-all duration-300 group">
                            <div className="flex items-center justify-between mb-4">
                                <div className={`p-3 rounded-xl ${stat.bg} ${stat.color} transition-transform group-hover:scale-110`}>
                                    <stat.icon className="w-6 h-6" />
                                </div>
                                <span className="text-emerald-500 text-xs font-bold flex items-center gap-1">
                                    <ArrowUpRight className="w-3 h-3" />
                                    +12%
                                </span>
                            </div>
                            <h3 className="text-slate-500 font-medium text-sm">{stat.label}</h3>
                            <p className="text-2xl font-bold text-slate-900 mt-1">{stat.value}</p>
                        </div>
                    ))}
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Main Content Area */}
                    <div className="lg:col-span-2 space-y-8">
                        <section className="bg-white border border-slate-100 rounded-[32px] p-8 shadow-sm">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                                    <Clock className="w-5 h-5 text-brand-indigo" />
                                    Recent Opportunities
                                </h2>
                                <a href="/campaigns" className="text-sm font-semibold text-brand-indigo hover:text-brand-violet transition-colors">
                                    View all
                                </a>
                            </div>

                            <div className="space-y-4">
                                {[1, 2, 3].map((i) => (
                                    <div key={i} className="flex items-center justify-between p-4 rounded-2xl border border-slate-50 hover:border-slate-100 hover:bg-slate-50/50 transition-all cursor-pointer group">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400">
                                                <Briefcase className="w-6 h-6" />
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-slate-900 group-hover:text-brand-indigo transition-colors">Summer Fashion Reel</h4>
                                                <p className="text-sm text-slate-500">Zara Worldwide • $1,200 - $2,500</p>
                                            </div>
                                        </div>
                                        <div className="hidden sm:flex flex-col items-end">
                                            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Deadline</span>
                                            <span className="text-sm font-medium text-slate-700">Aug 24, 2024</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </div>

                    {/* Sidebar Area */}
                    <div className="space-y-8">
                        <section className="bg-white border border-slate-100 rounded-[32px] p-8 shadow-sm">
                            <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                                <Users className="w-5 h-5 text-emerald-500" />
                                Profile Strength
                            </h2>
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="font-medium text-slate-600">Completeness</span>
                                        <span className="font-bold text-brand-indigo">85%</span>
                                    </div>
                                    <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                                        <div className="h-full bg-gradient-to-r from-brand-indigo to-brand-violet rounded-full w-[85%]" />
                                    </div>
                                </div>
                                <ul className="space-y-3">
                                    <li className="flex items-center gap-2 text-sm text-slate-500Line">
                                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                                        Verified Email
                                    </li>
                                    <li className="flex items-center gap-2 text-sm text-slate-500">
                                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                                        Bio Updated
                                    </li>
                                    <li className="flex items-center gap-2 text-sm text-slate-500">
                                        <div className="w-4 h-4 rounded-full border-2 border-slate-200" />
                                        Connect Instagram
                                    </li>
                                </ul>
                                <Button variant="secondary" className="w-full bg-slate-50 border-slate-100">
                                    Complete Profile
                                </Button>
                            </div>
                        </section>

                        <section className="bg-gradient-to-br from-brand-indigo to-brand-violet rounded-[32px] p-8 text-white shadow-xl shadow-indigo-100">
                            <h2 className="text-xl font-bold mb-2">Upgrade to Pro</h2>
                            <p className="text-indigo-100 text-sm mb-6 leading-relaxed">
                                Get 3x more applications and direct access to premium brands.
                            </p>
                            <Link href="/pricing" className="w-full">
                                <Button className="w-full bg-white text-brand-indigo hover:bg-indigo-50 border-none shadow-lg shadow-indigo-900/10">
                                    Explore Plans
                                </Button>
                            </Link>
                        </section>
                    </div>
                </div>
            </main>
        </div>
    );
}
