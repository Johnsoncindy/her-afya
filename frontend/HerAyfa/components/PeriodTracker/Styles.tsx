import { Colors } from "@/constants/Colors";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    content: {
      flex: 1,
    },
    statusCard: {
      margin: 16,
      padding: 16,
      borderRadius: 12,
      backgroundColor: "rgba(0,0,0,0.05)",
    },
    statusTitle: {
      fontSize: 18,
      fontWeight: "bold",
      marginBottom: 8,
    },
    statusDescription: {
      fontSize: 16,
      opacity: 0.8,
      marginBottom: 4,
    },
    datePickerContainer: {
      margin: 16,
    },
    datePickerLabel: {
      fontSize: 16,
      marginBottom: 8,
    },
    datePicker: {
      padding: 16,
      borderRadius: 12,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
    },
    datePickerIcon: {
      marginRight: 8,
    },
    datePickerText: {
      color: "#FFFFFF",
      fontSize: 16,
      fontWeight: "600",
    },
    infoCard: {
      margin: 16,
      padding: 16,
      borderRadius: 12,
      backgroundColor: "rgba(0,0,0,0.05)",
    },
    infoTitle: {
      fontSize: 18,
      fontWeight: "bold",
      marginBottom: 8,
    },
    infoDescription: {
      fontSize: 16,
      opacity: 0.8,
      marginBottom: 12,
    },
    eventList: {
      marginTop: 8,
    },
    eventItem: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 8,
    },
    eventEmoji: {
      fontSize: 20,
      marginRight: 8,
    },
    eventText: {
      fontSize: 16,
    },
    button: {
      margin: 16,
      padding: 16,
      borderRadius: 12,
      alignItems: "center",
    },
    buttonText: {
      color: "#FFFFFF",
      fontSize: 16,
      fontWeight: "600",
    },
    disclaimer: {
      margin: 16,
      fontSize: 12,
      opacity: 0.6,
      textAlign: "center",
      marginBottom: 32,
    },
    card: {
      margin: 16,
      padding: 16,
      borderRadius: 12,
      backgroundColor: "rgba(0,0,0,0.05)",
    },
    cardTitle: {
      fontSize: 18,
      fontWeight: "bold",
      marginBottom: 12,
    },
    cycleCard: {
      padding: 12,
      borderRadius: 8,
      marginRight: 12,
      backgroundColor: "rgba(0,0,0,0.05)",
      minWidth: 150,
    },
    cycleDate: {
      fontSize: 14,
      fontWeight: "600",
    },
    cycleLength: {
      fontSize: 12,
      opacity: 0.8,
      marginTop: 4,
    },
    cycleSymptoms: {
      fontSize: 12,
      opacity: 0.8,
      marginTop: 4,
    },
    symptomsContainer: {
      marginTop: 12,
    },
    symptomItem: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingVertical: 8,
      borderBottomWidth: 1,
      borderBottomColor: "rgba(0,0,0,0.1)",
    },
    symptomName: {
      flex: 1,
      fontSize: 14,
    },
    symptomDate: {
      fontSize: 12,
      opacity: 0.8,
      marginRight: 8,
    },
    intensityDots: {
      flexDirection: "row",
      marginLeft: 8,
    },
    intensityDot: {
      width: 6,
      height: 6,
      borderRadius: 3,
      backgroundColor: Colors.light.tint,
      marginHorizontal: 2,
    },
    modal: {
      position: "absolute",
      bottom: 0,
      left: 0,
      right: 0,
      padding: 16,
      backgroundColor: Colors.light.background,
      borderTopLeftRadius: 12,
      borderTopRightRadius: 12,
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: -2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
    },
    modalTitle: {
      fontSize: 18,
      fontWeight: "bold",
      marginBottom: 16,
      textAlign: "center",
    },
    closeButton: {
      padding: 12,
      borderRadius: 8,
      backgroundColor: "rgba(0,0,0,0.1)",
      marginTop: 12,
      alignItems: "center",
    },
    addSymptomButton: {
      padding: 12,
      borderRadius: 8,
      backgroundColor: Colors.light.tint,
      alignItems: "center",
    },
    insightText: {
      fontSize: 14,
      marginBottom: 8,
      opacity: 0.8,
    },
    symptomList: {
      maxHeight: 300,
    },
    symptomButton: {
      padding: 16,
      borderRadius: 8,
      backgroundColor: "rgba(0,0,0,0.05)",
      marginVertical: 4,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    symptomButtonText: {
      fontSize: 16,
    },
    closeButtonText: {
      fontSize: 16,
      color: Colors.light.text,
      opacity: 0.8,
    },
    disabledButton: {
      opacity: 0.5,
      backgroundColor: '#ccc',
    },
    errorContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
    },
    errorText: {
      fontSize: 16,
      color: '#ff0000',
      textAlign: 'center',
      marginBottom: 10,
    },
  setEndDateButton: {
    backgroundColor: Colors.light.tint,
    padding: 8,
    borderRadius: 8,
    marginTop: 10,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },

  ongoingPeriodBadge: {
    backgroundColor: '#FFE4E4', // Light red background
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: 4,
  },
  ongoingPeriodText: {
    color: '#FF4D4D', // Red text
    fontSize: 12,
    fontWeight: '600',
  },
  statusInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  activeDot: {
    backgroundColor: '#4CAF50', // Green for active/ongoing
  },
  completeDot: {
    backgroundColor: '#9E9E9E', // Gray for completed
  },
  });
