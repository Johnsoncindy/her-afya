import { Colors } from "@/constants/Colors";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    scrollView: {
      flex: 1,
    },
    scrollContent: {
      padding: 16,
      paddingBottom: 32,
    },
    // Cycle Card Styles
    cycleCard: {
      padding: 20,
      borderRadius: 16,
      backgroundColor: 'rgba(147, 197, 253, 0.1)',
      marginBottom: 20,
      elevation: 2,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 3,
    },
    cycleHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 8,
    },
    cycleTitle: {
      fontSize: 24,
      fontWeight: 'bold',
    },
    fertileBadge: {
      backgroundColor: '#10B981',
      paddingHorizontal: 12,
      paddingVertical: 4,
      borderRadius: 12,
    },
    fertileBadgeText: {
      color: '#FFFFFF',
      fontSize: 12,
      fontWeight: '600',
    },
    cyclePhase: {
      fontSize: 18,
      marginBottom: 12,
    },
    cyclePredictor: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    cyclePredictorText: {
      marginLeft: 8,
      fontSize: 14,
      opacity: 0.8,
    },
  
    // Quick Actions Styles
    quickActions: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      marginBottom: 24,
      gap: 12,
    },
    quickAction: {
      flex: 1,
      minWidth: '45%',
      alignItems: 'center',
      padding: 16,
      borderRadius: 12,
      backgroundColor: 'rgba(0,0,0,0.05)',
    },
    quickActionIcon: {
      marginBottom: 8,
      width: 48,
      height: 48,
      borderRadius: 24,
      backgroundColor: 'rgba(255,255,255,0.8)',
      alignItems: 'center',
      justifyContent: 'center',
    },
    quickActionLabel: {
      fontSize: 14,
      fontWeight: '500',
    },
  
    // Section Styles
    section: {
      marginBottom: 24,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: '600',
      marginBottom: 8,
    },
    sectionSubtitle: {
      fontSize: 14,
      opacity: 0.6,
      marginBottom: 12,
    },
  
    // Symptoms Styles
    symptomsContainer: {
      paddingVertical: 8,
      gap: 8,
    },
    symptomTag: {
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 20,
      backgroundColor: 'rgba(0,0,0,0.05)',
      marginRight: 8,
    },
    selectedSymptomTag: {
      backgroundColor: Colors.light.tint,
    },
    symptomTagText: {
      fontSize: 14,
      fontWeight: '500',
    },
    selectedSymptomTagText: {
      color: '#FFFFFF',
    },
  
    // Mood Selector Styles
    moodContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 12,
      padding: 8,
    },
    moodButton: {
      alignItems: 'center',
      padding: 12,
      borderRadius: 12,
      backgroundColor: 'rgba(0,0,0,0.05)',
      minWidth: 80,
    },
    selectedMoodButton: {
      backgroundColor: Colors.light.tint,
    },
    moodText: {
      marginTop: 4,
      fontSize: 12,
      textAlign: 'center',
    },
    selectedMoodText: {
      color: '#FFFFFF',
    },
  
    // Notes Input Styles
    notesInput: {
      borderRadius: 12,
      padding: 12,
      backgroundColor: 'rgba(0,0,0,0.05)',
      height: 100,
      textAlignVertical: 'top',
      fontSize: 16,
    },
  
    // Log Button Styles
    logButton: {
      backgroundColor: Colors.light.tint,
      borderRadius: 12,
      padding: 16,
      alignItems: 'center',
      marginTop: 16,
      marginBottom: 32,
    },
    logButtonText: {
      color: '#FFFFFF',
      fontSize: 16,
      fontWeight: '600',
    },
  
    // Calendar Styles
    calendarContainer: {
      marginBottom: 24,
      borderRadius: 12,
      overflow: 'hidden',
    },
    calendarHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: 12,
      backgroundColor: 'rgba(0,0,0,0.02)',
    },
    calendarHeaderText: {
      fontSize: 16,
      fontWeight: '600',
    },
    calendarDay: {
      width: 40,
      height: 40,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 20,
    },
    calendarDayText: {
      fontSize: 14,
    },
    selectedDay: {
      backgroundColor: Colors.light.tint,
    },
    selectedDayText: {
      color: '#FFFFFF',
    },
  
    // Chart Styles
    chartContainer: {
      marginVertical: 16,
      padding: 16,
      borderRadius: 12,
      backgroundColor: 'rgba(0,0,0,0.02)',
    },
    chartTitle: {
      fontSize: 16,
      fontWeight: '600',
      marginBottom: 12,
    },
    
    // List Item Styles
    listItem: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 16,
      borderRadius: 12,
      backgroundColor: 'rgba(0,0,0,0.05)',
      marginBottom: 8,
    },
    listItemContent: {
      flex: 1,
      marginLeft: 12,
    },
    listItemTitle: {
      fontSize: 16,
      fontWeight: '500',
      marginBottom: 4,
    },
    listItemSubtitle: {
      fontSize: 14,
      opacity: 0.6,
    },
  
    // Modal Styles
    modal: {
      margin: 20,
      backgroundColor: 'white',
      borderRadius: 20,
      padding: 20,
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5,
    },
    modalTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      marginBottom: 16,
    },
    modalButton: {
      borderRadius: 12,
      padding: 12,
      elevation: 2,
      marginTop: 16,
    },
    modalButtonText: {
      color: 'white',
      fontWeight: 'bold',
      textAlign: 'center',
    },
  
    // Error States
    errorContainer: {
      padding: 16,
      borderRadius: 12,
      backgroundColor: 'rgba(254, 202, 202, 0.2)',
      marginBottom: 16,
    },
    errorText: {
      color: '#DC2626',
      fontSize: 14,
    },
  
    // Loading States
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    loadingText: {
      marginTop: 12,
      fontSize: 16,
      opacity: 0.6,
    }
  });