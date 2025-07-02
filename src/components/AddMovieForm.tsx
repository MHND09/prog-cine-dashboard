"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import { addMovie } from "@/actions/actions"
import { Movie } from "@/lib/definitions"

export function AddMovieForm({ initialData }: { initialData?: Movie }) {
  const defaultValues = initialData ? { ...initialData } : {};
  const { register, handleSubmit,reset, formState: { errors } } = useForm<Movie>({
    defaultValues:{
      ...initialData
    }
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const onSubmit = async (data: Movie) => {
    setIsSubmitting(true)
    setSuccessMessage(null)
    setErrorMessage(null)
      const {error} =  await addMovie(data)
      if (error) {
        setErrorMessage("An error occurred while adding the movie. Please try again. If the problem persists, contact support.")
      }
      else{
        setSuccessMessage("Movie added successfully")
        reset()
      } 
      setIsSubmitting(false)
  }

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input {...register("name", { required: "Movie name is required" })} placeholder="Movie Name" />
        {errors.name && <p className="text-red-500">{errors.name.message}</p>}

        <Input {...register("year", { required: "Year is required", min: 1900, max: new Date().getFullYear() })} type="number" placeholder="Year" />
        {errors.year && <p className="text-red-500">{errors.year.message}</p>}

        <Input {...register("bigImage", { required: "Big image URL is required" })} placeholder="Big Image URL" />
        {errors.bigImage && <p className="text-red-500">{errors.bigImage.message}</p>}

        <Input {...register("smallImage", { required: "Small image URL is required" })} placeholder="Small Image URL" />
        {errors.smallImage && <p className="text-red-500">{errors.smallImage.message}</p>}

        <Textarea {...register("description", { required: "Description is required" })} placeholder="Description" />
        {errors.description && <p className="text-red-500">{errors.description.message}</p>}

        <Input {...register("genre", { required: "genre is required" })} placeholder="genre" />
        {errors.genre && <p className="text-red-500">{errors.genre.message}</p>}

        <Input {...register("duration", { required: "Duration is required", min: 1 })} type="number" placeholder="Duration (minutes)" />
        {errors.duration && <p className="text-red-500">{errors.duration.message}</p>}

        <Input {...register("imdbRating", { required: "IMDB Rating is required", min: 0, max: 10 })} type="number" step="0.1" placeholder="IMDB Rating" />
        {errors.imdbRating && <p className="text-red-500">{errors.imdbRating.message}</p>}

        <Input
          {...register("rottenTomatoesRating", { required: "Rotten Tomatoes Rating is required", min: 0, max: 100 })}
          type="number"
          placeholder="Rotten Tomatoes Rating"
        />
        {errors.rottenTomatoesRating && <p className="text-red-500">{errors.rottenTomatoesRating.message}</p>}

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Adding Movie..." : "Add Movie"}
        </Button>
      </form>

      {successMessage && (
        <Alert variant="default" className="mt-4 bg-green-100 text-green-800 border-green-300">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Success</AlertTitle>
          <AlertDescription>{successMessage}</AlertDescription>
        </Alert>
      )}

      {errorMessage && (
        <Alert variant="destructive" className="mt-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
      )}
    </>
  )
}

