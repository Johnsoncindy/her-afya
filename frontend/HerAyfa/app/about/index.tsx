import React from "react";
import { 
  ScrollView, 
  StyleSheet, 
  View, 
  useColorScheme,
  Pressable,
  Linking 
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Animated, { 
  FadeInDown,
  FadeInLeft,
} from "react-native-reanimated";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Colors } from "@/constants/Colors";

interface FeatureCardProps {
  icon: string;
  title: string;
  description: string;
  delay?: number;
}

export default function AboutScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const dynamicStyles = {
    container: {
      backgroundColor: isDark ? Colors.dark.background : Colors.light.background,
    },
    card: {
      backgroundColor: isDark ? '#1C1C1E' : '#FFFFFF',
    },
    text: {
      color: isDark ? Colors.dark.text : Colors.light.text,
    },
    subtext: {
      color: isDark ? '#A0AEC0' : '#6B7280',
    },
    featureCard: {
      backgroundColor: isDark ? '#2C2C2E' : '#F3F4F6',
    }
  };

  const features: FeatureCardProps[] = [
    {
      icon: "chatbubbles",
      title: "AI Health Chat",
      description: "Get instant, multilingual answers to health-related questions.",
    },
    {
      icon: "calendar",
      title: "Period Tracker",
      description: "Track your menstrual cycle with ease.",
    },
    {
      icon: "heart",
      title: "Pregnancy Journey",
      description: "Manage appointments and milestones during your pregnancy.",
    },
    {
      icon: "people",
      title: "Support Requests",
      description: "Connect with a supportive community for emotional or physical help.",
    },
    {
      icon: "book",
      title: "Educational Content",
      description: "Learn from health tips and articles tailored for women.",
    },
    {
      icon: "call",
      title: "Emergency Hotlines",
      description: "Quickly access critical helplines specific to your location.",
    },
    {
      icon: "download",
      title: "Data Export",
      description: "Download your health data in PDF format.",
    },
    {
      icon: "volume-high",
      title: "Text-to-Speech",
      description: "Listen to chatbot responses and tips in English, French, or Spanish.",
    },
  ];

  const FeatureCard = ({ icon, title, description, delay = 0 }: FeatureCardProps) => (
    <Animated.View
      entering={FadeInLeft.delay(delay)}
      style={[styles.featureCard, dynamicStyles.featureCard]}
    >
      <View style={styles.iconContainer}>
        <Ionicons
          name={icon as any}
          size={24}
          color={Colors[colorScheme ?? "light"].tint}
        />
      </View>
      <View style={styles.featureContent}>
        <ThemedText style={[styles.featureTitle, dynamicStyles.text]}>
          {title}
        </ThemedText>
        <ThemedText style={[styles.featureDescription, dynamicStyles.subtext]}>
          {description}
        </ThemedText>
      </View>
    </Animated.View>
  );

  return (
    <ThemedView style={[styles.container, dynamicStyles.container]}>
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View 
          entering={FadeInDown}
          style={[styles.headerCard, dynamicStyles.card]}
        >
          <ThemedText style={[styles.title, dynamicStyles.text]}>
            HerAfya
          </ThemedText>
          <ThemedText style={[styles.subtitle, dynamicStyles.subtext]}>
            Your companion for health, wellness, and support
          </ThemedText>
          <ThemedText style={[styles.description, dynamicStyles.subtext]}>
            Designed specifically for women and girls, HerAfya provides comprehensive health tracking, support, and educational resources.
          </ThemedText>
        </Animated.View>

        <View style={styles.featuresContainer}>
          {features.map((feature, index) => (
            <FeatureCard
              key={feature.title}
              {...feature}
              delay={index * 100}
            />
          ))}
        </View>

        <Animated.View 
          entering={FadeInDown.delay(800)}
          style={[styles.footerCard, dynamicStyles.card]}
        >
          <ThemedText style={[styles.footerTitle, dynamicStyles.text]}>
            Empowering Your Health Journey
          </ThemedText>
          <ThemedText style={[styles.footerText, dynamicStyles.subtext]}>
            HerAfya is here to empower, inform, and support you on your health journey.
          </ThemedText>
          <Pressable
            style={[styles.button]}
            onPress={() => Linking.openURL('https://her-afya.vercel.app')}
          >
            <ThemedText style={styles.buttonText}>
              Learn More
            </ThemedText>
          </Pressable>
        </Animated.View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  headerCard: {
    margin: 16,
    marginTop: 100,
    padding: 20,
    borderRadius: 20,
    gap: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 4,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    marginTop: 8,
  },
  featuresContainer: {
    padding: 16,
    gap: 12,
  },
  featureCard: {
    flexDirection: 'row',
    padding: 16,
    borderRadius: 16,
    gap: 16,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(147, 51, 234, 0.1)',
  },
  featureContent: {
    flex: 1,
    gap: 4,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  featureDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  footerCard: {
    margin: 16,
    padding: 20,
    borderRadius: 20,
    alignItems: 'center',
    gap: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 4,
  },
  footerTitle: {
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'center',
  },
  footerText: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
  },
  button: {
    marginTop: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 25,
    backgroundColor: Colors.light.tint,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});
