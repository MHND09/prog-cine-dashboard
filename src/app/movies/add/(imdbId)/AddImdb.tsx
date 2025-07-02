"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import { Movie } from "@/lib/definitions"

const addMovieImdb = async (imdbId: string) => {
    // Simulating different error scenarios
    const random = Math.random()
    if (random < 0.25) {
        throw new Error("MOVIE_EXISTS")
    } else if (random < 0.5) {
        throw new Error("INVALID_IMDB_ID")
    } else if (random < 0.75) {
        throw new Error("API_ERROR")
    }
    // If no error, the movie is successfully added
    return Promise.resolve()
}
interface imdbMovieResponse {
    Title: string
    Year: string
    Runtime: string
    Genre: string
    Plot: string
    Poster: string
    Ratings: {
        Source: string
        Value: string
    }[]
}

const AddImdb = () => {
    const router = useRouter()
    const searchParams = useSearchParams()
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<{ imdbId: string }>()
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [movieData, setMovieData] = useState<imdbMovieResponse | null>(null)
    const [searchError, setSearchError] = useState<string | null>(null)
    const [addMovieError, setAddMovieError] = useState<string | null>(null)
    const [successMessage, setSuccessMessage] = useState<string | null>(null)

    const onSubmit = async (data: { imdbId: string }) => {
        const params = new URLSearchParams(searchParams)
        if (!movieData) {
            return
        }
        const { Title, Year, Plot, Runtime, Genre, Poster, Ratings } = movieData

        const imdbRatingObj = Ratings?.find(r => r.Source === "Internet Movie Database")
        console.log("hello")
        console.log(imdbRatingObj)
        const imdbRatingValue = imdbRatingObj ? imdbRatingObj.Value.split('/')[0] : "N/A"

        const rottenTomatoesObj = Ratings?.find(r => r.Source === "Rotten Tomatoes")
        const rottenTomatoesValue = rottenTomatoesObj
            ? rottenTomatoesObj.Value.replace('%', '')
            : "N/A"

        const runtimeNumber = Runtime.split(' ')[0];
        const movie: Movie = {
            name: Title,
            year: Year,
            description: Plot,
            duration: runtimeNumber,
            genre: Genre,
            bigImage: Poster,
            smallImage: Poster,
            imdbRating: imdbRatingValue,
            rottenTomatoesRating: rottenTomatoesValue,
        }
        console.log("movie: ", movie)
        params.forEach((_, key) => {
            params.delete(key)
        })
        params.set("movieData",encodeURIComponent(JSON.stringify(movie)))
        router.push(`?${params.toString()}`)
        setTimeout(
            ()=>{
                window.location.reload()
            }, 1500
        )
        
    }

    const fetchMovieByImdbId = async (imdbId: string) => {
        setSuccessMessage(null)
        setAddMovieError(null)
        setSearchError(null)
        setMovieData(null)
        try {
            const res = await fetch(`https://www.omdbapi.com/?apikey=${process.env.NEXT_PUBLIC_OMDB_API_KEY}&i=${imdbId}`)
            const data = await res.json()
            if (res.ok && data.Response === "True") {
                setMovieData(data)
            } else {
                setSearchError(data.Error || "Failed to fetch movie data")
            }
        } catch (error) {

            setSearchError("An error occurred while fetching the movie")
        }
    }

    return (
        <>
            <h2 className="text-xl font-semibold mb-4">Add by IMDb ID</h2>
            <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
                <div>
                    <label className="block font-medium mb-1">IMDb ID</label>
                    <Input
                        {...register("imdbId", {
                            required: "IMDb ID is required",
                            pattern: {
                                value: /^tt[0-9]+$/i,
                                message: "Invalid IMDb ID format",
                            },
                        })}
                        placeholder="e.g. tt1234567"
                    />
                    {errors.imdbId && <p className="text-red-500 mt-1">{errors.imdbId.message}</p>}
                </div>
                <div className="flex flex-row space-x-5">
                    <Button
                        type="button"
                        onClick={() =>
                            fetchMovieByImdbId((document.querySelector('input[name="imdbId"]') as HTMLInputElement).value)
                        }
                    >
                        Search for Movie
                    </Button>
                    <Button type="submit" disabled={!movieData || isSubmitting}>
                        {isSubmitting ? "Adding..." : "Add using IMDb ID"}
                    </Button>
                </div>
            </form>

            {successMessage && (
                <Alert variant="default" className="mt-4 bg-green-100 text-green-800 border-green-300">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Success</AlertTitle>
                    <AlertDescription>{successMessage}</AlertDescription>
                </Alert>
            )}

            {searchError && (
                <Alert variant="destructive" className="mt-4">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{searchError}</AlertDescription>
                </Alert>
            )}

            {addMovieError && (
                <Alert variant="destructive" className="mt-4">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error Adding Movie</AlertTitle>
                    <AlertDescription>{addMovieError}</AlertDescription>
                </Alert>
            )}

            {movieData && (
                <div className="mt-4">
                    <h3 className="text-lg font-semibold mb-2">Movie Information:</h3>
                    <pre className="bg-gray-100 p-4 rounded-md overflow-x-auto">{JSON.stringify(movieData, null, 2)}</pre>
                </div>
            )}

            <div className="text-sm text-gray-600 mt-4">
                Find the IMDb ID from the URL: <em>imdb.com/title/tt1234567</em>
            </div>
        </>
    )
}

export default AddImdb

