"use client";

import { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, CheckCircle, Loader } from 'lucide-react';

export function DatabaseStatus() {
  const [status, setStatus] = useState<'checking' | 'connected' | 'error'>('checking');
  const [error, setError] = useState<string>('');

  useEffect(() => {
    checkDatabaseConnection();
  }, []);

  const checkDatabaseConnection = async () => {
    try {
      const response = await fetch('/api/health/database', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      
      if (response.ok) {
        setStatus('connected');
        setError('');
      } else {
        const errorData = await response.json();
        setStatus('error');
        setError(errorData.error || 'Database connection failed');
      }
    } catch (error: any) {
      setStatus('error');
      setError(error.message || 'Database connection failed');
    }
  };

  if (status === 'checking') {
    return (
      <Badge variant="outline" className="text-yellow-600 border-yellow-200">
        <Loader className="w-3 h-3 mr-1 animate-spin" />
        Проверка БД...
      </Badge>
    );
  }

  if (status === 'connected') {
    return (
      <Badge variant="outline" className="text-green-600 border-green-200">
        <CheckCircle className="w-3 h-3 mr-1" />
        БД подключена
      </Badge>
    );
  }

  return (
    <Badge 
      variant="outline" 
      className="text-red-600 border-red-200 cursor-pointer" 
      onClick={checkDatabaseConnection}
      title={error}
    >
      <AlertCircle className="w-3 h-3 mr-1" />
      Ошибка БД
    </Badge>
  );
}