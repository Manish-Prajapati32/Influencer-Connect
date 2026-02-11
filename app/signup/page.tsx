'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Chrome } from 'lucide-react';

export default function SignupPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const supabase = createClient();

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        const { error: signUpError, data } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    full_name: fullName,
                },
            },
        });

        if (signUpError) {
            setError(signUpError.message);
            setIsLoading(false);
            return;
        }

        // Create profile
        if (data.user) {
            await supabase.from('profiles').insert({
                id: data.user.id,
                full_name: fullName,
                email: email,
                role: 'influencer',
            });
        }

        router.push('/dashboard');
        router.refresh();
    };

    const signUpWithGoogle = async () => {
        setIsLoading(true);
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: `${window.location.origin}/auth/callback`,
            },
        });
        if (error) {
            alert(error.message);
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] overflow-hidden relative">
            {/* Ambient Background Elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute -top-1/4 -right-1/4 w-1/2 h-1/2 bg-indigo-50/50 rounded-full blur-3xl animate-pulse" />
                <div className="absolute -bottom-1/4 -left-1/4 w-1/2 h-1/2 bg-violet-50/50 rounded-full blur-3xl animate-pulse delay-1000" />
            </div>

            <div className="relative w-full max-w-[480px] px-4 py-12">
                <div className="bg-white rounded-[32px] shadow-[0_20px_50px_rgba(0,0,0,0.04)] border border-slate-100 p-8 sm:p-10">
                    <div className="flex flex-col items-center mb-10">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-brand-indigo to-brand-violet flex items-center justify-center text-white font-bold text-2xl shadow-lg shadow-indigo-200 mb-4">
                            I
                        </div>
                        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                            Create your account
                        </h1>
                        <p className="text-slate-500 mt-2 text-[15px]">
                            Join the leading community of creators & brands
                        </p>
                    </div>

                    <form onSubmit={handleSignup} className="space-y-6">
                        <div className="space-y-4">
                            <Input
                                label="Full name"
                                type="text"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                placeholder="Manish Prajapati"
                                required
                            />

                            <Input
                                label="Email address"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="name@company.com"
                                required
                            />

                            <Input
                                label="Password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="at least 8 characters"
                                required
                                minLength={8}
                            />
                        </div>

                        {error && (
                            <div className="bg-red-50/50 border border-red-100 text-red-600 px-4 py-3 rounded-xl text-[13px] font-medium flex items-center gap-2 animate-in fade-in slide-in-from-top-1">
                                <span className="w-1 h-1 rounded-full bg-red-600" />
                                {error}
                            </div>
                        )}

                        <Button
                            type="submit"
                            variant="primary"
                            size="lg"
                            isLoading={isLoading}
                            className="w-full py-6 text-[15px] font-semibold tracking-wide"
                        >
                            Create free account
                        </Button>
                    </form>

                    <div className="relative my-8">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-slate-100" />
                        </div>
                        <div className="relative flex justify-center text-[12px] uppercase tracking-widest font-bold text-slate-400">
                            <span className="bg-white px-4">Or continue with</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                        <Button
                            variant="secondary"
                            onClick={signUpWithGoogle}
                            isLoading={isLoading}
                            className="w-full py-6 bg-white border-slate-200 hover:bg-slate-50 text-slate-700"
                        >
                            <Chrome className="w-5 h-5 text-slate-600" />
                            <span>Sign up with Google</span>
                        </Button>
                    </div>

                    <p className="text-center text-[14px] text-slate-500 mt-10">
                        Already have an account?{' '}
                        <Link href="/login" className="text-brand-indigo hover:text-brand-violet transition-colors font-semibold underline underline-offset-4 decoration-2 decoration-brand-indigo/20 hover:decoration-brand-violet/40">
                            Sign in instead
                        </Link>
                    </p>

                    <div className="mt-8 pt-8 border-t border-slate-50">
                        <p className="text-[12px] text-slate-400 text-center leading-relaxed">
                            By clicking "Create free account", you agree to our
                            <span className="text-slate-600 font-medium cursor-pointer"> Terms of Service</span> and
                            <span className="text-slate-600 font-medium cursor-pointer"> Privacy Policy</span>.
                        </p>
                    </div>
                </div>

                <div className="mt-8 flex justify-center items-center gap-6">
                    <div className="flex -space-x-2">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="w-6 h-6 rounded-full border-2 border-slate-50 bg-slate-200" />
                        ))}
                    </div>
                    <span className="text-[12px] text-slate-500 font-medium">Join 2,000+ top creators today</span>
                </div>
            </div>
        </div>
    );
}
