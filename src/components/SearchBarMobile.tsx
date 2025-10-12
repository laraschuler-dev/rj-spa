// src/components/SearchBarMobile.tsx
import React, { useState, useCallback, useRef } from 'react';
import { useUserSearch } from '../hooks/useUserSearch';
import { Link } from 'react-router-dom';
import { resolveImageUrl } from '../utils/resolveImageUrl';
import { FiSearch, FiX } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

const SearchBarMobile: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const { users, loading, error, searchUsers, resetSearch } = useUserSearch();
  const debounceRef = useRef<NodeJS.Timeout>();

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setSearchTerm(value);

      // Debounce para melhor performance
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }

      debounceRef.current = setTimeout(() => {
        if (value.length >= 2) {
          searchUsers(value, true);
        } else {
          resetSearch();
        }
      }, 300);
    },
    [searchUsers, resetSearch]
  );

  const handleResultClick = useCallback(() => {
    setIsOpen(false);
    setSearchTerm('');
    resetSearch();
  }, [resetSearch]);

  const openSearch = useCallback(() => {
    setIsOpen(true);
  }, []);

  const closeSearch = useCallback(() => {
    setIsOpen(false);
    setSearchTerm('');
    resetSearch();
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
  }, [resetSearch]);

  const clearSearch = useCallback(() => {
    setSearchTerm('');
    resetSearch();
  }, [resetSearch]);

  return (
    <>
      {/* Botão para abrir busca no mobile */}
      <button
        onClick={openSearch}
        className="p-2 hover:bg-white/10 rounded-lg transition-colors"
        aria-label="Buscar usuários"
      >
        <FiSearch size={20} />
      </button>

      {/* Modal de busca para mobile */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-primary z-50 p-4"
          >
            {/* Header do modal */}
            <div className="flex items-center gap-4 mb-4">
              <button
                onClick={closeSearch}
                className="p-2 text-white hover:bg-white/10 rounded-lg transition-colors z-10"
              >
                <FiX size={24} />
              </button>
              <h2 className="text-xl font-semibold text-white">
                Buscar Usuários
              </h2>
            </div>

            {/* Campo de busca */}
            <div className="relative mb-4">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-20">
                <FiSearch className="text-gray-300" size={20} />
              </div>
              <input
                type="text"
                placeholder="Digite o nome do usuário..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="w-full pl-12 pr-12 py-4 bg-white/15 border border-white/30 rounded-xl text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent text-lg relative z-10"
                autoFocus
              />

              {searchTerm && (
                <button
                  onClick={clearSearch}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-300 hover:text-white transition-colors z-20"
                >
                  <FiX size={20} />
                </button>
              )}

              {loading && (
                <div className="absolute inset-y-0 right-0 pr-4 flex items-center z-20">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                </div>
              )}
            </div>

            {/* Resultados */}
            <div className="bg-white rounded-xl shadow-lg max-h-[70vh] overflow-y-auto">
              {error && (
                <div className="p-4 text-red-500 text-sm border-b border-gray-100">
                  {error}
                </div>
              )}

              {users.length === 0 && !loading && searchTerm.length >= 2 && (
                <div className="p-6 text-gray-500 text-center">
                  Nenhum usuário encontrado
                </div>
              )}

              {users.map((user) => (
                <Link
                  key={user.id}
                  to={`/profile/${user.id}`}
                  className="flex items-center gap-4 p-4 hover:bg-gray-50 border-b border-gray-100 last:border-b-0 active:bg-gray-100 transition-colors"
                  onClick={handleResultClick}
                >
                  {user.avatarUrl ? (
                    <img
                      src={resolveImageUrl(user.avatarUrl)}
                      alt={user.name}
                      className="w-12 h-12 rounded-full object-cover border"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                      <span className="text-white font-semibold">
                        {user.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}

                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 truncate">
                      {user.name}
                    </p>
                    {user.profileType && (
                      <p className="text-sm text-gray-500 truncate">
                        {user.profileType}
                      </p>
                    )}
                  </div>
                </Link>
              ))}

              {/* Loading durante busca */}
              {loading && users.length === 0 && searchTerm.length >= 2 && (
                <div className="p-6 text-center">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto"></div>
                  <p className="text-gray-500 text-sm mt-2">
                    Buscando usuários...
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default SearchBarMobile;
