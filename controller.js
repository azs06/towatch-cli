import { fetchContentInfo } from "./fetch.js";
import inquirer from "inquirer";
import { addToDatabase, showWatchlist, getFromDatabase, updateDatabase } from "./database.js";

export const addAction = async (movieName) => {
  const response = await fetchContentInfo(movieName);
  if (response.Response === "True") {
    await displayAndSelectMovie(response);
  } else {
    console.log(`No results found for "${name}".`);
  }
};



export const displayAndSelectMovie = async (response) => {
  const movies = response.Search.slice(0, 10); // Limit to 10 options

  // Map movies to choices for Inquirer
  const choices = movies.map((movie, index) => ({
    name: `${movie.Title} (${movie.Year}) [${movie.Type}]`,
    value: index,
  }));

  // Prompt the user to select a movie
  const { selectedIndex } = await inquirer.prompt([
    {
      type: "list",
      name: "selectedIndex",
      message: "Select the movie/show you want to add to the watchlist:",
      choices,
    },
  ]);

  // Get the selected movie
  const selectedMovie = movies[selectedIndex];

  // Add the selected movie to the database
  await addToDatabase(selectedMovie);
};


export const showAction = async () => {
    showWatchlist();
}

export const updateAction = async (name) => {
    const data = await getFromDatabase(name);
    data.watched = true;
    await updateDatabase(data.imdbID, data);
}