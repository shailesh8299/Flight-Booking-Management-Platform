"use client";
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
;

export const useAdminCheck = () => {
  const { user, loading: authLoading, isAdmin: authIsAdmin } = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading) {
      setLoading(false);
    }
  }, [authLoading]);

  return { isAdmin: authIsAdmin, loading: authLoading || loading, user };
};
