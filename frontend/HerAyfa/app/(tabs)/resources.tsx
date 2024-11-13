import React from "react";
import {
  StyleSheet,
  ScrollView,
  Pressable,
  Dimensions,
  Linking,
  RefreshControl,
} from "react-native";
import { router, Stack } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { TabBarIcon } from "@/components/navigation/TabBarIcon";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { useHealthStore } from "@/store/healthstore";
import { VideoContentCard } from "@/components/YoutubeCard";
import * as Location from "expo-location";
import { ServiceCard } from "@/components/resources/ServiceCard";
import { HealthTipCard } from "@/components/resources/HealthCard";
import { CountrySelector } from "@/components/modal/CountriesModal";
import { SisterKeeperContent } from "@/components/resources/SisterKeeperContent";
import { useSupportStore } from "@/store/supportStore";
import { SupportRequest } from "@/store/types/support";
import { calculateDistance } from "@/components/resources/CalculateDistance";

const { width } = Dimensions.get("window");
const CARD_WIDTH = width * 0.7;

type TabButtonProps = {
  title: string;
  active: boolean;
  onPress: () => void;
};

const EmergencyContact: React.FC<{
  name: string;
  number: string;
  description: string;
  onPress: () => void;
}> = ({ name, number, description, onPress }) => {
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
            <ThemedText
              style={[styles.emergencyNumber, { color: colors.tint }]}
            >
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

const handleDirectionsPress = (latitude: number, longitude: number) => {
  if (latitude !== undefined && longitude !== undefined) {
    const url = `https://www.google.com/maps?q=${latitude},${longitude}`;
    Linking.openURL(url);
  }
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
        style={[
          styles.tabButtonText,
          { color: active ? "#FFFFFF" : colors.text },
        ]}
      >
        {title}
      </ThemedText>
    </Pressable>
  );
};

