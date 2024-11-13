import client from './client';

const endpoint = "/data-export"
const exportData = (userId: string) => client.get(`${endpoint}/${userId}/pdf`);

export {
    exportData,
}