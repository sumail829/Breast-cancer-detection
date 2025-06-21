'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';

// Generate dummy data for predictions
const generatePredictionData = () => {
  const data = [];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
  
  for (const month of months) {
    const total = Math.floor(Math.random() * 20) + 10;
    const benign = Math.floor(Math.random() * total * 0.8);
    const malignant = total - benign;
    
    data.push({
      month,
      Benign: benign,
      Malignant: malignant,
    });
  }
  
  return data;
};

interface PredictionsChartProps {
  className?: string;
}

export default function DoctorPredictionsChart({ className }: PredictionsChartProps) {
  const [data, setData] = useState([]);
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setData(generatePredictionData());
  }, []);

  if (!mounted) {
    return null;
  }

  const isDark = theme === 'dark';

  return (
    <Card className={cn(className)}>
      <CardHeader>
        <CardTitle>Cancer Detection Results</CardTitle>
        <CardDescription>Distribution of breast cancer predictions over time</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
              <XAxis 
                dataKey="month" 
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
                allowDecimals={false}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: isDark ? 'hsl(var(--background))' : 'hsl(var(--background))',
                  borderColor: isDark ? 'hsl(var(--border))' : 'hsl(var(--border))',
                  color: isDark ? 'hsl(var(--foreground))' : 'hsl(var(--foreground))'
                }}
              />
              <Legend 
                wrapperStyle={{ 
                  color: isDark ? 'hsl(var(--foreground))' : 'hsl(var(--foreground))'
                }}
              />
              <Bar dataKey="Benign" stackId="a" fill="hsl(var(--chart-2))" />
              <Bar dataKey="Malignant" stackId="a" fill="hsl(var(--chart-1))" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}