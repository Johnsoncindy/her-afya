import { useLocalSearchParams } from "expo-router";
import {
  StyleSheet,
  useColorScheme,
  ScrollView,
  Image,
  Pressable,
} from "react-native";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { Colors } from "@/constants/Colors";
import { Stack, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import Markdown from "react-native-markdown-display";

export default function ArticleDetails() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  const { title, category, description, content, image } = params;


  const dynamicStyles = {
    container: {
      backgroundColor: isDark
        ? Colors.dark.background
        : Colors.light.background,
    },
    text: {
      color: isDark ? Colors.dark.text : Colors.light.text,
    },
    subtext: {
      color: isDark ? "#A0AEC0" : "#6B7280",
    },
    card: {
      backgroundColor: isDark ? "#2C2C2E" : "#FFFFFF",
    },
  };

  return (
    <ThemedView style={[styles.container, dynamicStyles.container]}>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />

      {/* Custom Header */}
      <ThemedView style={styles.header}>
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <Ionicons
            name="arrow-back"
            size={24}
            color={isDark ? Colors.dark.text : Colors.light.text}
          />
        </Pressable>
        <ThemedText
          style={[styles.headerTitle, dynamicStyles.text]}
          numberOfLines={1}
        >
          Article
        </ThemedText>
        <ThemedView style={styles.placeholder} />
      </ThemedView>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {image && (
          <Image
            source={{ uri: image as string }}
            style={styles.coverImage}
            resizeMode="cover"
          />
        )}

        <ThemedView style={styles.content}>
          <ThemedText
            style={[
              styles.category,
              { color: isDark ? Colors.dark.tint : Colors.light.tint },
            ]}
          >
            {category}
          </ThemedText>

          <ThemedText style={[styles.title, dynamicStyles.text]}>
            {title}
          </ThemedText>

          <ThemedText style={[styles.description, dynamicStyles.subtext]}>
            {description}
          </ThemedText>

          <ThemedView style={styles.divider} />
          <Markdown style={{ body: dynamicStyles.text }}>{content}</Markdown>
        </ThemedView>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    flex: 1,
    textAlign: "center",
  },
  placeholder: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  coverImage: {
    width: "100%",
    height: 240,
    backgroundColor: "#f0f0f0",
  },
  content: {
    padding: 10,
    gap: 8,
  },
  category: {
    fontSize: 14,
    fontWeight: "500",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    lineHeight: 32,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
  },
  divider: {
    height: 1,
    backgroundColor: "rgba(0, 0, 0, 0.1)",
    marginVertical: 8,
  },
  articleContent: {
    fontSize: 16,
    lineHeight: 24,
  },
});
