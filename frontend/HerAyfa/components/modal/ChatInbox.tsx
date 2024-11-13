import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Pressable,
  FlatList,
} from 'react-native';
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { TabBarIcon } from "@/components/navigation/TabBarIcon";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Colors } from "@/constants/Colors";
import { formatDistanceToNow } from 'date-fns';
import ChatModal from './ChatModal';
import useUserStore from "@/store/userStore";
import { useSupportStore } from "@/store/supportStore";
import { markMessageAsRead } from '@/app/api/support/support';

interface ChatPreview {
  id: string;
  supportRequestId: string;
  lastMessage: string;
  timestamp: Date;
  participantId: string;
  participantName: string;
  unreadCount: number;
}

export const ChatInbox: React.FC = () => {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];
  const [chats, setChats] = useState<ChatPreview[]>([]);
  const [selectedChat, setSelectedChat] = useState<ChatPreview | null>(null);
  const [chatModalVisible, setChatModalVisible] = useState(false);
  const userId = useUserStore.getState().user?.id ?? "";
  const { fetchChatPreviews } = useSupportStore();

  useEffect(() => {
    loadChats();
  }, );
  
  const loadChats = async () => {
    if (userId) {
      await fetchChatPreviews(userId);
      setChats(useSupportStore.getState().chatPreviews);
    }
  };  

  const handleChatPress = (chat: ChatPreview) => {
    const supportRequestId = chat.supportRequestId;
    
    setSelectedChat(chat);
    setChatModalVisible(true);
    markMessageAsRead({supportRequestId, userId})
  };

  const renderChatItem = ({ item }: { item: ChatPreview }) => (
    <Pressable
      style={[styles.chatItem, { borderBottomColor: colors.tabIconDefault }]}
      onPress={() => handleChatPress(item)}
    >
      <ThemedView style={styles.chatItemContent}>
        <ThemedView style={styles.avatarContainer}>
          <TabBarIcon name="person-circle-outline" size={40} color={colors.text} />
        </ThemedView>
        
        <ThemedView style={styles.chatInfo}>
          <ThemedView style={styles.chatHeader}>
            <ThemedText style={styles.participantName}>
              {item.participantName}
            </ThemedText>
            <ThemedText style={styles.timestamp}>
              {formatDistanceToNow(new Date(item.timestamp), { addSuffix: true })}
            </ThemedText>
          </ThemedView>
          
          <ThemedView style={styles.messagePreview}>
            <ThemedText 
              style={[styles.lastMessage, { color: colors.text }]} 
              numberOfLines={1}
            >
              {item.lastMessage}
            </ThemedText>
            {item.unreadCount > 0 && (
              <ThemedView style={[styles.unreadBadge, { backgroundColor: colors.tint }]}>
                <ThemedText style={styles.unreadCount}>
                  {item.unreadCount}
                </ThemedText>
              </ThemedView>
            )}
          </ThemedView>
        </ThemedView>
      </ThemedView>
    </Pressable>
  );

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.header}>
        <ThemedText style={styles.headerText}>Messages</ThemedText>
      </ThemedView>

      {chats.length === 0 ? (
        <ThemedView style={styles.emptyState}>
          <TabBarIcon name="chatbubble-outline" size={48} color={colors.text} />
          <ThemedText style={styles.emptyStateText}>
            No messages yet
          </ThemedText>
          <ThemedText style={styles.emptyStateSubtext}>
            Your conversations with sisters will appear here
          </ThemedText>
        </ThemedView>
      ) : (
        <FlatList
          data={chats}
          renderItem={renderChatItem}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
        />
      )}

      {selectedChat && (
        <ChatModal
          visible={chatModalVisible}
          onClose={() => {
            setChatModalVisible(false);
            setSelectedChat(null);
            loadChats(); // Refresh chat list when modal closes
          }}
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
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  headerText: {
    fontSize: 20,
    fontWeight: '600',
  },
  chatItem: {
    padding: 16,
    borderBottomWidth: 1,
  },
  chatItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    marginRight: 12,
  },
  chatInfo: {
    flex: 1,
  },
  chatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  participantName: {
    fontSize: 16,
    fontWeight: '600',
  },
  timestamp: {
    fontSize: 12,
    opacity: 0.6,
  },
  messagePreview: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  unreadCount: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    opacity: 0.6,
    textAlign: 'center',
  },
});
