'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

const recentActivities = [
  {
    id: 1,
    user: {
      name: 'Dr. Emma Stone',
      avatar: 'ES',
      role: 'Cardiologist'
    },
    action: 'added a new patient record',
    timestamp: '5 minutes ago',
  },
  {
    id: 2,
    user: {
      name: 'Jacob Wilson',
      avatar: 'JW',
      role: 'Patient'
    },
    action: 'requested appointment cancellation',
    timestamp: '15 minutes ago',
  },
  {
    id: 3,
    user: {
      name: 'Dr. Alex Brown',
      avatar: 'AB',
      role: 'Oncologist'
    },
    action: 'submitted a new cancer prediction',
    timestamp: '30 minutes ago',
  },
  {
    id: 4,
    user: {
      name: 'Sophia Lee',
      avatar: 'SL',
      role: 'Nurse'
    },
    action: 'updated patient vital signs',
    timestamp: '45 minutes ago',
  },
  {
    id: 5,
    user: {
      name: 'Dr. David Johnson',
      avatar: 'DJ',
      role: 'Neurologist'
    },
    action: 'scheduled a surgery for patient #4182',
    timestamp: '1 hour ago',
  },
];

export default function AdminRecentActivity() {
  const [activities, setActivities] = useState(recentActivities);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>Latest activities across the hospital</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-start space-x-4">
            <Avatar className="h-9 w-9">
              <AvatarFallback className="bg-primary text-primary-foreground font-medium text-sm">
                {activity.user.avatar}
              </AvatarFallback>
            </Avatar>
            <div className="space-y-1">
              <p className="text-sm font-medium leading-none">
                {activity.user.name}
                <span className="ml-2 text-xs text-muted-foreground">
                  {activity.user.role}
                </span>
              </p>
              <p className="text-sm text-muted-foreground">{activity.action}</p>
              <p className="text-xs text-muted-foreground">{activity.timestamp}</p>
            </div>
          </div>
        ))}
      </CardContent>
      <CardFooter>
        <Button variant="ghost" size="sm" className="w-full">
          View all activity
        </Button>
      </CardFooter>
    </Card>
  );
}