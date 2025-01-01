import { Low } from "lowdb";
import { JSONFile } from "lowdb/node";
import fs from "fs";

const STORAGE_PATH = "./storage";
const DATABASE_PATH = `${STORAGE_PATH}/database.json`;

// Ensure the storage directory exists
if (!fs.existsSync(STORAGE_PATH)) {
  fs.mkdirSync(STORAGE_PATH);
}

const defaultData = {
  movies: [],
};
const adapter = new JSONFile(DATABASE_PATH);
export const db = new Low(adapter, defaultData);

export const initDatabase = async () => {
  try {
    await db.read();
  } catch (error) {
    db.data ||= { movies: [] }; // Ensure the structure exists
    await db.write();
  }
};

// Helper function to write to the database
export const writeDatabase = async (data) => {
  try {
    db.data = data; // Update the `db.data` object
    await db.write(); // Persist the changes to the file
  } catch (error) {
    console.error("Error writing to database:", error);
  }
};

export const isDuplicate = async (movieName) => {
  await db.read();
  const duplicate = db.data.movies.some((item) => item.Title === movieName);
  return duplicate;
};

export const addToDatabase = async (data) => {
  if (await isDuplicate(data.Title)) {
    console.log(`${data.Title} is already in the watchlist`);
    return;
  }

  await db.read();
  data.watched = false;
  db.data.movies.push(data);
  await db.write();

  console.log(`Added ${data.Title} to the watchlist`);
};

export const getFromDatabase = async (movieName) => {
  await db.read();
  return db.data.movies.filter((item) => item.Title === movieName);
};

export const updateDatabase = async (imdbID, updatedInfo) => {
  await db.read();
  const index = db.data.movies.findIndex((item) => item.imdbID === imdbID);

  if (index === -1) {
    console.log(`No movie/show found with imdbID: ${imdbID}`);
    return;
  }

  db.data.movies[index] = { ...db.data.movies[index], ...updatedInfo };
  await db.write();

  console.log(`Updated "${db.data.movies[index].Title}".`);
};

export const deleteFromDatabase = async (movieName = "", imdbID = "") => {
  await db.read();
  const { movies } = db.data;

  if (movies.length === 0) {
    console.log("The watchlist is empty");
    return;
  }
  if (!movieName && !imdbID) {
    console.log("Please provide a movie name or imdbID");
    return;
  }

  db.data.movies = imdbID
    ? movies.filter((item) => item.imdbID !== imdbID)
    : movies.filter((item) => item.Title !== movieName);

  await db.write();
  console.log(`Deleted ${movieName || imdbID} from the watchlist`);
};

export const showWatchlist = async () => {
  await db.read();
  const { movies } = db.data;

  if (movies.length === 0) {
    console.log("Your watchlist is empty.");
    return;
  }

  console.table(movies, ["Title", "Year", "Type", "imdbID", "watched"]);
};
