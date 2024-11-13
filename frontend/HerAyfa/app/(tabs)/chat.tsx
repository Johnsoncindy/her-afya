import {
  StyleSheet,
  ScrollView,
  TextInput,
  Pressable,
  Alert,
  View,
} from "react-native";
import { router, Stack } from "expo-router";
import { useState, useRef, useCallback, useEffect } from "react";
import { TabBarIcon } from "@/components/navigation/TabBarIcon";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import * as Speech from "expo-speech";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React from "react";
import { chatWithHealthBot } from "@/app/api/health/health";
import TypingAnimation from "@/components/TypingAnimation";

// Medical Disclaimer Notice Component
const DisclaimerNotice = ({ onDismiss }: { onDismiss: () => void }) => {
  const colorScheme = useColorScheme();

  return (
    <ThemedView
      style={[
        styles.disclaimerContainer,
        {
          backgroundColor: Colors[colorScheme ?? "light"].background,
          borderColor: Colors[colorScheme ?? "light"].tint,
        },
      ]}
    >
      <ThemedText style={styles.disclaimerTitle}>
        Important Medical Notice
      </ThemedText>
      <ThemedText style={styles.disclaimerText}>
        This AI Health Assistant provides general health information and is not
        a substitute for professional medical advice, diagnosis, or treatment.
        For medical emergencies or specific health concerns, please consult a
        qualified healthcare provider.
      </ThemedText>
      <ThemedText style={styles.disclaimerText}>
        You can book a session with a licensed medical doctor by clicking the
        booking icon at the top right.
      </ThemedText>
      <Pressable
        style={[
          styles.dismissButton,
          { backgroundColor: Colors[colorScheme ?? "light"].tint },
        ]}
        onPress={onDismiss}
      >
        <ThemedText style={styles.dismissButtonText}>I Understand</ThemedText>
      </Pressable>
    </ThemedView>
  );
};

// Types remain the same
interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  isSaved?: boolean;
}

interface QuickResponse {
  id: string;
  text: string;
}

// Quick response templates
const quickResponses: QuickResponse[] = [
  { id: "1", text: "What are the symptoms?" },
  { id: "2", text: "What should I do when I need medical help?" },
  { id: "3", text: "What if I have taken over the counter medication?" },
];

const languages = [
  { code: "EN", label: "English", locale: "en-US" },
  { code: "ES", label: "Español", locale: "es-ES" },
  { code: "FR", label: "Français", locale: "fr-FR" },
];

// Updated QuickResponseButton with better dark mode support
const QuickResponseButton = ({
  text,
  onPress,
}: {
  text: string;
  onPress: () => void;
}) => {
  const colorScheme = useColorScheme();

  return (
    <Pressable
      style={[
        styles.quickResponseButton,
        {
          backgroundColor: Colors[colorScheme ?? "light"].background,
          borderColor: Colors[colorScheme ?? "light"].tabIconDefault,
        },
      ]}
      onPress={onPress}
    >
      <ThemedText style={styles.quickResponseText}>{text}</ThemedText>
    </Pressable>
  );
};

