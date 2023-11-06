import React, { useState, useEffect } from "react";
import "./styles.css";

export default function App() {
  const [repos, setRepos] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState("stars");

  useEffect(() => {
    // Function to fetch data from GitHub API
    // if(searchQuery!=""){
    const fetchRepos = async () => {
      try {
        const response = await fetch(
          `https://api.github.com/search/repositories?q=${searchQuery}`
        );
        const data = await response.json();
        console.log(data);
        //Sorting logic based on the selected option
        const sortedRepos = data.items.slice(); // Create a copy of the array

        switch (sortOption) {
          case "stars":
            sortedRepos.sort((a, b) => b.stargazers_count - a.stargazers_count);
            break;
          case "watchers":
            sortedRepos.sort((a, b) => b.watchers_count - a.watchers_count);
            break;
          case "score":
            sortedRepos.sort((a, b) => b.score - a.score);
            break;
          case "name":
            sortedRepos.sort((a, b) => a.name.localeCompare(b.name));
            break;
          case "created":
            sortedRepos.sort(
              (a, b) => new Date(a.created_at) - new Date(b.created_at)
            );
            break;
          case "updated":
            sortedRepos.sort(
              (a, b) => new Date(a.updated_at) - new Date(b.updated_at)
            );
            break;
          default:
            break;
        }

        setRepos(sortedRepos);
      } catch (error) {
        console.error("Error fetching data", error);
      }
    };
    // }

    fetchRepos();
  }, [searchQuery, sortOption]);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSort = (e) => {
    setSortOption(e.target.value);
  };

  return (
    <div>
      <div>
        <input
          type="text"
          placeholder="Search repositories"
          onChange={handleSearch}
        />
        <select onChange={handleSort}>
          <option value="stars">Stars</option>
          <option value="watchers">Watchers count</option>
          <option value="score">Score</option>
          <option value="name">Name</option>
          <option value="created">Created at</option>
          <option value="updated">Updated at</option>
        </select>
      </div>
      <div className="repo-cards">
        {repos.map((repo) => (
          <div key={repo.id} className="repo-card">
            <img src={repo.owner.avatar_url} alt="Avatar" />
            <h3>Repo Name: {repo.name}</h3>
            <p>Stars: {repo.stargazers_count}</p>
            <p>Description: {repo.description}</p>
            <p>Language: {repo.language}</p>
            <hr />
          </div>
        ))}
      </div>
    </div>
  );
}
