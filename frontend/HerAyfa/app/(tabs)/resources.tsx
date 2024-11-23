import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  ScrollView,
  Pressable,
  Dimensions,
  Linking,
} from "react-native";
import { router } from "expo-router";
import * as Location from "expo-location";

import { TabBarIcon } from "@/components/navigation/TabBarIcon";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { VideoContentCard } from "@/components/YoutubeCard";
import { ServiceCard } from "@/components/resources/ServiceCard";
import { HealthTipCard } from "@/components/resources/HealthCard";
import { CountrySelector } from "@/components/modal/CountriesModal";
import { SisterKeeperContent } from "@/components/resources/SisterKeeperContent";
import { useHealthStore } from "@/store/healthstore";
import { useSupportStore } from "@/store/supportStore";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { calculateDistance } from "@/components/resources/CalculateDistance";

// Types
interface TabButtonProps {
  title: string;
  active: boolean;
  onPress: () => void;
}

interface EmergencyContactProps {
  name: string;
  number: string;
  description: string;
  onPress: () => void;
}
interface HealthService {
  name: string;
  type: string;
  status: string;
  rating: number;
  isOpen?: boolean;
  totalRatings?: number;
  vicinity?: string;
  latitude?: number;
  longitude?: number;
}

interface UserLocation {
  latitude: number;
  longitude: number;
}

type TabType = "educational" | "services" | "sister" | "emergency";

// Constants
const { width } = Dimensions.get("window");
const CARD_WIDTH = width * 0.7;

// Helper Functions
const formatContactName = (type: string): string => 
  type.split("_")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

const openDirections = (latitude: number, longitude: number) => {
  if (latitude && longitude) {
    const url = `https://www.google.com/maps?q=${latitude},${longitude}`;
    Linking.openURL(url);
  }
};

const makePhoneCall = (number: string) => {
  Linking.openURL(`tel:${number}`);
};

// Components
const EmergencyContact: React.FC<EmergencyContactProps> = ({ 
  name, 
  number, 
  description, 
  onPress 
}) => {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];
  const isLight = colorScheme === "light";

  return (
    <Pressable onPress={onPress}>
      <ThemedView
        style={[
          styles.emergencyCard,
          {
            backgroundColor: colors.background,
            borderColor: colors.tabIconDefault,
            borderWidth: !isLight ? 1 : 0,
          },
        ]}
      >
        <ThemedView style={styles.emergencyHeader}>
          <ThemedView style={styles.emergencyInfo}>
            <ThemedText style={styles.emergencyName}>{name}</ThemedText>
            <ThemedText style={[styles.emergencyNumber, { color: colors.tint }]}>
              {number}
            </ThemedText>
          </ThemedView>
          <TabBarIcon name="call" color={colors.tint} size={24} />
        </ThemedView>
        <ThemedText style={styles.emergencyDescription}>
          {description}
        </ThemedText>
      </ThemedView>
    </Pressable>
  );
};

const TabButton: React.FC<TabButtonProps> = ({ title, active, onPress }) => {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];

  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.tabButton,
        { backgroundColor: active ? colors.tint : colors.background },
      ]}
    >
      <ThemedText
        style={[styles.tabButtonText, { color: active ? "#FFFFFF" : colors.text }]}
      >
        {title}
      </ThemedText>
    </Pressable>
  );
};

const AlertCard: React.FC = () => {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];

  return (
    <ThemedView style={[styles.alertCard, { backgroundColor: colors.tint + "20" }]}>
      <TabBarIcon name="alert-circle" color={colors.tint} size={24} />
      <ThemedText style={[styles.alertText, { color: colors.text }]}>
        For immediate life-threatening emergencies, contact emergency services
      </ThemedText>
    </ThemedView>
  );
};

