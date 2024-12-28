'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { addMovie } from '@/actions/actions'
import { Movie } from '@/lib/definitions'

export function AddMovieForm() {
  const { register, handleSubmit, formState: { errors } } = useForm<Movie>()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const onSubmit = async (data: Movie) => {
    setIsSubmitting(true)
    console.log(data)
    await addMovie(data)
    console.log("less go")
    setIsSubmitting(false)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input {...register('name', { required: 'Movie name is required' })} placeholder="Movie Name" />
      {errors.name && <p className="text-red-500">{errors.name.message}</p>}

      <Input {...register('year', { required: 'Year is required', min: 1900, max: new Date().getFullYear() })} type="number" placeholder="Year" />
      {errors.year && <p className="text-red-500">{errors.year.message}</p>}

      <Input {...register('bigImage', { required: 'Big image URL is required' })} placeholder="Big Image URL" />
      {errors.bigImage && <p className="text-red-500">{errors.bigImage.message}</p>}

      <Input {...register('smallImage', { required: 'Small image URL is required' })} placeholder="Small Image URL" />
      {errors.smallImage && <p className="text-red-500">{errors.smallImage.message}</p>}

      <Textarea {...register('description', { required: 'Description is required' })} placeholder="Description" />
      {errors.description && <p className="text-red-500">{errors.description.message}</p>}

      <Input {...register('genre', { required: 'genre is required' })} placeholder="genre" />
      {errors.smallImage && <p className="text-red-500">{errors.smallImage.message}</p>}

      <Input {...register('duration', { required: 'Duration is required', min: 1 })} type="number" placeholder="Duration (minutes)" />
      {errors.duration && <p className="text-red-500">{errors.duration.message}</p>}

      <Input {...register('imdbRating', { required: 'IMDB Rating is required', min: 0, max: 10, step: 0.1 })} type="number" step="0.1" placeholder="IMDB Rating" />
      {errors.imdbRating && <p className="text-red-500">{errors.imdbRating.message}</p>}

      <Input {...register('rottenTomatoesRating', { required: 'Rotten Tomatoes Rating is required', min: 0, max: 100 })} type="number" placeholder="Rotten Tomatoes Rating" />
      {errors.rottenTomatoesRating && <p className="text-red-500">{errors.rottenTomatoesRating.message}</p>}

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Adding Movie...' : 'Add Movie'}
      </Button>
    </form>
  )
}

