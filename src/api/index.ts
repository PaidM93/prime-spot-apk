// src/api/index.ts
// ─────────────────────────────────────────────────────────────────
// Prime SpoT Backend API
//
// Your Flask backend needs these routes (add to app.py if missing):
//
//   GET  /api/files?page=1&limit=20       → list recent files
//   GET  /api/search?q=query&page=1       → search files by name
//   GET  /api/file/<file_id>              → single file detail
//
// Each file object shape:
// {
//   file_id:   number,
//   file_name: string,
//   file_url:  string,
//   file_size: string,     // e.g. "1.2 GB"
//   mime_type: string,
//   thumbnail: string,     // URL or ""
//   view_count:number,
//   is_audio:  boolean,
// }
// ─────────────────────────────────────────────────────────────────
import axios from 'axios';

export const BASE_URL = 'https://primespot.koyeb.app';

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

export type PSFile = {
  file_id:    number;
  file_name:  string;
  file_url:   string;
  file_size:  string;
  mime_type:  string;
  thumbnail:  string;
  view_count: number;
  is_audio:   boolean;
};

export type ListResponse = {
  files:   PSFile[];
  total:   number;
  page:    number;
  pages:   number;
};

// Fetch recent/latest files
export async function fetchFiles(page = 1, limit = 20): Promise<ListResponse> {
  const { data } = await api.get('/api/files', { params: { page, limit } });
  return data;
}

// Search files by name
export async function searchFiles(q: string, page = 1): Promise<ListResponse> {
  const { data } = await api.get('/api/search', { params: { q, page } });
  return data;
}

// Get single file details
export async function fetchFile(fileId: number): Promise<PSFile> {
  const { data } = await api.get(`/api/file/${fileId}`);
  return data;
}

// Watch page URL (opens in browser as fallback)
export function watchUrl(fileId: number) {
  return `${BASE_URL}/watch/${fileId}`;
}
