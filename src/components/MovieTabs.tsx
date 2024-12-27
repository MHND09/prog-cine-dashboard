'use client'

import { useState , useEffect} from 'react'
import { useSearchParams } from 'next/navigation'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MovieList } from '@/components/MovieList'
import { AddMovieForm } from '@/components/AddMovieForm'
import { EditMovieForm } from './EditMovieForm'
import { Movie } from "@/lib/definitions"

export function MovieTabs({ movieList }: { movieList: Movie[] }) {
  const [activeTab, setActiveTab] = useState('all-movies')
  const searchParams = useSearchParams()
  const editMovieId  = searchParams.get('edit')
  useEffect(() => {
    if (editMovieId) {
      setActiveTab('edit-movie')
    }
  }, [editMovieId])


  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList>
        <TabsTrigger value="all-movies">All Movies</TabsTrigger>
        <TabsTrigger value="add-movie">Add Movie</TabsTrigger>
        {editMovieId && <TabsTrigger value="edit-movie">Edit Movie</TabsTrigger>}
      </TabsList>
      <TabsContent value="all-movies">
        <MovieList movieList={movieList} />
      </TabsContent>
      <TabsContent value="add-movie">
        <AddMovieForm />
      </TabsContent>
      {editMovieId && (
        <TabsContent value="edit-movie">
          <EditMovieForm movieId={editMovieId} />
        </TabsContent>
      )}
    </Tabs>
  )
}

