import axios from 'axios';
import client from '../client';
import { FirebaseAuthTypes } from '@react-native-firebase/auth';

interface BotResponse {
  botReply: {
    candidates: {
      content: {
        role: string;
        parts: {
          text: string;
        }[];
      };
      finishReason: string;
      safetyRatings: {
        category: string;
        probability: string;
        severity: string;
      }[];
      avgLogprobs: number;
      index: number;
    }[];
    usageMetadata: {
      promptTokenCount: number;
      candidatesTokenCount: number;
      totalTokenCount: number;
    };
    modelVersion: string;
  };
}

interface UserMessage {
  userMessage: string;
}
  
export const getHealthTips = () => client.get('/health/health-tips');
export const getHealthResources = () => client.get('/resources/health-articles');
export const chatWithHealthBot = (userMessage: UserMessage) => client.post('/api/chat', userMessage);
   
export const getNearbyHealthServices = async (latitude: number, longitude: number) => {
    try {
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/place/nearbysearch/json`,
        {
          params: {
            location: `${latitude},${longitude}`,
            radius: 5000, // Adjust based on preferred search radius in meters
            type: 'hospital', // You can add other types, like 'clinic' or 'pharmacy'
            key: process.env.EXPO_PUBLIC_GOOGLE_API_KEY, // Ensure this key is set in environment
          },
        }
      );
      return response.data.results;
      
      
    } catch (error) {
      console.error('Error fetching nearby health services:', error);
      throw error;
    }
  };
export const getEmergencyContacts = () => client.get('/emergency-contacts');

export const createUser = (user: FirebaseAuthTypes.User) => client.post('/auth/create-user', {user}); 
export const sendPushTokenToServer = (userId: string, pushToken: string) => client.put(`/auth/${userId}/push-token`, {pushToken: pushToken})
