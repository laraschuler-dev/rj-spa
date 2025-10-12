// src/components/SearchBar.tsx
import React, { useState, useCallback, useRef } from 'react';
import { useUserSearch } from '../hooks/useUserSearch';
import { Link } from 'react-router-dom';
import { resolveImageUrl } from '../utils/resolveImageUrl';
import { FiSearch, FiX } from 'react-icons/fi';

const SearchBar: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showResults, setShowResults] = useState(false);
  const { users, loading, error, searchUsers, resetSearch } = useUserSearch();
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<NodeJS.Timeout>();

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setSearchTerm(value);

      // Clear previous debounce
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }

      // Debounce para melhor performance
      debounceRef.current = setTimeout(() => {
        if (value.length >= 2) {
          searchUsers(value, true);
          setShowResults(true);
        } else {
          setShowResults(false);
          resetSearch();
        }
      }, 300);
    },
    [searchUsers, resetSearch]
  );

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
    if (inputRef.current) {
      inputRef.current.blur();
    }
  }, [resetSearch]);

  const clearSearch = useCallback(() => {
    setSearchTerm('');
    resetSearch();
    setShowResults(false);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [resetSearch]);

  return (
    <div className="relative w-80">
      {' '}
      {/* 👈 Largura fixa controlada */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
          <FiSearch className="text-gray-400" size={18} />
        </div>

        <input
          ref={inputRef}
          type="text"
          placeholder="Buscar usuários..."
          value={searchTerm}
          onChange={handleSearchChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          className="w-full pl-10 pr-10 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all duration-200 text-sm"
        />

        {searchTerm && (
          <button
            onClick={clearSearch}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-300 hover:text-white transition-colors z-10"
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
      {/* Dropdown de resultados */}
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
                    // Fallback para avatar quebrado
                    e.currentTarget.style.display = 'none';
                    e.currentTarget.nextElementSibling?.classList.remove(
                      'hidden'
                    );
                  }}
                />
              ) : null}

              {/* Fallback avatar */}
              {!user.avatarUrl && (
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center border border-gray-200 group-hover:border-accent transition-colors">
                  <span className="text-white text-xs font-medium">
                    {user.name.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}

              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 truncate text-sm group-hover:text-primary transition-colors">
                  {user.name}
                </p>
                {user.profileType && (
                  <p className="text-xs text-gray-500 truncate">
                    {user.profileType}
                  </p>
                )}
              </div>
            </Link>
          ))}

          {/* Loading durante busca */}
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
