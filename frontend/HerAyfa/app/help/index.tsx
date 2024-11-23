import React from "react";
import { 
  StyleSheet, 
  ScrollView, 
  Pressable, 
  Linking,
  Alert 
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useColorScheme } from "@/hooks/useColorScheme";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Colors } from "@/constants/Colors";

const SUPPORT_EMAIL = "herafya93@gmail.com";

export default function HelpCenterScreen() {
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
    divider: {
      backgroundColor: isDark ? '#2C2C2E' : '#F3F4F6',
    }
  };

  const handleEmailSupport = () => {
    const emailUrl = `mailto:${SUPPORT_EMAIL}?subject=HerAfya Support Request`;
    Linking.canOpenURL(emailUrl)
      .then((supported) => {
        if (!supported) {
          Alert.alert(
            "Email Not Available",
            "Please email us directly at support@herafya.com"
          );
        } else {
          return Linking.openURL(emailUrl);
        }
      })
      .catch((err) => console.error('Error opening email:', err));
  };

  const supportLinks = [
    {
      title: "Email Support",
      description: "Get help from our support team",
      icon: "mail",
      action: handleEmailSupport
    },
    {
      title: "FAQs",
      description: "Find answers to common questions",
      icon: "help-circle",
      action: () => Linking.openURL("https://her-afya.vercel.app/#faqs")
    },
    {
      title: "Privacy Policy",
      description: "Read our privacy policy",
      icon: "shield-checkmark",
      action: () => Linking.openURL("https://her-afya.vercel.app/privacy")
    },
    {
      title: "Terms of Service",
      description: "View our terms of service",
      icon: "document-text",
      action: () => Linking.openURL("https://her-afya.vercel.app/terms")
    }
  ];

  return (
    <ThemedView style={[styles.container, dynamicStyles.container]}>
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <ThemedView style={[styles.headerCard, dynamicStyles.card]}>
          <ThemedText style={[styles.headerTitle, dynamicStyles.text]}>
            How can we help?
          </ThemedText>
          <ThemedText style={[styles.headerDescription, dynamicStyles.subtext]}>
            Get support, access resources, or learn more about HerAfya
          </ThemedText>
        </ThemedView>

        <ThemedView style={styles.linksContainer}>
          {supportLinks.map((link, index) => (
            <React.Fragment key={link.title}>
              <Pressable
                onPress={link.action}
                style={({ pressed }) => [
                  styles.linkCard,
                  dynamicStyles.card,
                  pressed && styles.pressed
                ]}
              >
                <ThemedView style={[styles.iconContainer, { backgroundColor: Colors[colorScheme ?? "light"].tint + '20' }]}>
                  <Ionicons
                    name={link.icon as any}
                    size={24}
                    color={Colors[colorScheme ?? "light"].tint}
                  />
                </ThemedView>
                <ThemedView style={styles.linkContent}>
                  <ThemedText style={[styles.linkTitle, dynamicStyles.text]}>
                    {link.title}
                  </ThemedText>
                  <ThemedText style={[styles.linkDescription, dynamicStyles.subtext]}>
                    {link.description}
                  </ThemedText>
                </ThemedView>
                <Ionicons
                  name="chevron-forward"
                  size={20}
                  color={Colors[colorScheme ?? "light"].text}
                  style={styles.chevron}
                />
              </Pressable>
              {index < supportLinks.length - 1 && (
                <ThemedView style={[styles.divider, dynamicStyles.divider]} />
              )}
            </React.Fragment>
          ))}
        </ThemedView>

        <ThemedView style={[styles.contactCard, dynamicStyles.card]}>
          <ThemedText style={[styles.contactTitle, dynamicStyles.text]}>
            Direct Contact
          </ThemedText>
          <ThemedText style={[styles.contactText, dynamicStyles.subtext]}>
            For urgent support, email us directly at:
          </ThemedText>
          <Pressable onPress={handleEmailSupport}>
            <ThemedText style={[styles.emailText, { color: Colors[colorScheme ?? "light"].tint }]}>
              {SUPPORT_EMAIL}
            </ThemedText>
          </Pressable>
        </ThemedView>
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
    padding: 20,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 4,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 8,
  },
  headerDescription: {
    fontSize: 16,
    lineHeight: 22,
  },
  linksContainer: {
    marginHorizontal: 16,
    borderRadius: 16,
    overflow: 'hidden',
  },
  linkCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  pressed: {
    opacity: 0.7,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  linkContent: {
    flex: 1,
  },
  linkTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  linkDescription: {
    fontSize: 14,
  },
  chevron: {
    marginLeft: 8,
  },
  divider: {
    height: 1,
    marginHorizontal: 16,
  },
  contactCard: {
    margin: 16,
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 4,
  },
  contactTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  contactText: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 8,
  },
  emailText: {
    fontSize: 16,
    fontWeight: '500',
  },
});
