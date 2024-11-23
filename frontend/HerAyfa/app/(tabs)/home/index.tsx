import React, { useCallback, useEffect, useMemo } from "react";
import {
  FlatList,
  Pressable,
  RefreshControl,
  useColorScheme,
  View,
} from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { EmergencyContactsModal } from "@/components/modal/EmergencyContact";
import { useHealthStore } from "@/store/healthstore";
import useUserStore from "@/store/userStore";
import { styles } from "./styles";
import { HealthTipCard } from "@/components/resources/HealthCard";
import { SectionHeader } from "@/components/card/Header";
import { ReminderCard } from "@/components/card/Reminder";
import { Colors } from "@/constants/Colors";

// Types
interface HealthTip {
  category?: string;
  title: string;
  description: string;
  image?: string;
}

interface HealthArticle extends HealthTip {
  id: string;
  type: string;
  content: string;
  videoUrl?: string;
}

// Define section types
type SectionType = 'healthTips' | 'reminders' | 'articles';
const sections: SectionType[] = ['healthTips', 'reminders', 'articles'];

const Home = () => {
  const user = useUserStore((state) => state.user);
  const [isEmergencyModalVisible, setIsEmergencyModalVisible] = React.useState(false);
  const {
    healthTips,
    healthArticles,
    batchFetchData,
    reminders,
    loading,
  } = useHealthStore();

  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];
  

  const firstName = useMemo(() => user?.name.split(" ")[0], [user?.name]);
  
  const filteredArticles = useMemo(() => 
    healthArticles?.filter((article) => article.type === "text") ?? [],
    [healthArticles]
  );

  useEffect(() => {
    // Use batch fetch instead of individual calls
    const loadData = async () => {
      await batchFetchData();
    };
    loadData();
  }, []);
 

  const onRefresh = useCallback(() => {
    // Force refresh when user pulls to refresh
   batchFetchData(true);
  }, []);

  const handleArticlePress = useCallback((article: HealthArticle) => {
    router.push({
      pathname: "/article-details",
      params: {
        id: article.id,
        title: article.title,
        category: article.category,
        type: article.type,
        description: article.description,
        content: article.content,
        image: article.image,
        videoUrl: article.videoUrl,
      },
    });
  }, []);

  const renderHealthTips = useCallback(() => (
    <View>
      <SectionHeader
        title="Daily Health Tips"
        onPress={() => {}}
        showSeeAll={false}
      />
      <FlatList
        data={healthTips?.tips}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.tipsContainer}
        renderItem={({ item, index }) => (
          <HealthTipCard 
            key={`health-tip-${index}`} 
            {...item} 
            onPress={() => {}} 
          />
        )}
        keyExtractor={(_, index) => `health-tip-${index}`}
        initialNumToRender={3}
        maxToRenderPerBatch={3}
        windowSize={3}
      />
    </View>
  ), [healthTips?.tips]);

  const renderReminders = useCallback(() => {
    // Check if reminders exists and get the array from the object
    const reminderArray = reminders?.reminders || [];
    
    const upcomingReminders = reminderArray
      .filter(reminder => !reminder.completed)
      .sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        return dateA.getTime() - dateB.getTime();
      })
      .slice(0, 2); // Show only the next 2 upcoming reminders
  
    return (
      <View>
        <SectionHeader
          title="Upcoming Reminders"
          onPress={() => router.push("/reminders")}
        />
        {upcomingReminders.length > 0 ? (
          upcomingReminders.map((reminder) => (
            <ReminderCard
              key={reminder.id}
              reminder={reminder}
            />
          ))
        ) : (
          <ThemedView style={[styles.reminderCard, { backgroundColor: colors.background }]}>
            <ThemedText style={styles.reminderTitle}>No upcoming reminders</ThemedText>
          </ThemedView>
        )}
      </View>
    );
  }, [reminders, colors.background]);

  const renderHealthArticles = useCallback(() => (
    <View>
      <SectionHeader
        title="Health Articles"
        onPress={() => router.push("/resources")}
        showSeeAll={true}
      />
      <FlatList
        data={filteredArticles}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.tipsContainer}
        renderItem={({ item, index }) => (
          <HealthTipCard
            key={`article-${item.id || index}`}
            {...item}
            onPress={() => handleArticlePress(item)}
          />
        )}
        keyExtractor={(item, index) => `article-${item.id || index}`}
        initialNumToRender={3}
        maxToRenderPerBatch={3}
        windowSize={3}
      />
    </View>
  ), [filteredArticles, handleArticlePress]);
  const renderHeader = useCallback(() => (
    <View>
      <ThemedView style={styles.header}>
        <ThemedText style={styles.greeting}>
          Welcome, {firstName}
        </ThemedText>
        <ThemedText style={styles.subGreeting}>
          How are you feeling today?
        </ThemedText>
      </ThemedView>
      
      <Pressable onPress={() => router.push("/emergency-contacts")}>
        <ThemedView style={[styles.emergencyButton]}>
          <Ionicons name="warning" size={24} color="white" />
          <ThemedText style={styles.emergencyText}>
            Emergency Contact
          </ThemedText>
        </ThemedView>
      </Pressable>
    </View>
  ), [firstName]);

  const renderItem = useCallback(({ item: section }: { item: SectionType }) => {
    switch (section) {
      case 'healthTips':
        return renderHealthTips();
      case 'reminders':
        return renderReminders();
      case 'articles':
        return renderHealthArticles();
      default:
        return null;
    }
  }, [renderHealthTips, renderReminders, renderHealthArticles]);

  return (
    <ThemedView style={styles.container}>
      <FlatList<SectionType>
        data={sections}
        renderItem={renderItem}
        keyExtractor={(item) => item}
        ListHeaderComponent={renderHeader}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={onRefresh} />
        }
        initialNumToRender={2}
        maxToRenderPerBatch={2}
        windowSize={3}
        removeClippedSubviews={true}
      />
      <EmergencyContactsModal
        isVisible={isEmergencyModalVisible}
        onClose={() => setIsEmergencyModalVisible(false)}
      />
    </ThemedView>
  );
};

export default React.memo(Home);
