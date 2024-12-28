'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ShowtimesList } from '@/components/ShowtimesList'
import { AddShowtimeForm } from '@/components/AddShowtimeForm'
import { EditShowtimeForm } from '@/components/EditShowtimeForm'
import { Showtime } from '@/lib/definitions'

export function ShowtimeTabs({scheduleList, theaterId}:{scheduleList: Showtime[], theaterId: string}) {
  const [activeTab, setActiveTab] = useState('all-showtimes')
  const searchParams = useSearchParams();
  const editShowtimeId = searchParams.get('edit')
  useEffect(() => {
    if (editShowtimeId) {
      setActiveTab('edit-showtime')
    }
  }, [editShowtimeId])
  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList>
        <TabsTrigger value="all-showtimes">All Showtimes</TabsTrigger>
        <TabsTrigger value="add-showtime">Add Showtime</TabsTrigger>
        {editShowtimeId && <TabsTrigger value="edit-showtime">Edit Showtime</TabsTrigger>}
      </TabsList>
      <TabsContent value="all-showtimes">
        <ShowtimesList showtimes={scheduleList}/>
      </TabsContent>
      <TabsContent value="add-showtime">
        <AddShowtimeForm theaterId={theaterId}/>
      </TabsContent>
      {editShowtimeId && (
        <TabsContent value="edit-showtime">
          <EditShowtimeForm showtimeId={editShowtimeId} />
        </TabsContent>
      )}
    </Tabs>
  )
}
