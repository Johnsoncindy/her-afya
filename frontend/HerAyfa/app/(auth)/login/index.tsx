import React, { useState } from "react";
import {
  GoogleSignin,
  statusCodes,
} from "@react-native-google-signin/google-signin";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Image,
  Platform,
  KeyboardAvoidingView,
  ScrollView,
  Text,
} from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "react-native";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import auth from "@react-native-firebase/auth";
import { createUser } from "@/app/api/health/health";
import HeartLoading from "@/components/HeartLoading";
import useUserStore from "@/store/userStore";

export const LoginScreen: React.FC = () => {
  const colorScheme = useColorScheme() ?? "light";
  const colors = Colors[colorScheme];
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Use Zustand store to set the user
  const { setUser } = useUserStore();

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      await GoogleSignin.hasPlayServices();
      const signInResult = await GoogleSignin.signIn();
      const idToken = signInResult.data?.idToken;
  
      if (!idToken) {
        throw new Error("Failed to retrieve ID token.");
      }
  
      const googleCredential = auth.GoogleAuthProvider.credential(idToken);
      const userCredential = await auth().signInWithCredential(googleCredential);
      const user = userCredential.user;
  
      // Map Firebase user data to the updated Zustand store structure
      const mappedUser = {
        name: user.displayName || "",
        email: user.email || "",
        id: user.uid,
        photoURL: user.photoURL || null,
      };
  
      await createUser(user);
      
      await AsyncStorage.setItem("userData", JSON.stringify(mappedUser));
      await AsyncStorage.setItem("isLoggedIn", "true");
      await setUser();
  
      router.push("/(tabs)");
    } catch (error: any) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        console.error("User cancelled the login flow");
      } else if (error.code === statusCodes.IN_PROGRESS) {
        console.error("Sign in is in progress already");
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        console.error("Play services not available or outdated");
      } else {
        console.error("Error during Google Sign-In:", error);
      }
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <ThemedView style={[styles.container, { padding: 10 }]}>
          {/* Logo Section */}
          <View style={styles.logoContainer}>
            <Image
              source={require("../../../assets/images/icon.png")}
              style={styles.logo}
              resizeMode="contain"
            />
            <ThemedText style={styles.welcomeText}>
              Welcome to HerAfya
            </ThemedText>
            <ThemedText style={styles.subtitleText}>
              Your health, your way
            </ThemedText>
          </View>

          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          {/* Google Login Button */}
          <TouchableOpacity
            style={[styles.googleButton, { borderColor: colors.text }]}
            onPress={handleGoogleLogin}
            disabled={loading}
          >
            <Image
              source={require("../../../assets/images/googleLogo.png")}
              style={styles.googleIcon}
            />
            <ThemedText style={styles.googleButtonText}>
              {loading ? <HeartLoading /> : "Continue with Google"}
            </ThemedText>
          </TouchableOpacity>

          {/* Terms and Privacy */}
          <View style={styles.termsContainer}>
            <ThemedText style={styles.termsText}>
              By continuing, you agree to our{" "}
              <ThemedText style={[styles.link, { color: colors.tint }]}>
                Terms
              </ThemedText>{" "}
              and{" "}
              <ThemedText style={[styles.link, { color: colors.tint }]}>
                Privacy Policy
              </ThemedText>
            </ThemedText>
          </View>
        </ThemedView>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 20,
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 40,
  },
  errorText: {
    color: "red",
    textAlign: "center",
    marginBottom: 20,
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 16,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
  },
  subtitleText: {
    fontSize: 16,
    opacity: 0.8,
  },
  googleButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: 48,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 24,
  },
  googleIcon: {
    width: 24,
    height: 24,
    marginRight: 12,
  },
  googleButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
  termsContainer: {
    alignItems: "center",
  },
  termsText: {
    fontSize: 14,
    textAlign: "center",
    opacity: 0.8,
  },
  link: {
    textDecorationLine: "underline",
  },
});

export default LoginScreen;
