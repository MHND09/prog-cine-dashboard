'use client'

import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ShowtimesList } from '@/components/ShowtimesList'
import { AddShowtimeForm } from '@/components/AddShowtimeForm'
import { Showtime } from '@/lib/definitions'

export function ShowtimeTabs({scheduleList}:{scheduleList: Showtime[]}) {
  const [activeTab, setActiveTab] = useState('all-showtimes')
// TODO add scheduleList, theaterId, and movies props
  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList>
        <TabsTrigger value="all-showtimes">All Showtimes</TabsTrigger>
        <TabsTrigger value="add-showtime">Add Showtime</TabsTrigger>
      </TabsList>
      <TabsContent value="all-showtimes">
        <ShowtimesList showtimes={scheduleList}/>
      </TabsContent>
      <TabsContent value="add-showtime">
        <AddShowtimeForm />
      </TabsContent>
    </Tabs>
  )
}
