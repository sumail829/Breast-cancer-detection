'use client';

import { useEffect, useState } from 'react';
import { 
  Area, 
  AreaChart, 
  ResponsiveContainer, 
  Tooltip, 
  XAxis, 
  YAxis 
} from 'recharts';
import { Card } from '@/components/ui/card';
import { useTheme } from 'next-themes';

// Dummy data
const generateData = () => {
  const days = 30;
  const currentDate = new Date();
  let data = [];

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date();
    date.setDate(currentDate.getDate() - i);

    data.push({
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      doctors: Math.floor(Math.random() * 30) + 20,
      patients: Math.floor(Math.random() * 150) + 100,
      staff: Math.floor(Math.random() * 50) + 30,
    });
  }

  return data;
};

export default function AdminActivityChart() {
  const [data, setData] = useState([]);
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setData(generateData());
  }, []);

  if (!mounted) {
    return null;
  }

  const isDark = theme === 'dark';

  return (
    <ResponsiveContainer width="100%" height={350}>
      <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="colorDoctors" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.8} />
            <stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="colorPatients" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="hsl(var(--chart-2))" stopOpacity={0.8} />
            <stop offset="95%" stopColor="hsl(var(--chart-2))" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="colorStaff" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="hsl(var(--chart-3))" stopOpacity={0.8} />
            <stop offset="95%" stopColor="hsl(var(--chart-3))" stopOpacity={0} />
          </linearGradient>
        </defs>
        <XAxis 
          dataKey="date" 
          stroke={isDark ? 'hsl(var(--muted-foreground))' : 'hsl(var(--muted-foreground))'} 
          tick={{ fill: isDark ? 'hsl(var(--muted-foreground))' : 'hsl(var(--muted-foreground))' }}
          tickLine={false}
          axisLine={false}
        />
        <YAxis 
          stroke={isDark ? 'hsl(var(--muted-foreground))' : 'hsl(var(--muted-foreground))'}
          tick={{ fill: isDark ? 'hsl(var(--muted-foreground))' : 'hsl(var(--muted-foreground))' }}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `${value}`}
        />
        <Tooltip 
          contentStyle={{ 
            backgroundColor: isDark ? 'hsl(var(--background))' : 'hsl(var(--background))',
            borderColor: isDark ? 'hsl(var(--border))' : 'hsl(var(--border))',
            color: isDark ? 'hsl(var(--foreground))' : 'hsl(var(--foreground))'
          }}
        />
        <Area 
          type="monotone" 
          dataKey="patients" 
          stroke="hsl(var(--chart-2))" 
          fillOpacity={1} 
          fill="url(#colorPatients)" 
        />
        <Area 
          type="monotone" 
          dataKey="doctors" 
          stroke="hsl(var(--chart-1))" 
          fillOpacity={1} 
          fill="url(#colorDoctors)" 
        />
        <Area 
          type="monotone" 
          dataKey="staff" 
          stroke="hsl(var(--chart-3))" 
          fillOpacity={1} 
          fill="url(#colorStaff)" 
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}