export default function ResourcesScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];
  
  const [activeTab, setActiveTab] = useState<TabType>("educational");
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
  
  const {
    healthArticles,
    fetchNearbyServices,
    nearbyServices,
    fetchEmergencyContacts,
    emergencyContacts,
    selectedCountry,
    setSelectedCountry,
  } = useHealthStore();

  const { fetchSupportRequests, supportRequests } = useSupportStore();

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === "granted") {
        const location = await Location.getCurrentPositionAsync({});
        setUserLocation({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });
      }
    })();
  }, []);

  useEffect(() => {
    fetchEmergencyContacts();
    fetchSupportRequests();
  }, []);

  useEffect(() => {
    if (activeTab === "services") {
      handleFetchNearbyServices();
    }
  }, [activeTab]);

  const handleFetchNearbyServices = async () => {
    if (!userLocation) {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") return;
      
      const location = await Location.getCurrentPositionAsync({});
      fetchNearbyServices(location.coords.latitude, location.coords.longitude);
    } else {
      fetchNearbyServices(userLocation.latitude, userLocation.longitude);
    }
  };


  const videoArticles = healthArticles?.filter(article => article.type === "video") || [];
  const textArticles = healthArticles?.filter(article => article.type === "text") || [];

  const handleArticlePress = (article: any) => {
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
  };

  const renderEducationalContent = () => (
    <ThemedView>
      <ThemedText style={styles.sectionTitle}>Featured Content</ThemedText>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.featuredContent}
      >
        {videoArticles.map((article, index) => (
          <VideoContentCard
            key={index}
            title={article.title}
            category={article.category}
            duration="10 mins"
            videoUrl={article.videoUrl}
            thumbnailUrl={article.image}
            id={article.id}
          />
        ))}
      </ScrollView>

      <ThemedText style={[styles.sectionTitle, { marginTop: 16 }]}>
        Popular Topics
      </ThemedText>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.tipsContainer}
      >
        {textArticles.map((article, index) => (
          <HealthTipCard
            key={index}
            {...article}
            onPress={() => handleArticlePress(article)}
          />
        ))}
      </ScrollView>
    </ThemedView>
  );

  const renderEmergencyContent = () => {
    const countryContacts = emergencyContacts.find(
      c => c.countryCode === selectedCountry
    )?.contacts || [];

    return (
      <ThemedView style={styles.emergencyContainer}>
        <AlertCard />
        <ThemedText style={styles.sectionTitle}>Emergency Contacts</ThemedText>
        <CountrySelector
          selectedCountry={selectedCountry}
          onSelect={setSelectedCountry}
        />
        {countryContacts.map((contact, index) => (
          <EmergencyContact
            key={index}
            name={formatContactName(contact.type)}
            number={contact.number}
            description={contact.description}
            onPress={() => makePhoneCall(contact.number)}
          />
        ))}
      </ThemedView>
    );
  };

  const renderServicesContent = () => (
    <>
      <ThemedText style={styles.sectionTitle}>Nearby Services</ThemedText>
      {nearbyServices.map((service: HealthService, index) => (
        <ServiceCard
          key={index}
          name={service.name}
          type={service.type}
          distance={service.status}
          rating={service.rating}
          isOpen={service.isOpen}
          totalRatings={service.totalRatings}
          vicinity={service.vicinity}
          latitude={service.latitude}
          longitude={service.longitude}
          onPress={() => {}}
          onDirectionsPress={() => 
            openDirections(service.latitude ?? 0, service.longitude ?? 0)
          }
        />
      ))}
    </>
  );

  const renderContent = () => {
    switch (activeTab) {
      case "educational":
        return renderEducationalContent();
      case "services":
        return renderServicesContent();
      case "sister":
        return (
          <SisterKeeperContent
            supportRequest={userLocation ? supportRequests.map(request => ({
              ...request,
              distance: calculateDistance(
                userLocation.latitude,
                userLocation.longitude,
                request.location.latitude,
                request.location.longitude
              ),
            })) : supportRequests}
          />
        );
      case "emergency":
        return renderEmergencyContent();
    }
  };

  return (
    <ThemedView style={[styles.container, { backgroundColor: colors.background }]}>
      <ThemedView style={styles.header}>
        <ThemedText style={styles.headerTitle}>Resources</ThemedText>
      </ThemedView>

      <ThemedView style={styles.tabContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabContent}
        >
          {[
            { id: "educational", title: "Educational" },
            { id: "sister", title: "Sister's Keeper" },
            { id: "emergency", title: "Emergency" },
            { id: "services", title: "Healthcare" },
          ].map(tab => (
            <TabButton
              key={tab.id}
              title={tab.title}
              active={activeTab === tab.id}
              onPress={() => setActiveTab(tab.id as TabType)}
            />
          ))}
        </ScrollView>
      </ThemedView>

      <ScrollView
        style={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {renderContent()}
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 16,
    paddingBottom: 12,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
  },
  tabContainer: {
    height: 40,
    marginBottom: 8,
  },
  tabContent: {
    paddingHorizontal: 8,
  },
  tabButton: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    marginRight: 8,
    height: 32,
    justifyContent: "center",
  },
  tabButtonText: {
    fontSize: 14,
    fontWeight: "500",
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
  },
  featuredContent: {
    paddingRight: 16,
  },
  tipsContainer: {
    paddingRight: 16,
    gap: 12,
  },
  emergencyContainer: {
    flex: 1,
  },
  alertCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  alertText: {
    fontSize: 14,
    fontWeight: "500",
    marginLeft: 12,
    flex: 1,
  },
  emergencyCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  emergencyHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  emergencyInfo: {
    flex: 1,
  },
  emergencyName: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  emergencyNumber: {
    fontSize: 18,
    fontWeight: "700",
  },
  emergencyDescription: {
    fontSize: 14,
    opacity: 0.7,
  },
});