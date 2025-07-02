import SearchBar from "@/components/ui/molecules/SearchBar"
import MovieList from "./MovieList"
import { fetchImdbMoviePages} from "./loaders";
import Pagecomp from "./pagecomp";


const SearchMovie = async (props: {
  searchParams?:
  Promise<{ query?: string; page?: string; }>;
}
) => {
  const searchParams = await props.searchParams
  const query = searchParams?.query || ''
  const currentPage = searchParams?.page || '1'
  const totalPages = query ? await fetchImdbMoviePages(query) : 1;

  return (
    <div className="search-page">
      
      <SearchBar />
      <MovieList query={query} currentPage={parseInt(currentPage)} />
      {query &&
        <Pagecomp  totalPages={totalPages}/>}
    </div>
  )
}

export default SearchMovie