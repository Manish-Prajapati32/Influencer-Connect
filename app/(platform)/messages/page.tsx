'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/ui/Navbar';
import { Send, Loader2, MessageSquare, Search, Plus } from 'lucide-react';
import { timeAgo, generateAvatar } from '@/lib/utils';
import { Button } from '@/components/ui/Button';

interface Message {
    id: string;
    conversation_id: string;
    sender_id: string;
    content: string;
    created_at: string;
    sender?: {
        full_name: string;
    };
}

interface Conversation {
    id: string;
    participant1_id: string;
    participant2_id: string;
    created_at: string;
    participant1?: { full_name: string };
    participant2?: { full_name: string };
}

export default function MessagesPage() {
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [messages, setMessages] = useState<Message[]>([]);
    const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
    const [newMessage, setNewMessage] = useState('');
    const [user, setUser] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSending, setIsSending] = useState(false);

    const router = useRouter();
    const supabase = createClient();

    // Load user and conversations
    useEffect(() => {
        loadUser();
    }, []);

    const loadUser = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            router.push('/login');
            return;
        }
        setUser(user);
        await loadConversations(user.id);
    };

    const loadConversations = async (userId: string) => {
        const { data, error } = await supabase
            .from('conversations')
            .select(`
        *,
        participant1:profiles!participant1_id(full_name),
        participant2:profiles!participant2_id(full_name)
      `)
            .or(`participant1_id.eq.${userId},participant2_id.eq.${userId}`)
            .order('created_at', { ascending: false });

        if (!error && data) {
            setConversations(data);
            if (data.length > 0) {
                setSelectedConversation(data[0].id);
            }
        }
        setIsLoading(false);
    };

    // Load messages when conversation selected
    useEffect(() => {
        if (selectedConversation) {
            loadMessages();
            subscribeToMessages();
        }
    }, [selectedConversation]);

    const loadMessages = async () => {
        if (!selectedConversation) return;

        const { data, error } = await supabase
            .from('messages')
            .select(`
        *,
        sender:profiles!sender_id(full_name)
      `)
            .eq('conversation_id', selectedConversation)
            .order('created_at', { ascending: true });

        if (!error && data) {
            setMessages(data);
        }
    };

    const subscribeToMessages = () => {
        if (!selectedConversation) return;

        const channelName = `conversation-${selectedConversation}-${Date.now()}`;

        const channel = supabase
            .channel(channelName)
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'messages',
                    filter: `conversation_id=eq.${selectedConversation}`,
                },
                (payload) => {
                    const newMsg = payload.new as Message;
                    setMessages((prev) => {
                        const exists = prev.some((m) => m.id === newMsg.id);
                        if (exists) return prev;
                        return [...prev, newMsg];
                    });
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    };

    const sendMessage = async () => {
        if (!newMessage.trim() || !selectedConversation || !user) return;

        setIsSending(true);
        const messageContent = newMessage.trim();
        const tempId = `temp-${Date.now()}`;

        // Optimistic UI update
        const optimisticMessage: Message = {
            id: tempId,
            conversation_id: selectedConversation,
            sender_id: user.id,
            content: messageContent,
            created_at: new Date().toISOString(),
        };

        setMessages((prev) => [...prev, optimisticMessage]);
        setNewMessage('');

        // Send to database
        const { error } = await supabase.from('messages').insert({
            conversation_id: selectedConversation,
            sender_id: user.id,
            content: messageContent,
        });

        if (error) {
            // Remove optimistic message on error
            setMessages((prev) => prev.filter((m) => m.id !== tempId));
            alert('Failed to send message');
        }

        setIsSending(false);
    };

    const getConversationName = (conv: Conversation) => {
        if (!user) return 'Unknown';
        const otherParticipant =
            conv.participant1_id === user.id ? conv.participant2 : conv.participant1;
        return otherParticipant?.full_name || 'Unknown User';
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Navbar />
                <div className="flex items-center justify-center h-96">
                    <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#f8fafc] flex flex-col">
            <Navbar />

            <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 overflow-hidden">
                <div className="bg-white rounded-[32px] border border-slate-100 shadow-[0_20px_50px_rgba(0,0,0,0.03)] flex overflow-hidden h-[calc(100vh-180px)] min-h-[600px]">

                    {/* Conversations Sidebar */}
                    <div className="w-full md:w-[350px] border-r border-slate-50 flex flex-col bg-slate-50/30">
                        <div className="p-6 border-b border-slate-50">
                            <h2 className="text-xl font-bold text-slate-900">Messages</h2>
                            <div className="relative mt-4">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <input
                                    type="text"
                                    placeholder="Search chats..."
                                    className="w-full pl-10 pr-4 py-2 bg-white border border-slate-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-indigo/10 transition-all"
                                />
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto custom-scrollbar">
                            {conversations.length === 0 ? (
                                <div className="p-10 text-center">
                                    <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <MessageSquare className="w-6 h-6 text-slate-300" />
                                    </div>
                                    <p className="text-slate-500 text-sm">No conversations yet</p>
                                </div>
                            ) : (
                                conversations.map((conv) => (
                                    <div
                                        key={conv.id}
                                        onClick={() => setSelectedConversation(conv.id)}
                                        className={`p-4 mx-2 my-1 rounded-2xl cursor-pointer transition-all duration-200 group ${selectedConversation === conv.id
                                            ? 'bg-white shadow-sm border border-slate-100'
                                            : 'hover:bg-white/50'
                                            }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="relative">
                                                <img
                                                    src={generateAvatar(getConversationName(conv))}
                                                    className="w-12 h-12 rounded-xl border border-slate-100"
                                                    alt=""
                                                />
                                                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex justify-between items-start">
                                                    <h3 className={`font-bold text-sm truncate ${selectedConversation === conv.id ? 'text-brand-indigo' : 'text-slate-900'}`}>
                                                        {getConversationName(conv)}
                                                    </h3>
                                                    <span className="text-[10px] font-medium text-slate-400 ml-2 whitespace-nowrap">
                                                        {timeAgo(conv.created_at)}
                                                    </span>
                                                </div>
                                                <p className="text-xs text-slate-500 truncate mt-0.5 font-medium">
                                                    Click to view messages
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Chat Area */}
                    <div className="flex-1 flex flex-col bg-white">
                        {selectedConversation ? (
                            <>
                                {/* Chat Header */}
                                <div className="p-6 border-b border-slate-50 flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center font-bold text-brand-indigo">
                                            {getConversationName(conversations.find(c => c.id === selectedConversation)!).charAt(0)}
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-slate-900">
                                                {getConversationName(conversations.find(c => c.id === selectedConversation)!)}
                                            </h3>
                                            <p className="text-[12px] text-emerald-500 font-bold flex items-center gap-1">
                                                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                                                Online
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Button variant="ghost" size="sm" className="w-10 h-10 p-0 rounded-xl">
                                            <Plus className="w-5 h-5 text-slate-400" />
                                        </Button>
                                    </div>
                                </div>

                                {/* Messages list */}
                                <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar bg-slate-50/20">
                                    {messages.length === 0 ? (
                                        <div className="h-full flex flex-col items-center justify-center text-center p-10">
                                            <div className="w-16 h-16 bg-indigo-50 rounded-full flex items-center justify-center mb-4">
                                                <MessageSquare className="w-8 h-8 text-brand-indigo" />
                                            </div>
                                            <h4 className="text-lg font-bold text-slate-900">No messages here</h4>
                                            <p className="text-slate-500 text-sm mt-1">Start the conversation by typing below</p>
                                        </div>
                                    ) : (
                                        messages.map((msg, i) => {
                                            const isMe = msg.sender_id === user?.id;
                                            return (
                                                <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2`}>
                                                    <div className={`max-w-[70%] group`}>
                                                        {!isMe && (
                                                            <span className="text-[10px] font-bold text-slate-400 ml-1 mb-1 block uppercase tracking-wider">
                                                                {msg.sender?.full_name || 'User'}
                                                            </span>
                                                        )}
                                                        <div className={`px-5 py-3.5 rounded-[22px] text-[14px] leading-relaxed relative ${isMe
                                                            ? 'bg-slate-900 text-white rounded-br-none shadow-lg shadow-slate-100'
                                                            : 'bg-white border border-slate-100 text-slate-900 rounded-bl-none'
                                                            }`}>
                                                            {msg.content}
                                                            <div className={`text-[10px] mt-2 font-medium ${isMe ? 'text-slate-400' : 'text-slate-400'}`}>
                                                                {timeAgo(msg.created_at)}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })
                                    )}
                                </div>

                                {/* Message Input */}
                                <div className="p-6 border-t border-slate-50 bg-white">
                                    <form
                                        onSubmit={(e) => { e.preventDefault(); sendMessage(); }}
                                        className="flex items-center gap-3 bg-slate-50 p-2 rounded-[24px] border border-slate-100 focus-within:border-brand-indigo focus-within:bg-white focus-within:ring-4 focus-within:ring-brand-indigo/5 transition-all"
                                    >
                                        <input
                                            type="text"
                                            value={newMessage}
                                            onChange={(e) => setNewMessage(e.target.value)}
                                            placeholder="Message..."
                                            className="flex-1 bg-transparent border-none focus:ring-0 px-4 py-2 text-slate-900 placeholder:text-slate-400 font-medium"
                                            disabled={isSending}
                                        />
                                        <button
                                            type="submit"
                                            disabled={isSending || !newMessage.trim()}
                                            className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${newMessage.trim()
                                                ? 'bg-brand-indigo text-white shadow-lg shadow-indigo-200 hover:scale-105 active:scale-95'
                                                : 'bg-slate-200 text-slate-400'
                                                }`}
                                        >
                                            {isSending ? (
                                                <Loader2 className="w-5 h-5 animate-spin" />
                                            ) : (
                                                <Send className="w-5 h-5" />
                                            )}
                                        </button>
                                    </form>
                                </div>
                            </>
                        ) : (
                            <div className="flex-1 flex flex-col items-center justify-center text-center p-10">
                                <div className="w-24 h-24 bg-indigo-50 rounded-[32px] flex items-center justify-center mb-6">
                                    <MessageSquare className="w-10 h-10 text-brand-indigo" />
                                </div>
                                <h3 className="text-2xl font-bold text-slate-900">Your Conversations</h3>
                                <p className="text-slate-500 max-w-xs mx-auto mt-2 font-medium">
                                    Select a person from the sidebar to view your message history or start a new chat.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}
