import axios, { AxiosResponse } from 'axios';

const { REACT_APP_API_URL, REACT_APP_API_KEY } = process.env;

axios.defaults.headers.common['x-api-key'] = REACT_APP_API_KEY

export interface Book {
  title: String,
  author: Author,
  isbn: String,
  quantity_available: Number,
  quantity_total: Number,
  description: String,
  history: Array<Update>
}

export interface Author {
  first_name: String,
  last_name: String
}

export interface Update {
  type: String,
  time: String,
  author: String,
  description: String
}

const getBookList = (): Promise<AxiosResponse<any>> => {
  return axios
    .get(`${REACT_APP_API_URL}/books`);
}

const createBook = (book: Book): Promise<AxiosResponse<any>> => {
  return axios.post(`${REACT_APP_API_URL}/books`, book);
}

const getBook = (isbn: String): Promise<AxiosResponse<any>> => {
  return axios
    .get(`${REACT_APP_API_URL}/books/${isbn}`);
}

const deleteBook = (isbn: String): Promise<AxiosResponse<any>> => {
  return axios
    .delete(`${REACT_APP_API_URL}/books/${isbn}`);
}

const updateBook = (book: Book): Promise<AxiosResponse<any>> => {
  return axios.put(`${REACT_APP_API_URL}/books/${book.isbn}`, book);
}

export const api = {
  getBookList,
  deleteBook,
  createBook,
  getBook,
  updateBook
}