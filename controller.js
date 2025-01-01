import fs from "fs/promises";
import { fetchContentInfo } from "./fetch.js";
import inquirer from "inquirer";

const STORAGE_PATH = "./storage";
const DATABASE_PATH = `${STORAGE_PATH}/database.json`;

const readDatabase = async () => {
  try {
    const data = await fs.readFile(DATABASE_PATH, "utf8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading database:", error);
    return [];
  }
};

const writeDatabase = async (data) => {
  try {
    await fs.writeFile(DATABASE_PATH, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error("Error writing to database:", error);
  }
};

export const isDuplicate = async (movieName) => {
  const database = await readDatabase();
  const duplicate = database.filter((item) => item.Title === movieName);
  return duplicate.length > 0;
};

export const addAction = async (movieName) => {
  const response = await fetchContentInfo(movieName);
  if (response.Response === "True") {
    await displayAndSelectMovie(response);
  } else {
    console.log(`No results found for "${name}".`);
  }
};

export const addToDatabase = async (movieName) => {
  if (await isDuplicate(movieName)) {
    console.log(`${movieName} is already in the watchlist`);
    return;
  }
  const database = await readDatabase();
  const response = await fetchContentInfo(movieName);
  const data = response.Search[0];
  database.push(data);
  await writeDatabase(database);
  console.log(`Added ${movieName} to the watchlist`);
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
  await addToDatabase(selectedMovie.Title);

  console.log(`"${selectedMovie.Title}" has been added to your watchlist.`);
};

export const getFromDatabase = async (movieName) => {
  const database = await readDatabase();
  const movie = database.filter((item) => item.Title === movieName);
  return movie;
};

export const updateDatabase = async (imdbID, updatedInfo) => {
  const db = await readDatabase();
  const index = db.findIndex((item) => item.imdbID === imdbID);

  if (index === -1) {
    console.log(`No movie/show found with imdbID: ${imdbID}`);
    return;
  }

  db[index] = { ...db[index], ...updatedInfo };
  await writeDatabase(db);
  console.log(`Updated "${db[index].Title}".`);
};

export const deleteFromDatabase = async (movieName = "", imdbID = "") => {
  const database = await readDatabase();
  if (database.length === 0) {
    console.log("The watchlist is empty");
    return;
  }
  if (!movieName && !imdbID) {
    console.log("Please provide a movie name or imdbID");
    return;
  }

  // Immediately invoke the filtering logic
  const updatedDatabase = imdbID
    ? database.filter((item) => item.imdbID !== imdbID)
    : database.filter((item) => item.Title !== movieName);

  await writeDatabase(updatedDatabase);
  console.log(`Deleted ${movieName || imdbID} from the watchlist`);
};

export const showWatchlist = async () => {
  const db = await readDatabase();
  if (db.length === 0) {
    console.log("Your watchlist is empty.");
    return;
  }
  console.table(db, ["Title", "Year", "Type", "imdbID"]);
};
