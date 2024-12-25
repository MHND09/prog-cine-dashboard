'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'

type ShowtimeFormData = {
  movieId: string
  date: string
  time: string
}

// This would typically come from your backend
const mockMovies = [
  { id: '1', name: 'Inception' },
  { id: '2', name: 'The Dark Knight' },
  { id: '3', name: 'Interstellar' },
]

export function AddShowtimeForm() {
  const { register, handleSubmit, formState: { errors } } = useForm<ShowtimeFormData>()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const onSubmit = async (data: ShowtimeFormData) => {
    setIsSubmitting(true)
    // Here you would typically send this data to your backend
    console.log(data)
    // Simulate an API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    setIsSubmitting(false)
    // Reset form or show success message
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Select onValueChange={(value) => register('movieId').onChange({ target: { value } })}>
        <SelectTrigger>
          <SelectValue placeholder="Select movie" />
        </SelectTrigger>
        <SelectContent>
          {mockMovies.map(movie => (
            <SelectItem key={movie.id} value={movie.id}>{movie.name}</SelectItem>
          ))}
        </SelectContent>
      </Select>
      {errors.movieId && <p className="text-red-500">{errors.movieId.message}</p>}

      <Input {...register('date', { required: 'Date is required' })} type="date" />
      {errors.date && <p className="text-red-500">{errors.date.message}</p>}

      <Input {...register('time', { required: 'Time is required' })} type="time" />
      {errors.time && <p className="text-red-500">{errors.time.message}</p>}

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Adding Showtime...' : 'Add Showtime'}
      </Button>
    </form>
  )
}

