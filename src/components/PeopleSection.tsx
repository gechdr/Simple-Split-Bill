import React, { useMemo } from "react";
import { useApp } from "../context";

export const PeopleSection: React.FC = () => {
  const {
    t,
    persons,
    newPersonName,
    setNewPersonName,
    duplicatePersonError,
    setDuplicatePersonError,
    personSearch,
    setPersonSearch,
    showPersonSuggestions,
    setShowPersonSuggestions,
    setShowBulkInsert,
    setBulkInsertText,
    addPerson,
    removePerson,
  } = useApp();

  const filteredPersons = useMemo(
    () => persons.filter((p) => p.toLowerCase().includes(personSearch.toLowerCase())),
    [persons, personSearch],
  );

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-4 sm:p-6 mb-6 border-2 border-gray-300 dark:border-gray-700 shadow-md">
      <div className="flex items-center justify-between mb-4 border-b border-gray-100 dark:border-gray-700 pb-2">
        <div className="flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-gray-700 dark:text-gray-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
          <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">{t.peopleList}</h2>
        </div>
        <button
          onClick={() => { setBulkInsertText(""); setShowBulkInsert(true); }}
          className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          {t.bulkInsert}
        </button>
      </div>
      <div className="flex flex-col sm:flex-row gap-2 mb-1">
        <div className="relative flex-1">
          <input
            type="text"
            value={newPersonName}
            onChange={(e) => { setNewPersonName(e.target.value); setDuplicatePersonError(false); setShowPersonSuggestions(true); }}
            onKeyDown={(e) => e.key === "Enter" && addPerson()}
            onFocus={() => setShowPersonSuggestions(true)}
            onBlur={() => setTimeout(() => setShowPersonSuggestions(false), 150)}
            placeholder={t.personNamePlaceholder}
            className={`w-full px-4 py-2.5 border rounded-lg focus:ring-1 focus:outline-none bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-base sm:text-sm ${duplicatePersonError ? "border-red-500 dark:border-red-400 focus:ring-red-500 focus:border-red-500" : "border-gray-300 dark:border-gray-600 focus:ring-gray-900 dark:focus:ring-gray-500 focus:border-gray-900 dark:focus:border-gray-500"}`}
            title={t.tooltipPersonName}
          />
          {showPersonSuggestions && newPersonName.trim() && (() => {
            const suggestions = persons.filter((p) => p.toLowerCase().includes(newPersonName.trim().toLowerCase()));
            return suggestions.length > 0 ? (
              <ul className="absolute z-20 left-0 right-0 top-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg overflow-hidden">
                {suggestions.map((s) => (
                  <li key={s}>
                    <button
                      type="button"
                      onMouseDown={() => { setNewPersonName(s); setShowPersonSuggestions(false); setDuplicatePersonError(false); }}
                      className="w-full text-left px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                    >
                      {s}
                    </button>
                  </li>
                ))}
              </ul>
            ) : null;
          })()}
        </div>
        <button
          onClick={addPerson}
          className="bg-gray-900 dark:bg-gray-700 text-white px-6 py-2.5 rounded-lg hover:bg-black dark:hover:bg-gray-600 transition shadow-sm font-medium"
          title={t.tooltipAddPerson}
        >
          {t.add}
        </button>
      </div>
      {duplicatePersonError && (
        <p className="text-xs text-red-500 dark:text-red-400 mb-3">{t.duplicatePerson}</p>
      )}
      {persons.length === 0 ? (
        <p className="text-sm text-gray-400 dark:text-gray-500 italic mt-3">{t.noPeopleAdded}</p>
      ) : (
        <>
          <div className="relative mt-3 mb-1">
            <svg xmlns="http://www.w3.org/2000/svg" className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500 pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              value={personSearch}
              onChange={(e) => setPersonSearch(e.target.value)}
              placeholder={t.searchPeoplePlaceholder}
              className="w-full pl-9 pr-8 py-2 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-1 focus:ring-gray-900 dark:focus:ring-gray-500 focus:border-gray-900 dark:focus:border-gray-500 focus:outline-none bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm"
            />
            {personSearch && (
              <button
                onClick={() => setPersonSearch("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            )}
          </div>
          {filteredPersons.length === 0 ? (
              <p className="text-sm text-gray-400 dark:text-gray-500 italic py-3">{t.noSearchResults}</p>
            ) : (
              <ul className="divide-y divide-gray-100 dark:divide-gray-700">
                {filteredPersons.map((person) => (
                  <li key={person} className="flex items-center justify-between py-2.5 px-4">
                    <span className="flex items-center gap-2.5 text-sm font-medium text-gray-900 dark:text-gray-100">
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-gray-400 dark:text-gray-500 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="8" r="4" />
                        <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
                      </svg>
                      {person}
                    </span>
                    <button
                      onClick={() => removePerson(person)}
                      className="text-gray-400 dark:text-gray-500 hover:text-red-500 dark:hover:text-red-400 transition p-1 rounded"
                      title={t.tooltipRemovePerson}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="3 6 5 6 21 6" />
                        <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                        <path d="M10 11v6" />
                        <path d="M14 11v6" />
                        <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
                      </svg>
                    </button>
                  </li>
                ))}
              </ul>
            )}
        </>
      )}
    </div>
  );
};
