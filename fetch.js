import fetch from 'cross-fetch';
import 'dotenv/config';

const OMDBAPI_URL = process.env.API_BASE_URL;
const API_KEY = process.env.API_KEY;


export const fetchContentInfo = async (movieName) => {
  const response = await fetch(`${OMDBAPI_URL}?apikey=${API_KEY}&s=${movieName}`);
  const data = await response.json();
  return data;
}

