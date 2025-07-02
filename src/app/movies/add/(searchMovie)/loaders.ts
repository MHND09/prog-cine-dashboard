async function searchImdbMovieByName(name:string, page:number) {
    console.log("Searching for: ", name);
    const url = `http://www.omdbapi.com/?apikey=${process.env.NEXT_PUBLIC_OMDB_API_KEY}&s=${name}&page=${page}&type=movie`
    const response = await fetch(url);
    const data = await response.json() as SearchResult;
    if (data.Response == "False")
        return []
    return data.Search;
    
}

async function fetchImdbMoviePages(name:string) {
    console.log("Searching for: ", name);
    const url = `http://www.omdbapi.com/?apikey=${process.env.NEXT_PUBLIC_OMDB_API_KEY}&s=${name}&type=movie`
    const response = await fetch(url);
    const data = await response.json() as SearchResult;
    if (data.Response == "False")
        return 1
    console.log(data);
    return Math.ceil(Number(data.totalResults) / data.Search.length);
}


export type imdbMovieRes = {
    Title: string;
    Year: string;
    imdbID: string;
    Type: string;
    Poster: string;
};

type SearchResult = {
    Search: imdbMovieRes[];
    totalResults: string;
    Response: string;
};

export { searchImdbMovieByName, fetchImdbMoviePages };