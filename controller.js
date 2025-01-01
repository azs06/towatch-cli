
import fs from "fs/promises";
const STORAGE_PATH = "./storage";
const DATABASE_PATH = `${STORAGE_PATH}/database.json`;
import { fetchContentInfo } from "./fetch.js";

export const addToDatabase = async(movieName) => {
    const data = await fetchContentInfo(movieName);
    const dbfile = await fs.readFile(DATABASE_PATH);
    const database = JSON.parse(dbfile);
    database.push(data);
    await fs.writeFile(DATABASE_PATH, JSON.stringify(database));
    console.log(`Added ${movieName} to the watchlist`);
}

export const getFromDatabase = () => {

}

export const updateDatabase = () => {

}

export const deleteFromDatabase = () => {

}

export const listDatabase = async() => {
    const dbfile = await fs.readFile(DATABASE_PATH);
    const database = JSON.parse(dbfile);
    console.log(database);
}