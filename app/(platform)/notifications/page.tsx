'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Navbar } from '@/components/ui/Navbar';
import {
    Bell,
    MessageSquare,
    Briefcase,
    Zap,
    CheckCircle2,
    Clock,
    MoreHorizontal,
    Trash2
} from 'lucide-react';
import { timeAgo } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { Loading } from '@/components/ui/Loading';

interface Notification {
    id: string;
    user_id: string;
    title: string;
    message: string;
    type: string;
    created_at: string;
    is_read: boolean;
    reference_id?: string;
    reference_type?: string;
}

export default function NotificationsPage() {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [user, setUser] = useState<any>(null);
    const supabase = createClient();

    useEffect(() => {
        loadUserAndNotifications();

        // Subscribe to real-time notifications
        const channel = supabase
            .channel('realtime_notifications')
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'notifications',
                },
                (payload) => {
                    const newNotification = payload.new as Notification;
                    if (newNotification.user_id === user?.id) {
                        setNotifications(prev => [newNotification, ...prev]);
                    }
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [user?.id]);

    const loadUserAndNotifications = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        setUser(user);

        if (user) {
            const { data, error } = await supabase
                .from('notifications')
                .select('*')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false });

            if (!error && data) {
                setNotifications(data);
            }
        }
        setIsLoading(false);
    };

    const markAsRead = async (id: string) => {
        const { error } = await supabase
            .from('notifications')
            .update({ is_read: true })
            .eq('id', id);

        if (!error) {
            setNotifications(prev =>
                prev.map(n => n.id === id ? { ...n, is_read: true } : n)
            );
        }
    };

    const markAllAsRead = async () => {
        if (!user) return;
        const { error } = await supabase
            .from('notifications')
            .update({ is_read: true })
            .eq('user_id', user.id)
            .eq('is_read', false);

        if (!error) {
            setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
        }
    };

    const deleteNotification = async (id: string) => {
        const { error } = await supabase
            .from('notifications')
            .delete()
            .eq('id', id);

        if (!error) {
            setNotifications(prev => prev.filter(n => n.id !== id));
        }
    };

    const getIcon = (type: string) => {
        switch (type) {
            case 'campaign_invite':
            case 'campaign':
                return <Briefcase className="w-5 h-5" />;
            case 'message':
                return <MessageSquare className="w-5 h-5" />;
            case 'payment':
                return <Zap className="w-5 h-5" />;
            default:
                return <Bell className="w-5 h-5" />;
        }
    };

    if (isLoading) return <Loading />;

    return (
        <div className="min-h-screen bg-[#f8fafc]">
            <Navbar />

            <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <div className="flex items-center justify-between mb-10">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Activity Feed</h1>
                        <p className="text-slate-500 font-medium mt-1">Stay updated with your latest collaborations and messages.</p>
                    </div>
                    {notifications.some(n => !n.is_read) && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={markAllAsRead}
                            className="text-brand-indigo font-bold hover:bg-brand-indigo/5"
                        >
                            Mark all as read
                        </Button>
                    )}
                </div>

                <div className="space-y-4">
                    {notifications.length === 0 ? (
                        <div className="bg-white rounded-[32px] border border-slate-100 p-20 text-center shadow-sm">
                            <div className="w-20 h-20 bg-slate-50 rounded-[28px] flex items-center justify-center text-slate-300 mx-auto mb-6">
                                <Bell className="w-10 h-10" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-2">Queue is clear</h3>
                            <p className="text-slate-500 font-medium">No new notifications at the moment. We'll let you know when something happens!</p>
                        </div>
                    ) : (
                        notifications.map((notification) => (
                            <div
                                key={notification.id}
                                className={`group relative bg-white rounded-[24px] border border-slate-100 p-6 transition-all duration-300 hover:shadow-md hover:shadow-indigo-100/30 flex items-start gap-5 ${!notification.is_read ? 'border-l-4 border-l-brand-indigo shadow-sm' : ''}`}
                            >
                                <div className={`shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center ${!notification.is_read
                                    ? 'bg-brand-indigo/10 text-brand-indigo'
                                    : 'bg-slate-50 text-slate-400'
                                    }`}>
                                    {getIcon(notification.type)}
                                </div>

                                <div className="flex-1 space-y-1">
                                    <div className="flex items-center justify-between">
                                        <h4 className={`font-bold transition-colors ${!notification.is_read ? 'text-slate-900' : 'text-slate-600'}`}>
                                            {notification.title}
                                        </h4>
                                        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                                            <Clock className="w-3 h-3" />
                                            {timeAgo(notification.created_at)}
                                        </span>
                                    </div>
                                    <p className={`text-[15px] leading-relaxed font-medium ${!notification.is_read ? 'text-slate-600' : 'text-slate-400'}`}>
                                        {notification.message}
                                    </p>
                                </div>

                                <div className="flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    {!notification.is_read && (
                                        <button
                                            onClick={() => markAsRead(notification.id)}
                                            className="p-2 hover:bg-emerald-50 text-emerald-600 rounded-lg transition-colors"
                                            title="Mark as read"
                                        >
                                            <CheckCircle2 className="w-4 h-4" />
                                        </button>
                                    )}
                                    <button
                                        onClick={() => deleteNotification(notification.id)}
                                        className="p-2 hover:bg-red-50 text-red-600 rounded-lg transition-colors"
                                        title="Delete"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </main>
        </div>
    );
}
