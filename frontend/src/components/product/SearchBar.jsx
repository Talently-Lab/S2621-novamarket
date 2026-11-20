import { useId, useState } from 'react';
import { Search } from 'lucide-react';

function SearchBar({ value = '', onSearch, placeholder = 'Buscar productos' }) {
  const id = useId();
  const [term, setTerm] = useState(value);

  const handleSubmit = (event) => {
    event.preventDefault();
    onSearch(term.trim());
  };

  return (
    <form role="search" onSubmit={handleSubmit} className="relative w-full">
      <label htmlFor={id} className="sr-only">
        {placeholder}
      </label>
      <Search
        aria-hidden="true"
        className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted"
      />
      <input
        id={id}
        type="search"
        value={term}
        onChange={(event) => setTerm(event.target.value)}
        placeholder={placeholder}
        className="focus-ring h-12 w-full rounded-control border border-control-border bg-canvas pl-12 pr-4 text-ink placeholder:text-muted"
      />
    </form>
  );
}

export default SearchBar;
