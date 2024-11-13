import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { create } from 'zustand';
import { UserStore } from './types/user';

 const useUserStore = create<UserStore>((set, get) => ({
  user: null,
  setUser: async () => {
    try {
      const userData = await AsyncStorage.getItem('userData');
      if (userData) {
        const parsedUser = JSON.parse(userData);
        set({ user: parsedUser });
      }
    } catch (error) {
      console.error('Error retrieving user data',error);
    }
  },
  clearUser: async () => {
    await AsyncStorage.removeItem('userData');
    set({ user: null});
    router.navigate('/login');
  },
}));

export default useUserStore;