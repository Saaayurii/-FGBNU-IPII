"use client";

import dynamic from 'next/dynamic';

const LeafletMap = dynamic(
    () => import('./LeafletMap').then(mod => ({ default: mod.LeafletMap })),
    { 
        ssr: false,
        loading: () => <div className="flex items-center justify-center h-full bg-gray-100 rounded-lg">
            <div className="text-gray-500">Загрузка карты...</div>
        </div>
    }
);

interface MapWrapperProps {
    className?: string;
}

export function MapWrapper({ className }: MapWrapperProps) {
    return <LeafletMap className={className} />;
}