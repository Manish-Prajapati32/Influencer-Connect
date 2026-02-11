'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface SendMessageButtonProps {
    recipientId: string;
    variant?: 'primary' | 'secondary' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
    className?: string;
}

export function SendMessageButton({
    recipientId,
    variant = 'primary',
    size = 'md',
    className,
}: SendMessageButtonProps) {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const supabase = createClient();

    const handleClick = async () => {
        setIsLoading(true);

        // Check if user is logged in
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            router.push('/login');
            return;
        }

        try {
            // Check if conversation exists
            const { data: existingConversation } = await supabase
                .from('conversations')
                .select('id')
                .or(`and(participant1_id.eq.${user.id},participant2_id.eq.${recipientId}),and(participant1_id.eq.${recipientId},participant2_id.eq.${user.id})`)
                .single();

            if (existingConversation) {
                router.push(`/messages?conversation=${existingConversation.id}`);
            } else {
                // Create new conversation
                const { data: newConversation } = await supabase
                    .from('conversations')
                    .insert({
                        participant1_id: user.id,
                        participant2_id: recipientId,
                    })
                    .select()
                    .single();

                if (newConversation) {
                    router.push(`/messages?conversation=${newConversation.id}`);
                }
            }
        } catch (error) {
            console.error('Error creating/finding conversation:', error);
            alert('Failed to start conversation. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Button
            variant={variant}
            size={size}
            onClick={handleClick}
            isLoading={isLoading}
            className={className}
        >
            <MessageSquare className="w-4 h-4 mr-2" />
            Message
        </Button>
    );
}
