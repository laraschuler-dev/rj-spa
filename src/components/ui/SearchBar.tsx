// src/components/SearchBar.tsx
import React, { useState, useCallback, useRef, useEffect } from 'react';
import { useUserSearch } from '../../hooks/useUserSearch';
import { Link } from 'react-router-dom';
import { resolveImageUrl } from '../../utils/resolveImageUrl';
import { FiSearch, FiX } from 'react-icons/fi';
import { translateProfileType } from '../../utils/translateProfileType';
import AvatarInitials from './AvatarInitials';

const SearchBar: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showResults, setShowResults] = useState(false);
  const { users, loading, error, searchUsers, resetSearch } = useUserSearch();
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (searchTerm.length < 2) {
      resetSearch();
      setShowResults(false);
      return;
    }

    debounceRef.current = setTimeout(() => {
      searchUsers(searchTerm, true);
      setShowResults(true);
    }, 300);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [searchTerm, searchUsers, resetSearch]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleFocus = useCallback(() => {
    if (searchTerm.length >= 2 && users.length > 0) {
      setShowResults(true);
    }
  }, [searchTerm, users.length]);

  const handleBlur = useCallback(() => {
    setTimeout(() => setShowResults(false), 150);
  }, []);

  const handleResultClick = useCallback(() => {
    setShowResults(false);
    setSearchTerm('');
    resetSearch();
    if (inputRef.current) inputRef.current.blur();
  }, [resetSearch]);

  const clearSearch = useCallback(() => {
    setSearchTerm('');
    resetSearch();
    setShowResults(false);
    if (inputRef.current) inputRef.current.focus();
  }, [resetSearch]);

  return (
    <div className="relative w-80">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
          <FiSearch className="text-gray-400" size={18} />
        </div>

        <input
          ref={inputRef}
          type="text"
          placeholder="Buscar usuários..."
          value={searchTerm}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          className="w-full pl-10 pr-10 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all duration-200 text-sm"
        />

        {searchTerm && (
          <button
            onClick={clearSearch}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-300 hover:text-white transition-colors z-10 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
          >
            <FiX size={16} />
          </button>
        )}

        {loading && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center z-10">
            <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div>
          </div>
        )}
      </div>

      {showResults && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-xl max-h-64 overflow-y-auto z-50">
          {error && (
            <div className="p-2 text-red-500 text-xs border-b border-gray-100">
              {error}
            </div>
          )}

          {users.length === 0 && !loading && searchTerm.length >= 2 && (
            <div className="p-3 text-gray-500 text-xs text-center">
              Nenhum usuário encontrado
            </div>
          )}

          {users.map((user) => (
            <Link
              key={user.id}
              to={`/profile/${user.id}`}
              className="flex items-center gap-2 p-2 hover:bg-gray-50 border-b border-gray-100 last:border-b-0 transition-colors group"
              onClick={handleResultClick}
            >
              {user.avatarUrl ? (
                <img
                  src={resolveImageUrl(user.avatarUrl)}
                  alt={user.name}
                  className="w-8 h-8 rounded-full object-cover border border-gray-200 group-hover:border-accent transition-colors"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    const fallback = e.currentTarget.nextElementSibling;
                    if (fallback) fallback.classList.remove('hidden');
                  }}
                />
              ) : null}

              <div
                className={`w-8 h-8 rounded-full bg-accent flex items-center justify-center border border-white group-hover:border-accent transition-colors ${user.avatarUrl ? 'hidden' : ''}`}
              >
                <AvatarInitials name={user?.name} />
              </div>

              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 truncate text-sm group-hover:text-primary transition-colors">
                  {user.name}
                </p>
                {user.profileType && (
                  <p className="text-xs text-gray-500 truncate">
                    {translateProfileType(user.profileType)}
                  </p>
                )}
              </div>
            </Link>
          ))}

          {loading && users.length === 0 && (
            <div className="p-3 text-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary mx-auto"></div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
