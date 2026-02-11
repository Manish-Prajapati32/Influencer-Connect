import Link from 'next/link';
import { Check, Zap, Star, Shield, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Navbar } from '@/components/ui/Navbar';

export default function PricingPage() {
    const plans = [
        {
            name: 'Creator',
            price: '0',
            description: 'Essential tools for rising influencers to build their presence.',
            features: [
                'Unlimited profile views',
                'Basic campaign applications',
                'standard messaging unit',
                'Portfolio hosting'
            ],
            cta: 'Start for Free',
            variant: 'secondary' as const,
        },
        {
            name: 'Professional',
            price: '29',
            description: 'Advanced features for serious creators ready to scale.',
            features: [
                'Priority campaign applications',
                'Direct brand messaging',
                'Advanced reach analytics',
                'Verified creator badge',
                '3x higher visibility'
            ],
            cta: 'Go Pro Now',
            variant: 'primary' as const,
            popular: true,
        },
        {
            name: 'Enterprise',
            price: '99',
            description: 'Full-scale solutions for agencies and multi-talent managers.',
            features: [
                'Agency dashboard',
                'Manage multiple talents',
                'Dedicated account manager',
                'Custom contract templates',
                'API access & webhooks'
            ],
            cta: 'Contact Sales',
            variant: 'secondary' as const,
        }
    ];

    return (
        <div className="min-h-screen bg-[#f8fafc]">
            <Navbar />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                <div className="text-center space-y-4 mb-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight leading-[1.1]">
                        Elevate Your <span className="bg-clip-text text-transparent bg-gradient-to-r from-brand-indigo to-brand-violet">Influence</span>
                    </h1>
                    <p className="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed font-medium">
                        Choose the perfect plan to accelerate your growth and unlock premium opportunities with world-class brands.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8 items-stretch">
                    {plans.map((plan, i) => (
                        <div
                            key={i}
                            className={`relative flex flex-col bg-white rounded-[40px] border border-slate-100 p-10 shadow-sm transition-all duration-300 hover:shadow-2xl hover:shadow-indigo-100/50 hover:-translate-y-2 group ${plan.popular ? 'border-brand-indigo scale-105 z-10 shadow-xl shadow-indigo-100' : ''}`}
                        >
                            {plan.popular && (
                                <div className="absolute top-0 right-10 -translate-y-1/2 px-4 py-1.5 bg-brand-indigo text-white text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg">
                                    Most Popular
                                </div>
                            )}

                            <div className="mb-8">
                                <h3 className="text-xl font-bold text-slate-900 mb-2">{plan.name}</h3>
                                <p className="text-slate-500 text-sm font-medium leading-relaxed">{plan.description}</p>
                            </div>

                            <div className="mb-8">
                                <span className="text-5xl font-black text-slate-900 tracking-tight">${plan.price}</span>
                                <span className="text-slate-400 font-bold text-sm tracking-wide">/mo</span>
                            </div>

                            <div className="space-y-4 mb-10 flex-1">
                                {plan.features.map((feature, j) => (
                                    <div key={j} className="flex items-center gap-3">
                                        <div className={`w-5 h-5 rounded-full flex items-center justify-center ${plan.popular ? 'bg-indigo-50 text-brand-indigo' : 'bg-slate-50 text-slate-400'}`}>
                                            <Check className="w-3 h-3" strokeWidth={3} />
                                        </div>
                                        <span className="text-slate-600 font-medium text-sm">{feature}</span>
                                    </div>
                                ))}
                            </div>

                            <Link href={plan.cta === 'Contact Sales' ? 'mailto:sales@influencerconnect.com' : '/signup'}>
                                <Button
                                    variant={plan.variant}
                                    className={`w-full py-7 text-lg font-bold rounded-2xl ${plan.popular ? 'bg-slate-900 hover:bg-slate-800 border-none' : ''}`}
                                >
                                    {plan.cta}
                                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                                </Button>
                            </Link>
                        </div>
                    ))}
                </div>

                <div className="mt-24 p-12 bg-slate-900 rounded-[48px] text-center relative overflow-hidden shadow-2xl animate-in fade-in slide-in-from-bottom-8 duration-1000">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-brand-violet/20 rounded-full blur-[100px]" />
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-brand-indigo/20 rounded-full blur-[100px]" />

                    <div className="relative z-10 space-y-6">
                        <h2 className="text-3xl font-bold text-white">Agency & Business Solutions</h2>
                        <p className="text-indigo-100 max-w-xl mx-auto font-medium">Looking for custom integration, volume pricing, or dedicated account management? Our enterprise team is ready to build a custom solution for your needs.</p>
                        <Button variant="secondary" className="px-10 py-6 text-lg font-bold rounded-2xl bg-white text-slate-900 border-none hover:bg-slate-100">
                            Book a Demo
                        </Button>
                    </div>
                </div>
            </main>
        </div>
    );
}
