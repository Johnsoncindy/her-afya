import React, { useEffect, useState, useCallback } from "react";
import { StyleSheet, Pressable, FlatList, ActivityIndicator } from "react-native";
import { formatDistanceToNow } from "date-fns";

import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { TabBarIcon } from "@/components/navigation/TabBarIcon";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Colors } from "@/constants/Colors";
import ChatModal from "./ChatModal";
import useUserStore from "@/store/userStore";
import { useSupportStore } from "@/store/supportStore";
import { markMessageAsRead } from "@/app/api/support/support";
import HeartLoading from "../HeartLoading";

// Types
interface ChatPreview {
  id: string;
  supportRequestId: string;
  lastMessage: string;
  timestamp: Date;
  participantId: string;
  participantName: string;
  unreadCount: number;
}

interface ChatItemProps {
  chat: ChatPreview;
  onPress: (chat: ChatPreview) => void;
  colors: any;
}

// Components
const EmptyState: React.FC<{ colors: any }> = ({ colors }) => (
  <ThemedView style={styles.emptyState}>
    <TabBarIcon name="chatbubble-outline" size={48} color={colors.text} />
    <ThemedText style={styles.emptyStateText}>No messages yet</ThemedText>
    <ThemedText style={styles.emptyStateSubtext}>
      Your conversations with sisters will appear here
    </ThemedText>
  </ThemedView>
);

const ChatItem: React.FC<ChatItemProps> = ({ chat, onPress, colors }) => (
  <Pressable
    style={[styles.chatItem, { borderBottomColor: colors.tabIconDefault }]}
    onPress={() => onPress(chat)}
  >
    <ThemedView style={styles.chatItemContent}>
      <ThemedView style={styles.avatarContainer}>
        <TabBarIcon
          name="person-circle-outline"
          size={40}
          color={colors.text}
        />
      </ThemedView>

      <ThemedView style={styles.chatInfo}>
        <ThemedView style={styles.chatHeader}>
          <ThemedText style={styles.participantName}>
            {chat.participantName}
          </ThemedText>
          <ThemedText style={styles.timestamp}>
            {formatDistanceToNow(new Date(chat.timestamp), { addSuffix: true })}
          </ThemedText>
        </ThemedView>

        <ThemedView style={styles.messagePreview}>
          <ThemedText
            style={[styles.lastMessage, { color: colors.text }]}
            numberOfLines={1}
          >
            {chat.lastMessage}
          </ThemedText>
          {chat.unreadCount > 0 && (
            <ThemedView
              style={[styles.unreadBadge, { backgroundColor: colors.tint }]}
            >
              <ThemedText style={styles.unreadCount}>
                {chat.unreadCount}
              </ThemedText>
            </ThemedView>
          )}
        </ThemedView>
      </ThemedView>
    </ThemedView>
  </Pressable>
);

export const ChatInbox: React.FC<{ onClose?: () => void }> = ({ onClose }) => {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];
  const [chats, setChats] = useState<ChatPreview[]>([]);
  const [selectedChat, setSelectedChat] = useState<ChatPreview | null>(null);
  const [chatModalVisible, setChatModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const userId = useUserStore(state => state.user?.id);
  const { fetchChatPreviews, chatPreviews } = useSupportStore();

  const loadChats = useCallback(async () => {
    if (!userId) return;
    
    try {
      setLoading(true);
      setError(null);
      await fetchChatPreviews(userId);
      setChats(chatPreviews);
    } catch (err) {
      setError('Failed to load chats. Please try again.');
      console.error('Error loading chats:', err);
    } finally {
      setLoading(false);
    }
  }, [userId, fetchChatPreviews, chatPreviews]);

  useEffect(() => {
    loadChats();
  }, [loadChats]);

  // Update chats when chatPreviews changes
  useEffect(() => {
    setChats(chatPreviews);
  }, [chatPreviews]);

  const handleChatPress = useCallback(async (chat: ChatPreview) => {
    try {
      setSelectedChat(chat);
      setChatModalVisible(true);
      await markMessageAsRead({ 
        supportRequestId: chat.supportRequestId, 
        userId: userId ?? '' 
      });
    } catch (err) {
      console.error('Error marking message as read:', err);
    }
  }, [userId]);

  const handleCloseChat = useCallback(async () => {
    setChatModalVisible(false);
    setSelectedChat(null);
    await loadChats(); // Refresh chat list
  }, [loadChats]);

  const renderChatItem = useCallback(({ item }: { item: ChatPreview }) => (
    <ChatItem 
      chat={item} 
      onPress={handleChatPress} 
      colors={colors}
    />
  ), [colors, handleChatPress]);

  if (loading && !chats.length) {
    return (
      <ThemedView style={styles.loadingContainer}>
        <HeartLoading size={40} color={colors.tint} />
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={[styles.header, { borderBottomColor: colors.tabIconDefault }]}>
        <ThemedText style={styles.headerText}>Messages</ThemedText>
        {onClose && (
          <Pressable onPress={onClose}>
            <TabBarIcon name="close" size={24} color={colors.text} />
          </Pressable>
        )}
      </ThemedView>

      {error && (
        <ThemedView style={styles.errorContainer}>
          <ThemedText style={styles.errorText}>{error}</ThemedText>
          <Pressable 
            style={[styles.retryButton, { backgroundColor: colors.tint }]}
            onPress={loadChats}
          >
            <ThemedText style={styles.retryButtonText}>Retry</ThemedText>
          </Pressable>
        </ThemedView>
      )}

      {!error && chats.length === 0 ? (
        <EmptyState colors={colors} />
      ) : (
        <FlatList
          data={chats}
          renderItem={renderChatItem}
          keyExtractor={item => item.id}
          showsVerticalScrollIndicator={false}
          refreshing={loading}
          onRefresh={loadChats}
        />
      )}

      {selectedChat && (
        <ChatModal
          visible={chatModalVisible}
          onClose={handleCloseChat}
          recipientId={selectedChat.participantId}
          recipientName={selectedChat.participantName}
          supportRequestId={selectedChat.supportRequestId}
        />
      )}
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
  },
  headerText: {
    fontSize: 20,
    fontWeight: "600",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 16,
    opacity: 0.7,
  },
  retryButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  chatItem: {
    padding: 16,
    borderBottomWidth: 1,
  },
  chatItemContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatarContainer: {
    marginRight: 12,
  },
  chatInfo: {
    flex: 1,
  },
  chatHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  participantName: {
    fontSize: 16,
    fontWeight: "600",
  },
  timestamp: {
    fontSize: 12,
    opacity: 0.6,
  },
  messagePreview: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  lastMessage: {
    fontSize: 14,
    flex: 1,
    marginRight: 8,
  },
  unreadBadge: {
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 6,
  },
  unreadCount: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "600",
  },
  emptyState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: "600",
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    opacity: 0.6,
    textAlign: "center",
  },
});
