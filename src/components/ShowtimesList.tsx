"use client"
import { format, startOfWeek, endOfWeek, addWeeks } from 'date-fns'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Pencil, Trash2 } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { deleteShowtime } from '@/actions/actions'
import { Toaster } from "@/components/ui/toaster"
import { useToast } from '@/hooks/use-toast'




interface Showtime {
	id: string
	date: Date
	movieId: string
	startTime: Date
	theaterId: string
	movieTitle: string
}

type GroupedShowtimes = {
	[date: string]: Showtime[]
}


const groupShowtimesByDay = (showtimes: Showtime[], startDate: Date, endDate: Date): GroupedShowtimes => {
	return showtimes.reduce((acc, showtime) => {
		const date = showtime.startTime
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

export function ShowtimesList({ showtimes }: { showtimes: Showtime[] }) {
	const { toast } = useToast()
	const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
	const [showtimeToDelete, setShowtimeToDelete] = useState<Showtime | null>(null)
	const now = new Date()
	const thisWeekStart = startOfWeek(now)
	const thisWeekEnd = endOfWeek(now)
	const nextWeekStart = addWeeks(thisWeekStart, 1)
	const nextWeekEnd = endOfWeek(nextWeekStart)
	const thisWeekShowtimes = groupShowtimesByDay(showtimes, thisWeekStart, thisWeekEnd)
	const nextWeekShowtimes = groupShowtimesByDay(showtimes, nextWeekStart, nextWeekEnd)
	const handleDeleteClick = (showtime: Showtime) => {
		setShowtimeToDelete(showtime)
		setIsDeleteDialogOpen(true)
	}

	const handleDeleteConfirm = async () => {
		if (showtimeToDelete) {
			const { error } = await deleteShowtime(showtimeToDelete.id)
			if (error) {
				toast({
					title: "delete failed",
					description: "An error occurred while deleting the showtime. ",
				})
			}
			else {
				toast({
					title: "delete succed",
					description: "schedule deleted successfuly",
				})
			}
			setIsDeleteDialogOpen(false)
			setShowtimeToDelete(null)
		}
	}


	const renderShowtimes = (groupedShowtimes: GroupedShowtimes) => {
		if (Object.keys(groupedShowtimes).length === 0) {
			return <p className="text-center text-gray-500">No showtimes available for this week.</p>
		}

		return Object.entries(groupedShowtimes).map(([date, showtimes]) => (
			<Card key={date} className="mb-6">
				<CardHeader>
					<CardTitle>{format(showtimes[0].date, 'EEEE, MMMM d')}</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="space-y-2">
						{showtimes.map((showtime) => (
							<div key={`${showtime.id}`} className="flex justify-between items-center">
								<span className="font-medium">{showtime.movieTitle}</span>
								<div className="flex items-center space-x-2">
									<span>{format(showtime.startTime, 'h:mm a')}</span>
									<a href={`/showtimes?edit=${showtime.id}`}>
										<Button variant="ghost" size="icon">
											<Pencil className="h-4 w-4" />
										</Button>
									</a>
									<Button variant="ghost" size="icon" onClick={() => handleDeleteClick(showtime)}>
										<Trash2 className="h-4 w-4" />
									</Button>
								</div>
							</div>
						))}
					</div>
				</CardContent>
			</Card>
		))
	}

	return (
		<>
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
			<AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Are you sure you want to delete this showtime?</AlertDialogTitle>
						<AlertDialogDescription>
							This action cannot be undone. This will permanently delete the showtime.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>Cancel</AlertDialogCancel>
						<AlertDialogAction className='bg-red-500 text-white'
							onClick={handleDeleteConfirm} >Delete</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
			<Toaster />
		</>
	)
}

