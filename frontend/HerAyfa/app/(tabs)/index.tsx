import {
  ScrollView,
  StyleSheet,
  Pressable,
  View,
  Image,
  RefreshControl,
} from "react-native";
import { Stack, useRouter } from "expo-router";
import { ThemedText } from "@/components/ThemedText";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Colors } from "@/constants/Colors";
import { ThemedView } from "@/components/ThemedView";
import { Ionicons } from "@expo/vector-icons";
import { useCallback, useEffect, useState } from "react";
import { EmergencyContactsModal } from "@/components/modal/EmergencyContact";
import { useHealthStore } from "@/store/healthstore";
import useUserStore from "@/store/userStore";
import { useSupportStore } from "@/store/supportStore";

// Health Tip Card Component with Image Support
const HealthTipCard = ({
  title,
  description,
  image,
  category,
  onPress,
}: {
  title: string;
  description: string;
  image?: string;
  category?: string;
  onPress: () => void;
}) => {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];
  const isLight = colorScheme === "light";

  return (
    <Pressable style={styles.tipCardWrapper} onPress={onPress}>
      <ThemedView
        style={[
          styles.healthTipCard,
          {
            backgroundColor: colors.background,
            borderColor: colors.tabIconDefault,
            borderWidth: !isLight ? 1 : 0,
          },
        ]}
      >
        {image && (
          <View style={styles.tipImageContainer}>
            <Image
              source={{ uri: image }}
              alt={title}
              style={styles.tipImage}
            />
          </View>
        )}
        <View style={styles.tipContent}>
          {category && (
            <ThemedText style={styles.tipCategory}>{category}</ThemedText>
          )}
          <ThemedText style={styles.healthTipTitle}>{title}</ThemedText>
          <ThemedText style={styles.healthTipDescription}>
            {description}
          </ThemedText>
        </View>
      </ThemedView>
    </Pressable>
  );
};

// Reminder Card Component
/* const ReminderCard = ({
  title,
  time,
  type,
}: {
  title: string;
  time: string;
  type: string;
}) => {
  const colorScheme = useColorScheme();

  return (
    <ThemedView
      style={[
        styles.reminderCard,
        { backgroundColor: Colors[colorScheme ?? "light"].background },
      ]}
    >
      <View style={styles.reminderIcon}>
        <Ionicons
          name={type === "medication" ? "medical" : "calendar"}
          size={20}
          color={Colors[colorScheme ?? "light"].tint}
        />
      </View>
      <View style={styles.reminderContent}>
        <ThemedText style={styles.reminderTitle}>{title}</ThemedText>
        <ThemedText style={styles.reminderTime}>{time}</ThemedText>
      </View>
    </ThemedView>
  );
}; */

export default function HomeScreen() {
  const router = useRouter();
  const [isEmergencyModalVisible, setIsEmergencyModalVisible] = useState(false);
  const {
    healthTips,
    healthArticles,
    fetchHealthTips,
    fetchHealthArticles,
    loading,
  } = useHealthStore();
  const user = useUserStore.getState().user;
  
const {fetchSupportRequests} = useSupportStore();
  useEffect(() => {
    fetchHealthTips();
    fetchHealthArticles();
    fetchSupportRequests();
  }, [fetchHealthArticles, fetchHealthTips, fetchSupportRequests]);

  const onRefresh = useCallback(() => {
    fetchHealthTips();
    fetchHealthArticles();
  }, [fetchHealthTips, fetchHealthArticles]);

  return (
    <ThemedView style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />

      <ThemedView style={styles.header}>
        <ThemedText style={styles.greeting}>Welcome, {user?.name.split(" ")[0]}</ThemedText>
        <ThemedText style={styles.subGreeting}>
          How are you feeling today?
        </ThemedText>
      </ThemedView>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={onRefresh} />
        }
      >
        {/* Emergency Button */}
        <Pressable onPress={() => router.push("/emergency-contacts")}>
          <ThemedView
            style={[styles.emergencyButton, { backgroundColor: "#FF3B30" }]}
          >
            <Ionicons name="warning" size={24} color="white" />
            <ThemedText style={styles.emergencyText}>
              Emergency Contact
            </ThemedText>
          </ThemedView>
        </Pressable>

        {/* Health Tips Carousel */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <ThemedText style={styles.sectionTitle}>
              Daily Health Tips
            </ThemedText>
            <Pressable onPress={() => {}}>
              <ThemedText style={styles.seeAll}>See All</ThemedText>
            </Pressable>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.tipsContainer}
          >
            {Array.isArray(healthTips?.tips) &&
              healthTips?.tips.map((tip, idx) => (
                <HealthTipCard
                  key={idx}
                  category={tip.category}
                  title={tip.title}
                  description={tip.description}
                  image={tip.image}
                  onPress={()=>{}}
                />
              ))}
          </ScrollView>
        </View>

        {/* Health Articles */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <ThemedText style={styles.sectionTitle}>Health Articles</ThemedText>
            <Pressable onPress={() => router.push("/resources")}>
              <ThemedText style={styles.seeAll}>More Articles</ThemedText>
            </Pressable>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.tipsContainer}
          >
            {Array.isArray(healthArticles) &&
              healthArticles
                .filter((article) => article.type === "text")
                .map((article, index) => (
                  <HealthTipCard
                    key={index}
                    category={article.category}
                    title={article.title}
                    description={article.description}
                    image={article.image}
                    onPress={()=> {
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
                    }}
                  />
                ))}
          </ScrollView>
        </View>
      </ScrollView>
      <EmergencyContactsModal
        isVisible={isEmergencyModalVisible}
        onClose={() => setIsEmergencyModalVisible(false)}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 16,
    paddingTop: 60,
    paddingBottom: 20,
  },
  greeting: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 4,
  },
  subGreeting: {
    fontSize: 16,
    opacity: 0.8,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  emergencyButton: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  emergencyText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  sectionContainer: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  seeAll: {
    fontSize: 14,
    color: Colors.light.tint,
  },
  tipsContainer: {
    paddingRight: 16,
    gap: 12,
  },
  tipCardWrapper: {
    width: 280,
  },
  healthTipCard: {
    borderRadius: 12,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  tipImageContainer: {
    height: 140,
    width: "100%",
    backgroundColor: "#f0f0f0",
  },
  tipImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  tipContent: {
    padding: 16,
  },
  tipCategory: {
    fontSize: 12,
    color: Colors.light.tint,
    marginBottom: 4,
  },
  healthTipTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
  },
  healthTipDescription: {
    fontSize: 14,
    opacity: 0.8,
  },
  chatPreview: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 12,
    gap: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  chatContent: {
    flex: 1,
  },
  chatMessage: {
    fontSize: 14,
    marginBottom: 4,
  },
  chatTime: {
    fontSize: 12,
    opacity: 0.6,
  },
  reminderCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    gap: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  reminderIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.light.background,
    alignItems: "center",
    justifyContent: "center",
  },
  reminderContent: {
    flex: 1,
  },
  reminderTitle: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 4,
  },
  reminderTime: {
    fontSize: 12,
    opacity: 0.6,
  },
});
