'use client'

import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MovieList } from '@/components/MovieList'
import { AddMovieForm } from '@/components/AddMovieForm'
import { Movie } from "@/lib/definitions"

export function MovieTabs({ movieList }: { movieList: Movie[] }) {
  const [activeTab, setActiveTab] = useState('all-movies')

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList>
        <TabsTrigger value="all-movies">All Movies</TabsTrigger>
        <TabsTrigger value="add-movie">Add Movie</TabsTrigger>
      </TabsList>
      <TabsContent value="all-movies">
        <MovieList movieList={movieList} />
      </TabsContent>
      <TabsContent value="add-movie">
        <AddMovieForm />
      </TabsContent>
    </Tabs>
  )
}

