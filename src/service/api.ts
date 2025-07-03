// File: src/services/api.js
import axios from 'axios';

const BASE_URL = 'http://localhost:5000';

export interface UploadFileResponse {
    text: string;
}

export const uploadFile = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);
    const res = await axios.post<UploadFileResponse>(`${BASE_URL}/upload`, formData);
    return res.data.text;
};

export interface RewriteTextResponse {
    result: string;
}

export const rewriteText = async (text: string): Promise<string> => {
    const res = await axios.post<RewriteTextResponse>(`${BASE_URL}/rewrite`, { text });
    return res.data.result;
};

export interface DigestTextResponse {
    result: string;
}

export const digestText = async (text: string): Promise<string> => {
    const res = await axios.post<DigestTextResponse>(`${BASE_URL}/digest`, { text });
    return res.data.result;
};

export interface GenerateTopicsResponse {
    topics: string[];
}

export const generateTopics = async (text: string): Promise<string[]> => {
    const res = await axios.post<GenerateTopicsResponse>(`${BASE_URL}/topics`, { text });
    return res.data.topics;
};

// You can import and use them like:
// import { rewriteText } from '../services/api';
