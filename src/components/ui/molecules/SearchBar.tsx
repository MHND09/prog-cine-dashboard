"use client"
import { Search, X } from 'lucide-react'
import { useSearchParams, usePathname, useRouter } from 'next/navigation'



const searchBar = () => {
    const searchParams = useSearchParams()
    const pathname = usePathname()
    const { replace } = useRouter()
    function handleSearch(term: string) {
        const params = new URLSearchParams(searchParams)
        if (term) {
            params.set('query', term)
            params.set('page', '1')
        }
        else {
            params.delete('query')
            params.delete('page')
        }
        replace(`${pathname}?${params.toString()}`)
    }


    const reset = () => {
        const form = document.querySelector('#search-form') as HTMLFormElement;
        if (form) {
            form.reset();
            handleSearch('')
        }
    }

    return (
        <form onSubmit={
            (e) => {
                e.preventDefault()
                handleSearch((e.target as HTMLFormElement).query.value)
            }
        } className='flex flex-col items-center' id='search-form'>
            <div className='search-form'
            >
            <input
                className='search-input'
                name="query"
                placeholder="Search for Movies"
                /* onChange={(e) => handleSearch(e.target.value)} */
                defaultValue={searchParams.get('query') || ''}
            />
            <div className='flex gap-2'>
                {(searchParams.get('query')
                ) &&
                    <button type="reset" onClick={reset} className="search-btn text-white">
                        <X className='size-5' />
                    </button>}
                <button type="submit" className="search-btn text-white">
                    <Search className='size-5' />
                </button>
            </div>
            </div>
        </form>
    )
}

export default searchBar