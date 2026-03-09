"use client";
import { useState, useEffect } from 'react';
import { Bell, Info, CheckCircle, AlertTriangle, XCircle, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';

interface Notification {
    id: string;
    title: string;
    message: string;
    type: 'success' | 'info' | 'warning' | 'error';
    read: boolean;
    created_at: string;
}

const NotificationCenter = ({ userId }: { userId: string }) => {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);

    const fetchNotifications = async () => {
        try {
            const res = await fetch(`/api/notifications?userId=${userId}`);
            if (res.ok) {
                const data = await res.json();
                if (Array.isArray(data)) {
                    setNotifications(data);
                    setUnreadCount(data.filter((n: any) => !n.read).length);
                } else {
                    setNotifications([]);
                    setUnreadCount(0);
                }
            }
        } catch (e) {
            console.error(e);
        }
    };

    useEffect(() => {
        fetchNotifications();
        const interval = setInterval(fetchNotifications, 10000); // Poll every 10s
        return () => clearInterval(interval);
    }, [userId]);

    const markAllAsRead = async () => {
        try {
            const res = await fetch('/api/notifications', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId })
            });
            if (res.ok) {
                setNotifications(notifications.map(n => ({ ...n, read: true })));
                setUnreadCount(0);
            }
        } catch (e) {
            console.error(e);
        }
    };

    const IconMap = {
        success: <CheckCircle className="w-5 h-5 text-green-500" />,
        info: <Info className="w-5 h-5 text-blue-500" />,
        warning: <AlertTriangle className="w-5 h-5 text-amber-500" />,
        error: <XCircle className="w-5 h-5 text-red-500" />,
    };

    return (
        <DropdownMenu onOpenChange={(open) => open && unreadCount > 0 && markAllAsRead()}>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative group">
                    <Bell className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                    <AnimatePresence>
                        {unreadCount > 0 && (
                            <motion.span
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                exit={{ scale: 0 }}
                                className="absolute top-2 right-2 w-3 h-3 bg-red-500 border-2 border-background rounded-full"
                            />
                        )}
                    </AnimatePresence>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80 p-0 rounded-2xl overflow-hidden shadow-elevated border-border bg-card">
                <div className="p-4 bg-secondary/50 border-b border-border flex justify-between items-center">
                    <h3 className="font-bold text-foreground">Notifications</h3>
                    {unreadCount > 0 && (
                        <span className="text-[10px] bg-primary/20 text-primary px-2 py-0.5 rounded-full font-bold">
                            {unreadCount} NEW
                        </span>
                    )}
                </div>
                <div className="max-h-[400px] overflow-y-auto">
                    {notifications.length === 0 ? (
                        <div className="p-8 text-center text-muted-foreground">
                            <p className="text-sm">Stay tuned for updates!</p>
                        </div>
                    ) : (
                        notifications.map((n) => (
                            <DropdownMenuItem
                                key={n.id}
                                className={cn(
                                    "p-4 border-b border-border last:border-0 focus:bg-secondary/30 block cursor-default",
                                    !n.read && "bg-primary/5"
                                )}
                            >
                                <div className="flex gap-3">
                                    <div className="mt-0.5">{IconMap[n.type]}</div>
                                    <div className="flex-1">
                                        <p className={cn("text-sm font-semibold", !n.read && "text-primary")}>{n.title}</p>
                                        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{n.message}</p>
                                        <div className="flex items-center gap-1 mt-2 text-[10px] text-muted-foreground">
                                            <Clock className="w-3 h-3" />
                                            {formatDistanceToNow(new Date(n.created_at), { addSuffix: true })}
                                        </div>
                                    </div>
                                </div>
                            </DropdownMenuItem>
                        ))
                    )}
                </div>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default NotificationCenter;
