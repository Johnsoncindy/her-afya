import { StyleSheet, Dimensions } from "react-native";
import { Colors } from "@/constants/Colors";

const { width } = Dimensions.get("window");

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 16,
    marginBottom: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: "#ff0000",
    textAlign: "center",
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0,0,0,0.05)",
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  appointmentCard: {
    padding: 16,
    borderRadius: 12,
    backgroundColor: "rgba(0,0,0,0.05)",
    marginBottom: 12,
  },
  appointmentDate: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
  },
  appointmentType: {
    fontSize: 14,
    marginBottom: 4,
  },
  appointmentLocation: {
    fontSize: 14,
    opacity: 0.7,
  },
  emptyText: {
    textAlign: "center",
    opacity: 0.7,
    marginTop: 20,
  },
  // WeekProgress styles
  weekProgressContainer: {
    padding: 16,
    borderRadius: 12,
    backgroundColor: "rgba(0,0,0,0.05)",
    marginBottom: 16,
  },
  weekText: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
  },
  trimesterText: {
    fontSize: 16,
    textAlign: "center",
    opacity: 0.8,
    marginTop: 4,
  },
  progressContainer: {
    marginVertical: 16,
  },
  infoContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
  },
  sizeCard: {
    flex: 1,
    padding: 12,
    backgroundColor: "rgba(0,0,0,0.03)",
    borderRadius: 8,
    marginRight: 8,
  },
  sizeTitle: {
    fontSize: 14,
    opacity: 0.8,
  },
  sizeText: {
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 4,
  },
  sizeSubtext: {
    fontSize: 12,
    opacity: 0.6,
  },
  dueCard: {
    flex: 1,
    padding: 12,
    backgroundColor: "rgba(0,0,0,0.03)",
    borderRadius: 8,
  },
  dueTitle: {
    fontSize: 14,
    opacity: 0.8,
  },
  dueDate: {
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 4,
  },
  daysRemaining: {
    fontSize: 12,
    opacity: 0.6,
  },
  memoryDate: {
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 4,
  },
  // DevelopmentMilestones styles
  milestonesContainer: {
    marginVertical: 16,
  },
  milestoneCard: {
    width: width * 0.7,
    padding: 16,
    marginRight: 12,
    borderRadius: 12,
    backgroundColor: "rgba(0,0,0,0.05)",
  },
  milestoneTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
  },
  milestoneDescription: {
    fontSize: 14,
    opacity: 0.8,
    lineHeight: 20,
  },
  trackingContainer: {
    alignItems: "center",
    padding: 20,
    backgroundColor: "rgba(0,0,0,0.05)",
    borderRadius: 16,
    marginBottom: 20,
  },
  countText: {
    fontSize: 48,
    fontWeight: "bold",
    color: Colors.light.tint,
    marginBottom: 8,
  },
  timeText: {
    fontSize: 16,
    opacity: 0.8,
    marginBottom: 20,
  },
  itemText: {
    fontSize: 16,
    opacity: 0.8,
    marginBottom: 20,
  },
  kickButton: {
    backgroundColor: Colors.light.tint,
    padding: 20,
    borderRadius: 40,
    width: 160,
    alignItems: "center",
    marginBottom: 12,
  },
  kickButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  stopButton: {
    backgroundColor: "rgba(255, 59, 48, 0.1)",
    padding: 16,
    borderRadius: 30,
    width: 140,
    alignItems: "center",
  },
  stopButtonText: {
    color: "#FF3B30",
    fontSize: 16,
    fontWeight: "600",
  },
  startButton: {
    backgroundColor: Colors.light.tint,
    padding: 20,
    borderRadius: 40,
    width: 180,
    alignItems: "center",
    alignSelf: "center",
    marginVertical: 20,
  },
  startButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  historyContainer: {
    marginTop: 20,
    padding: 16,
    backgroundColor: "rgba(0,0,0,0.05)",
    borderRadius: 16,
  },
  historyTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
  },
  historyItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.1)",
  },
  historyDate: {
    fontSize: 14,
    opacity: 0.8,
  },
  historyCount: {
    fontSize: 14,
    fontWeight: "600",
  },
  // SymptomTracker styles
  symptomContainer: {
    marginVertical: 16,
    padding: 16,
    borderRadius: 12,
    backgroundColor: "rgba(0,0,0,0.05)",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  symptomCard: {
    padding: 12,
    borderRadius: 8,
    backgroundColor: "rgba(0,0,0,0.03)",
    marginBottom: 8,
  },
  severityContainer: {
    flexDirection: "row",
    marginVertical: 4,
  },
  severityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#ccc",
    marginRight: 4,
  },
  activeDot: {
    backgroundColor: Colors.light.tint,
  },
  symptomType: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
  },
  symptomDate: {
    fontSize: 14,
    opacity: 0.7,
    marginTop: 4,
  },
  notes: {
    fontSize: 14,
    opacity: 0.8,
    marginTop: 8,
    fontStyle: "italic",
  },
  // KickCounter styles
  kickCounterContainer: {
    alignItems: "center",
    padding: 20,
  },

  // WeightTracker styles
  chartContainer: {
    marginVertical: 20,
    padding: 16,
    borderRadius: 12,
    backgroundColor: "rgba(0,0,0,0.05)",
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 16,
  },
  statItem: {
    alignItems: "center",
  },
  statLabel: {
    fontSize: 14,
    opacity: 0.8,
  },
  statValue: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 4,
  },

  // PregnancyChecklist styles
  checklistContainer: {
    marginVertical: 16,
  },
  checklistItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 8,
    backgroundColor: "rgba(0,0,0,0.03)",
    marginBottom: 8,
  },
  itemContent: {
    flex: 1,
    marginLeft: 12,
  },
  completedText: {
    textDecorationLine: "line-through",
    opacity: 0.6,
  },

  // Memories styles
  memoriesContainer: {
    marginVertical: 16,
  },
  memoryCard: {
    width: width * 0.7,
    marginRight: 12,
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 12,
  },
  memoryImage: {
    width: "100%",
    height: width * 0.5,
  },
  memoryContent: {
    padding: 12,
    backgroundColor: "rgba(0,0,0,0.05)",
    marginBottom: 10
  },
  disclaimer: {
    margin: 16,
    fontSize: 12,
    opacity: 0.6,
    textAlign: "center",
    marginBottom: 32,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  }
});
