import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import FollowSuggestions from "./FollowSuggestions";
import { handleGetSuggestions } from "../../fetchers";
import styles from "./ExploreBar.module.css";

export default function ExploreBar() {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const { data, isLoading, error } = useQuery({
    queryKey: ["suggestions"],
    queryFn: handleGetSuggestions,
    refetchOnWindowFocus: false,
  });

  const suggestions = data?.suggestions || [];

  async function handleSubmit(e) {
    e.preventDefault();
    if (!query.trim()) return;
    const safeUrl = `/search?q=${encodeURIComponent(query)}`;
    navigate(safeUrl);
    setQuery("");
  }

  return (
    <div className={styles.exploreContainer}>
      <form className={styles.searchBar} onSubmit={handleSubmit}>
        <div className={styles.searchWrapper}>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search"
          />
        </div>
      </form>

      <FollowSuggestions
        suggestions={suggestions}
        isLoading={isLoading}
        error={error}
      />
    </div>
  );
}
