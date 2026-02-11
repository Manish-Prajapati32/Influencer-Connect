import Link from 'next/link';
import { ArrowRight, Users, MessageSquare, Briefcase, Zap, Star, ShieldCheck, Globe } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function HomePage() {
    return (
        <div className="min-h-screen bg-[#f8fafc] overflow-hidden">
            {/* Ambient Background Elements */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-brand-indigo/5 rounded-full blur-[120px]" />
                <div className="absolute bottom-[10%] right-[-5%] w-[30%] h-[30%] bg-brand-violet/5 rounded-full blur-[100px]" />
            </div>

            {/* Navigation (Landing specific) */}
            <nav className="relative z-50 max-w-7xl mx-auto px-6 py-8 flex items-center justify-between">
                <div className="flex items-center gap-2 group">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-indigo to-brand-violet flex items-center justify-center text-white font-bold text-xl shadow-lg">
                        I
                    </div>
                    <span className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-700 tracking-tighter">
                        Influencer Connect
                    </span>
                </div>
                <div className="flex items-center gap-6">
                    <Link href="/login" className="text-sm font-bold text-slate-600 hover:text-slate-900 transition-colors">Log in</Link>
                    <Link href="/signup">
                        <Button variant="primary" className="px-6 py-2.5 rounded-xl shadow-lg shadow-indigo-100">
                            Get Started
                        </Button>
                    </Link>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative pt-20 pb-32 px-6">
                <div className="container mx-auto max-w-6xl">
                    <div className="text-center space-y-8">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 border border-indigo-100 rounded-full text-brand-indigo text-xs font-black uppercase tracking-widest animate-in fade-in slide-in-from-bottom-4 duration-700">
                            <Zap className="w-3.5 h-3.5 fill-brand-indigo" />
                            The New Standard for Influence
                        </div>
                        <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-slate-900 tracking-tight leading-[0.95] animate-in fade-in slide-in-from-bottom-8 duration-1000">
                            Connect with <br />
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-brand-indigo to-brand-violet">Elite Talent</span>
                        </h1>
                        <p className="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed font-medium animate-in fade-in slide-in-from-bottom-12 duration-1200">
                            The globally recognized platform for high-impact collaborations between the world's most innovative brands and premium creators.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8 animate-in fade-in slide-in-from-bottom-16 duration-1500">
                            <Link href="/signup">
                                <Button size="lg" className="w-full sm:w-auto px-10 py-8 text-lg font-bold rounded-[22px] bg-slate-900 text-white hover:bg-slate-800 border-none shadow-2xl shadow-slate-200">
                                    Join the Network
                                    <ArrowRight className="w-5 h-5 ml-2" />
                                </Button>
                            </Link>
                            <Link href="/login">
                                <Button size="lg" variant="secondary" className="w-full sm:w-auto px-10 py-8 text-lg font-bold rounded-[22px] border-slate-200 bg-white hover:bg-slate-50 shadow-sm">
                                    Explore Campaigns
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features / Value Props */}
            <section className="relative py-24 px-6 bg-white border-t border-slate-100">
                <div className="container mx-auto max-w-7xl">
                    <div className="grid md:grid-cols-3 gap-12">
                        <div className="space-y-6 group">
                            <div className="w-16 h-16 bg-slate-50 rounded-[28px] flex items-center justify-center text-brand-indigo group-hover:bg-brand-indigo group-hover:text-white transition-all duration-300 shadow-sm group-hover:shadow-xl group-hover:shadow-indigo-100 group-hover:-translate-y-1">
                                <Globe className="w-8 h-8" />
                            </div>
                            <h3 className="text-2xl font-bold text-slate-900">Global Discovery</h3>
                            <p className="text-slate-500 leading-relaxed font-medium">Access a curated network of influencers across 120+ countries and every specialized niche imaginable.</p>
                        </div>

                        <div className="space-y-6 group">
                            <div className="w-16 h-16 bg-slate-50 rounded-[28px] flex items-center justify-center text-brand-violet group-hover:bg-brand-violet group-hover:text-white transition-all duration-300 shadow-sm group-hover:shadow-xl group-hover:shadow-violet-100 group-hover:-translate-y-1">
                                <ShieldCheck className="w-8 h-8" />
                            </div>
                            <h3 className="text-2xl font-bold text-slate-900">Secure Contracts</h3>
                            <p className="text-slate-500 leading-relaxed font-medium">Enterprise-grade security for messaging, talent verification, and automated project workflows.</p>
                        </div>

                        <div className="space-y-6 group">
                            <div className="w-16 h-16 bg-slate-50 rounded-[28px] flex items-center justify-center text-emerald-500 group-hover:bg-emerald-500 group-hover:text-white transition-all duration-300 shadow-sm group-hover:shadow-xl group-hover:shadow-emerald-100 group-hover:-translate-y-1">
                                <Zap className="w-8 h-8" />
                            </div>
                            <h3 className="text-2xl font-bold text-slate-900">Swift Scale</h3>
                            <p className="text-slate-500 leading-relaxed font-medium">Launch global campaigns in minutes. Manage everything from first contact to final delivery in one portal.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats / Proof */}
            <section className="py-20 px-6">
                <div className="container mx-auto max-w-7xl bg-slate-900 rounded-[48px] p-12 md:p-20 text-center relative overflow-hidden shadow-2xl">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-brand-violet/20 rounded-full blur-[100px]" />
                    <div className="relative z-10 grid md:grid-cols-3 gap-12 sm:gap-20">
                        <div className="space-y-2">
                            <p className="text-5xl font-black text-white">50k+</p>
                            <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Vetted Creators</p>
                        </div>
                        <div className="space-y-2">
                            <p className="text-5xl font-black text-brand-indigo">$25M+</p>
                            <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Campaign Volume</p>
                        </div>
                        <div className="space-y-2">
                            <p className="text-5xl font-black text-white">4.9/5</p>
                            <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Brand Satisfaction</p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

