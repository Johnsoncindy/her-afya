import { Colors } from "@/constants/Colors";
import { StyleSheet} from "react-native";


export const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: Colors.dark.background,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    paddingBottom: 40,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#333',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    minHeight: 48,
    color: Colors.dark.text,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  categoriesList: {
    flexDirection: 'column',
    gap: 8,
  },
  categoryButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: '#333',
  },
  selectedCategory: {
    backgroundColor: Colors.light.tint,
  },
  categoryText: {
    fontSize: 16,
    color: '#fff',
  },
  selectedCategoryText: {
    fontWeight: '600',
  },
  dateButton: {
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#333',
    marginTop: 8,
  },
  dateText: {
    fontSize: 16,
    textAlign: 'center',
    color: '#fff',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    marginTop: 24,
  },
  actionButton: {
    flex: 1,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#666',
  },
  submitButton: {
    backgroundColor: Colors.light.tint,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
    picker: {
      marginBottom: 16,
    },
    typeSelector: {
      flexDirection: 'row',
      marginBottom: 16,
    },
    typeButton: {
      flex: 1,
      padding: 8,
      borderRadius: 8,
      marginHorizontal: 4,
      backgroundColor: 'rgba(0,0,0,0.05)',
    },
    typeText: { 
      textAlign: 'center',
      color: "white",
      fontSize: 14,
      fontWeight: '500',
    },
    selectedType: {
      backgroundColor: Colors.light.tint,
    },
    imageButton: {
      height: 200,
      borderRadius: 8,
      backgroundColor: 'rgba(0,0,0,0.05)',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 16,
    },
    imageButtonText: {  // Added missing style
      fontSize: 16,
      color: "white",
      opacity: 0.7,
    },
    selectedImage: {
      width: '100%',
      height: '100%',
      borderRadius: 8,
    },
    disabledButton: {
      opacity: 0.5,
    },
    severityContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 16,
    },
    severityButton: {
      flex: 1,
      padding: 12,
      borderRadius: 8,
      backgroundColor: 'rgba(0,0,0,0.05)',
      marginHorizontal: 4,
      alignItems: 'center',
    },
    severityButtonSelected: {
      backgroundColor: Colors.light.tint,
    },
    severityText: {
      fontSize: 14,
      fontWeight: '500',
    },
    label: {
      fontSize: 16,
      marginBottom: 8,
      opacity: 0.8,
    },
    contentInput: {
      minHeight: 100,
      textAlignVertical: 'top',
    },
    categoryContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 8,
      marginBottom: 16,
    },
});