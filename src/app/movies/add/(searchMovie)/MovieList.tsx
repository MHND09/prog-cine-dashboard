import React from 'react'
import Link from "next/link";
import { searchImdbMovieByName, imdbMovieRes } from './loaders';
import Image  from "next/image";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
const MovieList = async ({
    query,
    currentPage,
  }: {
    query: string;
    currentPage: number;
  }) => {
    let searchedMovies : imdbMovieRes[] = [];
    if (query.length > 0) {
      console.log("Query: ", query);
      searchedMovies = await searchImdbMovieByName(query, currentPage);
    }
    console.log("Movies: ", searchedMovies);
  return (
    <>
        <div className="flex flex-col mx-auto justify-center items-center w-full">
          <h3 className="text-lg font-bold mt-4">Search Results</h3>
          {searchedMovies.length == 0 &&(
            <div className="document-list-empty mt-4">
              {query.length > 0?
                <p className="text-lg font-bold">No results found</p>
                : <p className="text-lg font-bold">Search for Movies</p>
                }
            </div>
          )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {
          searchedMovies.length > 0 && (
            searchedMovies.map((item:imdbMovieRes, index:any) => (
            <Card key={index}>
              <CardHeader>
              {
                  item.Poster && item.Poster != "N/A" ?
                  (
                    <Image src={item.Poster} alt={`Poster for ${item.Title}`} width={300} height={200} className="rounded-t-lg"  />
                  ):
                  (
                    <Image src="/clapperboard.svg" alt="Default poster" width={300} height={200} className="rounded-t-lg" />
                  )
                }
              </CardHeader>
              <CardContent>
                <CardTitle>{item.Title}</CardTitle>
                <CardDescription>{item.Year}</CardDescription>
              </CardContent>

            </Card>
          )))  
        }
        </div>
      </>
  )
}



export default MovieList;

{/* <li key={index} className="document-list-item">
              <div className="space-y-1">
                <p className="text-lg">{item.Title}</p>
                <p className="text-sm font-light text-gray-500 line-clamp-4">{item.Year}</p>
                {
                  item.Poster && item.Poster != "N/A" ?
                  (
                    <Image src={item.Poster} width={200} height={200} alt={`Poster for ${item.Title}`}/>
                  ):
                  (
                    <Image src="/clapperboard.svg" width={200} height={200} alt="Default poster"/>
                  )
                }
              </div>
              
            </li> */}