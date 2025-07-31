'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '../ui/label';

interface FilterControlsProps {
  modalities: string[];
}

export function FilterControls({ modalities }: FilterControlsProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentModality = searchParams.get('modality') || 'all';

  const handleFilterChange = (modality: string) => {
    const params = new URLSearchParams(window.location.search);
    if (modality === 'all') {
      params.delete('modality');
    } else {
      params.set('modality', modality);
    }
    router.push(`?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8 p-4 bg-card rounded-lg shadow-sm border">
        <Label htmlFor="modality-filter" className="text-md font-semibold">Filtrar por Modalidade:</Label>
        <Select
            defaultValue={currentModality}
            onValueChange={handleFilterChange}
        >
            <SelectTrigger id="modality-filter" className="w-full sm:w-[280px] bg-background">
                <SelectValue placeholder="Selecione uma modalidade" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="all">Todas as Modalidades</SelectItem>
                {modalities.map((modality) => (
                    <SelectItem key={modality} value={modality}>
                        {modality}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    </div>
  );
}
