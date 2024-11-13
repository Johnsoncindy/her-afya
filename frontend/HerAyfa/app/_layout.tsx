import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/useColorScheme';
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { usePushNotifications } from './utils/notifications';
import { sendPushTokenToServer } from './api/health/health';
import useUserStore from '@/store/userStore';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });
  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);
const {setUser} = useUserStore();
  const { expoPushToken } = usePushNotifications();
  const webClientId = process.env.EXPO_PUBLIC_WEB_CLIENT_ID!;

  const sendPushToken = async () => {
    const userId = useUserStore.getState().user?.id;

    const pushToken = expoPushToken?.data;
    
    if (userId && pushToken) {
      try {
        await sendPushTokenToServer(userId, pushToken);
      } catch (error) {
        console.error("Failed to send push token:", error);
      }
    }
  };

  useEffect(() => {
    const initializeData = async () => {
      setUser();
      sendPushToken();
    };

    initializeData();

     GoogleSignin.configure({
       webClientId,
       offlineAccess: true
      });

  }, [expoPushToken, sendPushToken, setUser, webClientId]);

  if (!loaded) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="booking/index" options={{headerShown: false}}/>
        <Stack.Screen name="support-request/index" options={{headerShown: false}}/>
        <Stack.Screen name="period-tracker/index" options={{headerShown: false}}/>
        <Stack.Screen name="article-details/index" options={{headerShown: false}}/>
      </Stack>
    </ThemeProvider>
  );
}