export default function ResourcesScreen() {
  const [activeTab, setActiveTab] = useState("educational");
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];
  const [userLocation, setUserLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [supportRequest, setSupportRequest] = useState<SupportRequest[]>(
    []
  );

  const handleCall = (number: string) => {
    Linking.openURL(`tel:${number}`);
  };

  const {
    healthArticles,
    fetchHealthArticles,
    loading,
    fetchNearbyServices,
    nearbyServices,
    fetchEmergencyContacts,
    emergencyContacts,
    selectedCountry,
    setSelectedCountry,
  } = useHealthStore();

  const { fetchSupportRequests, supportRequests} = useSupportStore();

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === "granted") {
        const location = await Location.getCurrentPositionAsync({});
        const userLoc = {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        };
        setUserLocation(userLoc);
 
        // Add distance calculation to each request
        const updatedRequests = supportRequests.map((request: SupportRequest) => ({
          ...request,
          distance: calculateDistance(
            userLoc.latitude,
            userLoc.longitude,
            request.location.latitude,
            request.location.longitude
          ),
        }));
        setSupportRequest(updatedRequests); 
      }
    })();
  }, [supportRequest]);

  useEffect(() => {
    fetchHealthArticles();
    fetchEmergencyContacts();
    fetchSupportRequests();
    
  }, [fetchEmergencyContacts, fetchHealthArticles, fetchSupportRequests]);

  const onRefresh = useCallback(() => {
    fetchHealthArticles();
    fetchSupportRequests();
  }, [fetchHealthArticles, fetchSupportRequests]);

  // Filter video and text articles
  const videoArticles =
    healthArticles?.filter((article) => article.type === "video") || [];
  const textArticles =
    healthArticles?.filter((article) => article.type === "text") || [];

  const handleFetchNearbyServices = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      console.error("Location permission not granted");
      return;
    }
    const location = await Location.getCurrentPositionAsync({});
    fetchNearbyServices(location.coords.latitude, location.coords.longitude);
  };

  useEffect(() => {
    if (activeTab === "services") {
      handleFetchNearbyServices();
    }
  }, [activeTab]);
  const renderNearbyServices = () => (
    <>
      <ThemedText style={styles.sectionTitle}>Nearby Services</ThemedText>
      {nearbyServices.map((service, index) => (
        <ServiceCard
          key={index}
          name={service.name}
          type={service.type}
          distance={service.status}
          rating={service.rating}
          isOpen={service.isOpen}
          totalRatings={service.totalRatings}
          vicinity={service.vicinity}
          onPress={() => {}}
          latitude={service.latitude ?? 0}
          longitude={service.longitude ?? 0}
          onDirectionsPress={() =>
            handleDirectionsPress(service.latitude ?? 0, service.longitude ?? 0)
          }
        />
      ))}
    </>
  );

  const renderEmergencyContent = () => {
    const countryContacts =
      emergencyContacts.find((c) => c.countryCode === selectedCountry)
        ?.contacts || [];

    return (
      <ThemedView style={styles.emergencyContainer}>
        <ThemedView
          style={[styles.alertCard, { backgroundColor: colors.tint + "20" }]}
        >
          <TabBarIcon name="alert-circle" color={colors.tint} size={24} />
          <ThemedText style={[styles.alertText, { color: colors.text }]}>
            For immediate life-threatening emergencies, contact emergency
            services
          </ThemedText>
        </ThemedView>

        <ThemedText style={styles.sectionTitle}>Emergency Contacts</ThemedText>

        <CountrySelector
          selectedCountry={selectedCountry}
          onSelect={setSelectedCountry}
        />

        {countryContacts.map((contact, index) => (
          <EmergencyContact
            key={index}
            name={contact.type
              .split("_")
              .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
              .join(" ")}
            number={contact.number}
            description={contact.description}
            onPress={() => handleCall(contact.number)}
          />
        ))}
      </ThemedView>
    );
  };

  const renderContent = () => {
    switch (activeTab) {
      case "educational":
        return (
          <ThemedView>
            <ThemedText style={styles.sectionTitle}>
              Featured Content
            </ThemedText>
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
                  duration={"10 mins"}
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
          </ThemedView>
        );
      case "services":
        return renderNearbyServices();
      case "sister":
        return <SisterKeeperContent supportRequest={supportRequest}/>;
      case "emergency":
        return renderEmergencyContent();
      default:
        return null;
    }
  };

  return (
    <ThemedView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <Stack.Screen options={{ headerShown: false }} />

      <ThemedView style={styles.header}>
        <ThemedText style={styles.headerTitle}>Resources</ThemedText>
      </ThemedView>

      <ThemedView style={styles.tabContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabContent}
        >
          <TabButton
            title="Educational"
            active={activeTab === "educational"}
            onPress={() => setActiveTab("educational")}
          />
          <TabButton
            title="Sister's Keeper"
            active={activeTab === "sister"}
            onPress={() => setActiveTab("sister")}
          />
          <TabButton
            title="Emergency"
            active={activeTab === "emergency"}
            onPress={() => setActiveTab("emergency")}
          />
          <TabButton
            title="Healthcare"
            active={activeTab === "services"}
            onPress={() => setActiveTab("services")}
          />
          
          
        </ScrollView>
      </ThemedView>

      <ScrollView
        style={styles.contentContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={onRefresh} />
        }
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
    paddingTop: 48,
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
    paddingHorizontal: 8,
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
  contentCard: {
    width: CARD_WIDTH,
    marginRight: 16,
    borderRadius: 12,
    overflow: "hidden",
  },
  thumbnailContainer: {
    height: 160,
    justifyContent: "center",
    alignItems: "center",
  },
  contentInfo: {
    padding: 12,
  },
  contentCategory: {
    fontSize: 12,
    opacity: 0.7,
    marginBottom: 4,
  },
  tipsContainer: {
    paddingRight: 16,
    gap: 12,
  },
  contentTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  contentDuration: {
    fontSize: 12,
    opacity: 0.7,
  },
  servicesContainer: {
    flex: 1,
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
