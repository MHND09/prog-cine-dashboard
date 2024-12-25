'use client'

import { useState, useEffect } from 'react'
import { format, parseISO, startOfWeek, endOfWeek, addWeeks, isSameDay } from 'date-fns'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

// Mock data for showtimes (in a real application, this would come from an API)
const mockShowtimes = [
  { id: 1, movieId: 1, movieTitle: 'Inception', datetime: '2024-12-25T18:00:00' },
  { id: 2, movieId: 1, movieTitle: 'Inception', datetime: '2024-12-25T21:00:00' },
  { id: 3, movieId: 2, movieTitle: 'The Dark Knight', datetime: '2024-12-26T19:00:00' },
  { id: 4, movieId: 3, movieTitle: 'Interstellar', datetime: '2024-12-27T20:00:00' },
  { id: 5, movieId: 2, movieTitle: 'The Dark Knight', datetime: '2024-12-28T18:30:00' },
  { id: 6, movieId: 1, movieTitle: 'Inception', datetime: '2024-12-29T17:00:00' },
  { id: 7, movieId: 3, movieTitle: 'Interstellar', datetime: '2024-12-30T19:30:00' },
  { id: 8, movieId: 2, movieTitle: 'The Dark Knight', datetime: '2024-12-31T20:00:00' },
  { id: 9, movieId: 1, movieTitle: 'Inception', datetime: '2025-01-01T18:00:00' },
  { id: 10, movieId: 3, movieTitle: 'Interstellar', datetime: '2025-01-02T21:00:00' },
]

type GroupedShowtimes = {
  [date: string]: Array<{
    id: number
    movieId: number
    movieTitle: string
    datetime: string
  }>
}

const groupShowtimesByDay = (showtimes: typeof mockShowtimes, startDate: Date, endDate: Date): GroupedShowtimes => {
  return showtimes.reduce((acc, showtime) => {
    const date = parseISO(showtime.datetime)
    if (date >= startDate && date <= endDate) {
      const dayKey = format(date, 'yyyy-MM-dd')
      if (!acc[dayKey]) {
        acc[dayKey] = []
      }
      acc[dayKey].push(showtime)
    }
    return acc
  }, {} as GroupedShowtimes)
}

export function ShowtimesList() {
  const [thisWeekShowtimes, setThisWeekShowtimes] = useState<GroupedShowtimes>({})
  const [nextWeekShowtimes, setNextWeekShowtimes] = useState<GroupedShowtimes>({})

  useEffect(() => {
    const now = new Date('2024-12-25')
    const thisWeekStart = startOfWeek(now)
    const thisWeekEnd = endOfWeek(now)
    const nextWeekStart = addWeeks(thisWeekStart, 1)
    const nextWeekEnd = endOfWeek(nextWeekStart)

    setThisWeekShowtimes(groupShowtimesByDay(mockShowtimes, thisWeekStart, thisWeekEnd))
    setNextWeekShowtimes(groupShowtimesByDay(mockShowtimes, nextWeekStart, nextWeekEnd))
  }, [])

  const renderShowtimes = (groupedShowtimes: GroupedShowtimes) => {
    if (Object.keys(groupedShowtimes).length === 0) {
      return <p className="text-center text-gray-500">No showtimes available for this week.</p>
    }

    return Object.entries(groupedShowtimes).map(([date, showtimes]) => (
      <Card key={date} className="mb-6">
        <CardHeader>
          <CardTitle>{format(parseISO(date), 'EEEE, MMMM d')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {showtimes.map((showtime) => (
              <div key={showtime.id} className="flex justify-between items-center">
                <span className="font-medium">{showtime.movieTitle}</span>
                <span>{format(parseISO(showtime.datetime), 'h:mm a')}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    ))
  }

  return (
    <Tabs defaultValue="this-week" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="this-week">This Week</TabsTrigger>
        <TabsTrigger value="next-week">Next Week</TabsTrigger>
      </TabsList>
      <TabsContent value="this-week" className="mt-6">
        {renderShowtimes(thisWeekShowtimes)}
      </TabsContent>
      <TabsContent value="next-week" className="mt-6">
        {renderShowtimes(nextWeekShowtimes)}
      </TabsContent>
    </Tabs>
  )
}