const ChatMessage = ({
  message,
  onSave,
  onSpeak,
  isSpeaking,
}: {
  message: Message;
  onSave: (id: string) => void;
  onSpeak: (text: string) => void;
  isSpeaking: boolean;
}) => {
  const colorScheme = useColorScheme();
  const isLight = colorScheme === "light";

  return (
    <View
      style={[
        styles.messageContainer,
        {
          alignSelf: message.isUser ? "flex-end" : "flex-start",
          backgroundColor: message.isUser
            ? Colors[colorScheme ?? "light"].tint
            : Colors[colorScheme ?? "light"].background,
          borderColor:
            !message.isUser && !isLight
              ? Colors.dark.tabIconDefault
              : "transparent",
          borderWidth: !message.isUser && !isLight ? 1 : 0,
        },
      ]}
    >
      <ThemedText
        style={[
          styles.messageText,
          {
            color: message.isUser
              ? "#FFFFFF"
              : Colors[colorScheme ?? "light"].text,
          },
        ]}
      >
        {message.text}
      </ThemedText>
      <View style={styles.messageFooter}>
        <ThemedText
          style={[
            styles.timestamp,
            {
              color: message.isUser
                ? "#FFFFFF"
                : Colors[colorScheme ?? "light"].tabIconDefault,
            },
          ]}
        >
          {message.timestamp.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </ThemedText>
        <View style={styles.messageActions}>
          {!message.isUser && (
            <>
              <Pressable
                onPress={() => onSpeak(message.text)}
                style={styles.messageAction}
              >
                <TabBarIcon
                  name={
                    isSpeaking ? "volume-mute-outline" : "volume-high-outline"
                  }
                  color={Colors[colorScheme ?? "light"].icon}
                />
              </Pressable>
              <Pressable
                onPress={() => onSave(message.id)}
                style={styles.messageAction}
              >
                <TabBarIcon
                  name={message.isSaved ? "bookmark" : "bookmark-outline"}
                  color={Colors[colorScheme ?? "light"].icon}
                />
              </Pressable>
            </>
          )}
        </View>
      </View>
    </View>
  );
};
export default function ChatScreen() {
  const colorScheme = useColorScheme();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Hello! How can I help you with your health concerns today?",
      isUser: false,
      timestamp: new Date(),
      isSaved: false,
    },
  ]);
  const [currentLanguage] = useState("EN");
  const scrollViewRef = useRef<ScrollView>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [showDisclaimer, setShowDisclaimer] = useState(true);
  const [currentSpeakingId, setCurrentSpeakingId] = useState<string | null>(
    null
  );

  useEffect(() => {
    // Show disclaimer when component mounts
    setShowDisclaimer(true);
  }, []);

  const handleBookingPress = () => {
    router.push("/booking");
  };

  // Handle text-to-speech
  const handleSpeak = async (text: string) => {
    const locale =
      languages.find((lang) => lang.code === currentLanguage)?.locale ||
      "en-US";

    try {
      // Check if something is currently being spoken
      const isSpeaking = await Speech.isSpeakingAsync();

      if (isSpeaking) {
        // Stop speech if something is being spoken
        await Speech.stop();
        setCurrentSpeakingId(null);
      } else {
        // Start new speech
        await Speech.speak(text, {
          language: locale,
          pitch: 1,
          rate: 0.9,
          onDone: () => {
            setCurrentSpeakingId(null);
          },
          onError: (error) => {
            console.error("Speech error:", error);
            setCurrentSpeakingId(null);
          },
        });
        setCurrentSpeakingId(text);
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Failed to control speech");
      setCurrentSpeakingId(null);
    }
  };

  useEffect(() => {
    return () => {
      Speech.stop();
    };
  }, []);
  // Save important messages
  const handleSaveMessage = async (messageId: string) => {
    const updatedMessages = messages.map((msg) =>
      msg.id === messageId ? { ...msg, isSaved: !msg.isSaved } : msg
    );
    setMessages(updatedMessages);

    // Save to AsyncStorage
    const savedMessages = updatedMessages
      .filter((msg) => msg.isSaved)
      .map((msg) => ({ id: msg.id, text: msg.text, timestamp: msg.timestamp }));
    await AsyncStorage.setItem("savedMessages", JSON.stringify(savedMessages));
  };

  const handleSend = useCallback(async () => {
    if (message.trim()) {
      const newMessage: Message = {
        id: Date.now().toString(),
        text: message,
        isUser: true,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, newMessage]);
      setMessage("");
      setIsLoading(true);
      setIsTyping(true);

      try {
        // Fetch the bot response
        const botResponse = await chatWithHealthBot({userMessage: message});
        console.log(botResponse);
        setIsTyping(false);
        /* const formattedResponse = formatResponse(
          botResponse.botReply.candidates[0].content.parts[0].text
        );
         */
        // Extract the bot reply text from the response
        const aiResponse: Message = {
          id: (Date.now() + 1).toString(),
          text: botResponse.data,
          isUser: false,
          timestamp: new Date(),
          isSaved: false,
        };

        setMessages((prev) => [...prev, aiResponse]);

        // Scroll to bottom after the message is added
        scrollViewRef.current?.scrollToEnd({ animated: true });
      } catch (error) {
        console.error("Error fetching AI response:", error);
        const errorMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: "Sorry, something went wrong. Please try again.",
          isUser: false,
          timestamp: new Date(),
          isSaved: false,
        };
        setMessages((prev) => [...prev, errorMessage]);
      }
    }
  }, [message]);

  const formatResponse = (response: string): string => {
    return response.replace(/\*\*(.*?)\*\*/g, "•$1•");
  };

  return (
    <ThemedView style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <ThemedView
        style={[
          styles.header,
          {
            borderBottomColor:
              Colors[colorScheme ?? "light"].tabIconDefault + "40",
          },
        ]}
      >
        <ThemedText style={styles.headerTitle}>AI Health Assistant</ThemedText>
        <Pressable style={styles.bookingButton} onPress={handleBookingPress}>
          <TabBarIcon
            name="calendar"
            color={Colors[colorScheme ?? "light"].icon}
          />
        </Pressable>
      </ThemedView>

      {/* Show disclaimer if not dismissed */}
      {showDisclaimer && (
        <DisclaimerNotice onDismiss={() => setShowDisclaimer(false)} />
      )}

      <View
        style={[
          styles.quickResponsesContainer,
          {
            borderBottomColor:
              Colors[colorScheme ?? "light"].tabIconDefault + "40",
          },
        ]}
      >
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {quickResponses.map((response) => (
            <QuickResponseButton
              key={response.id}
              text={response.text}
              onPress={() => setMessage(response.text)}
            />
          ))}
        </ScrollView>
      </View>

      <ScrollView
        ref={scrollViewRef}
        style={styles.chatContainer}
        contentContainerStyle={styles.chatContent}
        showsVerticalScrollIndicator={false}
      >
        {messages.map((msg) => (
          <ChatMessage
            key={msg.id}
            message={msg}
            onSave={handleSaveMessage}
            onSpeak={handleSpeak}
            isSpeaking={currentSpeakingId === msg.text}
          />
        ))}
        {isTyping && (
          <View style={{ padding: 10 }}>
            <TypingAnimation />
          </View>
        )}
      </ScrollView>

      <ThemedView
        style={[
          styles.inputContainer,
          {
            borderTopColor:
              Colors[colorScheme ?? "light"].tabIconDefault + "40",
          },
        ]}
      >
        <TextInput
          style={[
            styles.input,
            {
              color: Colors[colorScheme ?? "light"].text,
              backgroundColor: Colors[colorScheme ?? "light"].background,
              borderColor: Colors[colorScheme ?? "light"].tabIconDefault,
            },
          ]}
          value={message}
          onChangeText={setMessage}
          placeholder="Type your message..."
          placeholderTextColor={Colors[colorScheme ?? "light"].tabIconDefault}
          multiline
          editable={!isLoading}
        />

        <Pressable
          style={[
            styles.sendButton,
            { backgroundColor: Colors[colorScheme ?? "light"].tint },
          ]}
          onPress={handleSend}
          disabled={isLoading || message.trim() === ""}
        >
          <TabBarIcon name="send" color="#FFFFFF" />
        </Pressable>
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    paddingTop: 60,
    paddingBottom: 20,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  quickResponsesContainer: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    paddingVertical: 12,
  },
  quickResponseButton: {
    padding: 8,
    paddingHorizontal: 16,
    borderRadius: 16,
    marginHorizontal: 6,
    borderWidth: 1,
  },
  quickResponseText: {
    fontSize: 14,
  },
  disclaimerContainer: {
    margin: 16,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  disclaimerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  disclaimerText: {
    fontSize: 14,
    marginBottom: 8,
    lineHeight: 20,
  },
  dismissButton: {
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 8,
  },
  dismissButtonText: {
    color: "#FFFFFF",
    fontWeight: "600",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "90%",
    maxWidth: 400,
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  doctorProfile: {
    alignItems: "center",
    marginBottom: 20,
  },
  doctorName: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  doctorDetails: {
    fontSize: 14,
    marginBottom: 4,
  },
  bookButton: {
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  bookButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  bookingButton: {
    padding: 8,
    borderRadius: 20,
  },
  chatContainer: {
    flex: 1,
  },
  chatContent: {
    padding: 16,
  },
  messageContainer: {
    maxWidth: "80%",
    padding: 12,
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  messageText: {
    fontSize: 16,
    marginBottom: 4,
  },
  messageFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 4,
  },
  messageActions: {
    flexDirection: "row",
    alignItems: "center",
  },
  messageAction: {
    marginLeft: 8,
    padding: 4,
  },
  timestamp: {
    fontSize: 12,
  },
  inputContainer: {
    flexDirection: "row",
    padding: 16,
    alignItems: "flex-end",
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  input: {
    flex: 1,
    marginHorizontal: 12,
    padding: 12,
    borderRadius: 20,
    maxHeight: 100,
    borderWidth: 1,
  },
  voiceButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
  },
});
