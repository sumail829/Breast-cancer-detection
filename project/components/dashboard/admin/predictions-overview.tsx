'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { useTheme } from 'next-themes';

// Dummy data
const predictionStats = [
  { name: 'Benign', value: 64, color: 'hsl(var(--chart-2))' },
  { name: 'Malignant', value: 21, color: 'hsl(var(--chart-1))' },
  { name: 'Pending', value: 15, color: 'hsl(var(--chart-4))' },
];

export default function AdminPredictionsOverview() {
  const [data, setData] = useState(predictionStats);
  const { theme } = useTheme();
  
  const isDark = theme === 'dark';
  const textColor = isDark ? 'hsl(var(--foreground))' : 'hsl(var(--foreground))';

  return (
    <Card>
      <CardHeader>
        <CardTitle>Breast Cancer Predictions</CardTitle>
        <CardDescription>Monthly prediction results overview</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[240px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={2}
                dataKey="value"
                label
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: isDark ? 'hsl(var(--background))' : 'hsl(var(--background))',
                  borderColor: isDark ? 'hsl(var(--border))' : 'hsl(var(--border))',
                  color: textColor,
                }}
                formatter={(value, name) => [`${value} cases`, name]}
              />
              <Legend
                verticalAlign="bottom"
                height={36}
                formatter={(value) => <span style={{ color: textColor }}>{value}</span>}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="grid grid-cols-3 gap-2 mt-4 text-center">
          <div>
            <p className="text-xs text-muted-foreground">Total Tests</p>
            <p className="text-xl font-bold">{data.reduce((acc, item) => acc + item.value, 0)}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Detection Rate</p>
            <p className="text-xl font-bold">98.2%</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Avg. Time</p>
            <p className="text-xl font-bold">4h</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}