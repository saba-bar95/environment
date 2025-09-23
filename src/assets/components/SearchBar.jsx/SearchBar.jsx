import { useState, useRef, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Charts from "../../../Charts";
import "./SearchBar.scss";

const SearchBar = ({ onSelectChart }) => {
  const { language } = useParams();
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [isFocused, setIsFocused] = useState(false);
  const searchRef = useRef(null);

  // Recursively flatten charts with full path
  const flattenCharts = (data, basePath = "") => {
    return Object.entries(data).flatMap(([key, value]) => {
      const currentPath = basePath ? `${basePath}/${key}` : key;

      if (Array.isArray(value)) {
        return value.flatMap((item) => {
          const nestedKey = Object.keys(item)[0];
          const nestedValue = item[nestedKey];

          if (Array.isArray(nestedValue)) {
            // Nested group (e.g., water > majors)
            return nestedValue.map((chart) => ({
              ...chart,
              path: `${currentPath}/${nestedKey}`,
            }));
          }

          // Direct chart object
          return {
            ...item,
            path: currentPath,
          };
        });
      }

      return [];
    });
  };

  // Filter charts based on query and language
  const getFilteredSuggestions = useCallback(
    (query) => {
      const allCharts = flattenCharts(Charts);
      return allCharts.filter((chart) =>
        (language === "en" ? chart.title_en : chart.title_ge)
          ?.toLowerCase()
          .includes(query.toLowerCase())
      );
    },
    [language]
  );

  useEffect(() => {
    if (query.trim() === "") {
      setSuggestions([]);
    } else {
      setSuggestions(getFilteredSuggestions(query));
    }
  }, [query, getFilteredSuggestions]);

  const handleSelect = (chart) => {
    setQuery("");
    setSuggestions([]);
    setIsFocused(false);
    navigate(`/${language}/${chart.path}#${chart.id}`);
    onSelectChart?.(chart.id);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsFocused(false);
        setSuggestions([]);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div
      className="relative w-full max-w-[300px] mx-auto px-4 sm:px-6 lg:px-8 search-bar"
      ref={searchRef}>
      <input
        type="text"
        className="w-full p-3 text-sm placeholder-gray-500 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#003D2F]"
        placeholder={
          language === "en" ? "Search charts..." : "მოძებნე გრაფიკები..."
        }
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => setIsFocused(true)}
      />
      {isFocused && suggestions.length > 0 && (
        <ul className="absolute top-8 w-full bg-white border border-gray-300 rounded-lg shadow-md">
          {suggestions.map((chart) => (
            <li
              key={chart.id}
              className="px-4 py-2 text-sm text-gray-800 cursor-pointer hover:bg-blue-100"
              onClick={() => handleSelect(chart)}>
              {chart[`title_${language}`]}
              <span> ({chart[`path_${language}`]}) </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchBar;
