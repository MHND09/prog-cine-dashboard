'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/navigation'
import { Movie } from '@/lib/definitions'
import { updateMovie } from '@/actions/actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

type EditMovieFormProps = {
  movieId: string
  movie: Movie
}

export function EditMovieForm({ movieId, movie }: EditMovieFormProps) {
  const { register, handleSubmit, formState: { errors } } = useForm<Movie>({
    defaultValues: movie
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()

  const onSubmit = async (data: Movie) => {
    setIsSubmitting(true)
    await updateMovie(movieId, data)
    setIsSubmitting(false)
    router.push('/movies')
  }

  const handleCancel = () => {
    router.push('/movies')
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

            <Input {...register('imdbRating', { required: 'IMDB Rating is required', min: 0, max: 10 })} type="number" step="0.1" placeholder="IMDB Rating" />
            {errors.imdbRating && <p className="text-red-500">{errors.imdbRating.message}</p>}

            <Input {...register('rottenTomatoesRating', { required: 'Rotten Tomatoes Rating is required', min: 0, max: 100 })} type="number" placeholder="Rotten Tomatoes Rating" />
            {errors.rottenTomatoesRating && <p className="text-red-500">{errors.rottenTomatoesRating.message}</p>}

            <div className="flex justify-between">
                <Button type="button" variant="outline" onClick={handleCancel}>
                    Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? 'Saving Changes...' : 'Save Changes'}
                </Button>
            </div>
        </form>
  )
}