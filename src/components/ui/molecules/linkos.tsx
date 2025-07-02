"use client"
import { Plus } from 'lucide-react';
import { Button } from '../button';
import { Toast } from '../toast';
import { useToast } from '@/hooks/use-toast';
import { imdbMovieResponse, Movie } from '@/lib/definitions';
import { useSearchParams,useRouter } from 'next/navigation';
import { useState } from 'react';



const Linkos = ({imdbId}:{imdbId:string}) => {
    const [isFetching, setIsFetching] = useState(false);
    const router = useRouter();
    const searchParams = useSearchParams()
    const { toast } = useToast()
    // I couldn't come up with better name tbh
    async function handleClick() {
        try {
            setIsFetching(true)
            const res = await fetch(`https://www.omdbapi.com/?apikey=${process.env.NEXT_PUBLIC_OMDB_API_KEY}&i=${imdbId}`)
            const data = await res.json()
            if (res.ok && data.Response === "True") {
                const movieData = data as imdbMovieResponse
                passToMovieForm(movieData)
            } else {
                toast({
					title: "adding movie failed",
					description: "An error occurred while adding the movie ",
				})
            }
        } catch (error) {
            toast({
                title: "adding movie failed",
                description: "An error occurred while adding the movie ",
            })
        }
    }
    function passToMovieForm(movieData:imdbMovieResponse){
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

    return (
        <>
        <Button onClick={handleClick} className='h-6 w-5 absolute right-2 bottom-2' disabled={isFetching}>
            <Plus  className='h-4 w-4'/>
        </Button>
        </>
    );
};

export default Linkos;