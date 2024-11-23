import client from './client';

const endpoint = "/data-export"
export const exportData = (userId: string) => client.get(`${endpoint}/${userId}/pdf`);
