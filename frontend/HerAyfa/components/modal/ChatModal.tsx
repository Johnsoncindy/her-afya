import React, { useEffect, useState, useRef } from "react";
import {
  StyleSheet,
  Modal,
  Pressable,
  FlatList,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ViewStyle,
  TextStyle,
} from "react-native";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { TabBarIcon } from "@/components/navigation/TabBarIcon";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Colors } from "@/constants/Colors";
import useUserStore from "@/store/userStore";
import { useSupportStore } from "@/store/supportStore";

interface Message {
  id: string;
  content: string;
  senderId: string;
  timestamp: string | Date;
  createdAt: { _seconds: number; _nanoseconds: number };
}

interface ChatModalProps {
  visible: boolean;
  onClose: () => void;
  recipientId: string;
  recipientName: string;
  supportRequestId: string;
}

interface ColorScheme {
  text: string;
  background: string;
  tint: string;
  secondary: string;
  icon: string;
  tabIconDefault: string;
  tabIconSelected: string;
}

const ChatModal: React.FC<ChatModalProps> = ({
  visible,
  onClose,
  recipientId,
  recipientName,
  supportRequestId,
}) => {
  const [message, setMessage] = useState("");
  const [localMessages, setLocalMessages] = useState<Message[]>([]);
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"] as ColorScheme;
  const userId = useUserStore.getState().user?.id ?? "";
  const { sendMessage, fetchMessages, messages } = useSupportStore();
  const flatListRef = useRef<FlatList<Message>>(null);

  useEffect(() => {
    const transformedMessages = messages.map((msg, index) => ({
      ...msg,
      id: msg.id || `${msg.timestamp}-${index}`,
      timestamp: new Date(
        (msg.createdAt?._seconds || 0) * 1000 +
          (msg.createdAt?._nanoseconds || 0) / 1e6
      ).toISOString(),
    }));
    setLocalMessages(transformedMessages as Message[]);
  }, [messages]);

  useEffect(() => {
    if (visible) {
      fetchMessages(supportRequestId, userId);
      const interval = setInterval(() => {
        fetchMessages(supportRequestId, userId);
      }, 3000);

      return () => clearInterval(interval);
    }
  }, [visible, supportRequestId, userId, fetchMessages]);

  const sendSupportMessage = async () => {
    if (message.trim()) {
      const tempMessage: Message = {
        id: Date.now().toString(),
        content: message.trim(),
        senderId: userId,
        timestamp: new Date().toISOString(),
        createdAt: {
          _seconds: 0,
          _nanoseconds: 0,
        },
      };

      setLocalMessages((prev) => [...prev, tempMessage]);
      setMessage("");

      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);

      await sendMessage(message, userId, recipientId, supportRequestId);
    }
  };

  const renderMessage = ({ item }: { item: Message }) => {
    const isSender = item.senderId === userId;

    return (
      <ThemedView
        style={[
          styles.messageContainer,
          isSender ? styles.sentMessage : styles.receivedMessage,
        ]}
      >
        <ThemedView
          style={[
            styles.messageBubble,
            {
              backgroundColor: isSender
                ? colors.tint
                : colors.tabIconDefault + "20",
            },
          ]}
        >
          <ThemedText
            style={[
              styles.messageText,
              {
                color: isSender ? "#FFFFFF" : colors.text,
              },
            ]}
          >
            {item.content}
          </ThemedText>
        </ThemedView>
        <ThemedText
          style={[styles.timestamp, { color: colors.tabIconDefault }]}
        >
          {new Date(item.timestamp).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </ThemedText>
      </ThemedView>
    );
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.modalContainer}
      >
        <ThemedView
          style={[styles.chatContainer, { backgroundColor: colors.background }]}
        >
          <ThemedView
            style={[
              styles.chatHeader,
              { borderBottomColor: colors.tabIconDefault + "20" },
            ]}
          >
            <ThemedText style={styles.chatHeaderText}>
              {recipientName}
            </ThemedText>
            <Pressable onPress={onClose} style={styles.closeButton}>
              <TabBarIcon name="close" color={colors.text} size={24} />
            </Pressable>
          </ThemedView>

          <FlatList
            ref={flatListRef}
            data={localMessages}
            keyExtractor={(item) => item.id || `${item.timestamp}`}
            renderItem={renderMessage}
            contentContainerStyle={styles.messagesList}
            onContentSizeChange={() => flatListRef.current?.scrollToEnd()}
            onLayout={() => flatListRef.current?.scrollToEnd()}
          />

          <ThemedView
            style={[
              styles.messageInput,
              { borderTopColor: colors.tabIconDefault + "20" },
            ]}
          >
            <TextInput
              style={[
                styles.input,
                {
                  color: colors.text,
                  backgroundColor: colors.tabIconDefault + "10",
                  maxHeight: 100,
                },
              ]}
              value={message}
              onChangeText={setMessage}
              placeholder="Type a message..."
              placeholderTextColor={colors.tabIconDefault}
              multiline
              onSubmitEditing={sendSupportMessage}
            />
            <Pressable
              onPress={sendSupportMessage}
              style={[
                styles.sendButton,
                {
                  opacity: message.trim() ? 1 : 0.5,
                },
              ]}
            >
              <TabBarIcon name="send" color={colors.tint} size={24} />
            </Pressable>
          </ThemedView>
        </ThemedView>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    marginTop: 40,
  } as ViewStyle,
  chatContainer: {
    flex: 1,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  } as ViewStyle,
  chatHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
  } as ViewStyle,
  chatHeaderText: {
    fontSize: 18,
    fontWeight: "600",
  } as TextStyle,
  closeButton: {
    padding: 8,
  } as ViewStyle,
  messagesList: {
    paddingVertical: 16,
  } as ViewStyle,
  messageContainer: {
    maxWidth: "80%",
    marginVertical: 4,
    marginHorizontal: 16,
  } as ViewStyle,
  messageBubble: {
    padding: 12,
    borderRadius: 16,
  } as ViewStyle,
  sentMessage: {
    alignSelf: "flex-end",
  } as ViewStyle,
  receivedMessage: {
    alignSelf: "flex-start",
  } as ViewStyle,
  messageText: {
    fontSize: 14,
  } as TextStyle,
  timestamp: {
    fontSize: 12,
    marginTop: 4,
    opacity: 0.7,
    alignSelf: "flex-end",
  } as TextStyle,
  messageInput: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderTopWidth: 1,
  } as ViewStyle,
  input: {
    flex: 1,
    marginRight: 12,
    padding: 12,
    borderRadius: 20,
    fontSize: 14,
    minHeight: 40,
  } as TextStyle,
  sendButton: {
    padding: 8,
  } as ViewStyle,
});

export default ChatModal;
