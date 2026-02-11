'use client';

import { useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { Loading } from '@/components/ui/Loading';

export default function ProfileRedirect() {
    const router = useRouter();
    const supabase = createClient();

    useEffect(() => {
        const getProfile = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                router.replace(`/profile/${user.id}`);
            } else {
                router.replace('/login');
            }
        };

        getProfile();
    }, []);

    return <Loading />;
}
