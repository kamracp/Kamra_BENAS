import axios from 'axios';
import type { Campus, CampusCreateInput, CampusUpdateInput } from '../types';
// बैकएंड का बेस URL (हमारा सर्वर पोर्ट 8000 पर लाइव है)
const API_BASE_URL = 'http://localhost:8000/api/v1/campuses';

export const campusApi = {
  // 1. सभी कैंपस की लिस्ट लाना
  getCampuses: async (): Promise<Campus[]> => {
    const response = await axios.get<Campus[]>(API_BASE_URL);
    return response.data;
  },

  // 2. किसी एक कैंपस को ID से देखना
  getCampusById: async (id: number): Promise<Campus> => {
    const response = await axios.get<Campus>(`${API_BASE_URL}/${id}`);
    return response.data;
  },

  // 3. नया कैंपस बनाना (Create)
  createCampus: async (data: CampusCreateInput): Promise<Campus> => {
    const response = await axios.post<Campus>(API_BASE_URL, data);
    return response.data;
  },

  // 4. कैंपस की डिटेल्स अपडेट करना (Update)
  updateCampus: async (id: number, data: CampusUpdateInput): Promise<Campus> => {
    const response = await axios.put<Campus>(`${API_BASE_URL}/${id}`, data);
    return response.data;
  },

  // 5. कैंपस को डिलीट करना (Delete)
  deleteCampus: async (id: number): Promise<void> => {
    await axios.delete(`${API_BASE_URL}/${id}`);
  }
};