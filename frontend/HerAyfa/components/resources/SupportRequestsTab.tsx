import React from 'react';
import { StyleSheet, Pressable, View } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

type TabType = 'all' | 'user';
type SupportType = "emotional" | "resources" | "guidance" | "companionship";

interface SupportRequestCard {
    id: string;
    title: string;
    description: string;
    type: SupportType;
    location: {
      latitude: number;
      longitude: number;
      address: string;
    };
    date: string;
    anonymous: boolean;
    userName?: string;
    userId: string;
    isEmergency: boolean;
    status: "open" | "in-progress" | "closed";
    distance?: number;
  }

interface SupportRequestsTabsProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  userRequests: SupportRequestCard[];
  otherRequests: SupportRequestCard[];
}

const SupportRequestsTabs: React.FC<SupportRequestsTabsProps> = ({
  activeTab,
  setActiveTab,
  userRequests,
  otherRequests,
}) => {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  return (
    <View style={styles.tabContainer}>
      <Pressable
        style={[
          styles.tabButton,
          activeTab === 'all' && {
            backgroundColor: colors.tint,
            borderColor: colors.tint,
          },
        ]}
        onPress={() => setActiveTab('all')}
      >
        <ThemedText
          style={[
            styles.tabText,
            activeTab === 'all' && { color: '#FFFFFF' },
          ]}
        >
          All Requests ({userRequests.length + otherRequests.length})
        </ThemedText>
      </Pressable>
      <Pressable
        style={[
          styles.tabButton,
          activeTab === 'user' && {
            backgroundColor: colors.tint,
            borderColor: colors.tint,
          },
        ]}
        onPress={() => setActiveTab('user')}
      >
        <ThemedText
          style={[
            styles.tabText,
            activeTab === 'user' && { color: '#FFFFFF' },
          ]}
        >
          My Requests ({userRequests.length})
        </ThemedText>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  tabContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: Colors.light.tabIconDefault,
    borderRadius: 8,
    marginHorizontal: 4,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
  },
});

export default SupportRequestsTabs;