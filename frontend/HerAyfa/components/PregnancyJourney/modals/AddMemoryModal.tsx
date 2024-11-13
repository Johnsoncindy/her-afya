import { useState } from "react";
import { Memory } from "../types";
import { Alert, Image, Modal, Pressable, TextInput, useColorScheme, StyleSheet } from "react-native";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import * as ImagePicker from "expo-image-picker";
import HeartLoading from "@/components/HeartLoading";
import { Colors } from "@/constants/Colors";
import { Platform } from "react-native";

interface AddMemoryModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (memory: Memory) => void;
}

export const AddMemoryModal = ({
  visible,
  onClose,
  onSubmit,
}: AddMemoryModalProps) => {
  const [type, setType] = useState<Memory["type"]>("note");
  const [content, setContent] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      let newFile = {
        uri: result.assets[0].uri,
        type: `file/${result.assets[0].uri.split(".")[1]}`,
        name: `file.${result.assets[0].uri.split(".")[1]}`,
      };
      uploadToCloud(newFile);
    }
  };

  const uploadToCloud = (image: any) => {
    setLoading(true);
    const data = new FormData();
    data.append("file", image);
    data.append("upload_preset", "Eventify");
    data.append("cloud_name", "dl43pywkr");

    fetch("https://api.cloudinary.com/v1_1/dl43pywkr/image/upload", {
      method: "POST",
      body: data,
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to upload image to cloud");
        }
        return res.json();
      })
      .then((data) => {
        setImage(data.secure_url);
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        Alert.alert(
          "Upload Error",
          "Failed to upload image. Please try again.",
          [{ text: "OK", onPress: () => setImage(null) }]
        );
      });
  };

  const handleSubmit = async () => {
    if (type === 'photo' && !image) {
      Alert.alert('Error', 'Please select an image');
      return;
    }
  
    if (!content.trim()) {
      Alert.alert('Error', 'Please add a description');
      return;
    }
  
    onSubmit({
      id: "",
      date: new Date(),
      type,
      content,
      mediaUrl: image || '',
    });
    handleClose();
  };

  const handleClose = () => {
    setType('note');
    setContent('');
    setImage(null);
    onClose();
  };

  const dynamicStyles = {
    modalContent: {
      backgroundColor: isDark ? Colors.dark.background : Colors.light.background,
    },
    text: {
      color: isDark ? Colors.dark.text : Colors.light.text,
    },
    input: {
      backgroundColor: isDark ? '#2C2C2E' : '#E5E7EB',
      color: isDark ? Colors.dark.text : Colors.light.text,
    },
    typeButton: {
      backgroundColor: isDark ? '#2C2C2E' : '#E5E7EB',
    },
    imageButton: {
      backgroundColor: isDark ? '#2C2C2E' : '#E5E7EB',
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <ThemedView style={styles.modalContainer}>
        <ThemedView style={[styles.modalContent, dynamicStyles.modalContent]}>
          <ThemedText style={[styles.modalTitle, dynamicStyles.text]}>
            Add Memory
          </ThemedText>

          <ThemedView style={styles.typeSelector}>
            {["note", "photo", "milestone"].map((memoryType) => (
              <Pressable
                key={memoryType}
                style={[
                  styles.typeButton,
                  dynamicStyles.typeButton,
                  type === memoryType && {
                    backgroundColor: isDark ? Colors.dark.tint : Colors.light.tint,
                  },
                ]}
                onPress={() => setType(memoryType as Memory["type"])}
              >
                <ThemedText
                  style={[
                    styles.typeButtonText,
                    type === memoryType && styles.selectedTypeText,
                    !type && dynamicStyles.text,
                  ]}
                >
                  {memoryType.charAt(0).toUpperCase() + memoryType.slice(1)}
                </ThemedText>
              </Pressable>
            ))}
          </ThemedView>

          {type === "photo" && (
            <Pressable
              style={[styles.imageButton, dynamicStyles.imageButton]}
              onPress={pickImage}
            >
              {loading ? (
                <HeartLoading />
              ) : image ? (
                <Image source={{ uri: image }} style={styles.selectedImage} />
              ) : (
                <ThemedText style={[styles.imageButtonText, dynamicStyles.text]}>
                  Select Image
                </ThemedText>
              )}
            </Pressable>
          )}

          <TextInput
            style={[styles.input, styles.contentInput, dynamicStyles.input]}
            value={content}
            onChangeText={setContent}
            placeholder="Write your memory..."
            placeholderTextColor={isDark ? '#666' : '#9CA3AF'}
            multiline
            selectionColor={isDark ? Colors.dark.tint : Colors.light.tint}
          />

          <ThemedView style={styles.buttonContainer}>
            <Pressable
              style={[styles.actionButton, styles.cancelButton]}
              onPress={handleClose}
            >
              <ThemedText style={styles.buttonText}>Cancel</ThemedText>
            </Pressable>
            <Pressable
              style={[
                styles.actionButton,
                { backgroundColor: isDark ? Colors.dark.tint : Colors.light.tint },
                loading && styles.disabledButton,
              ]}
              onPress={handleSubmit}
              disabled={loading}
            >
              <ThemedText style={styles.buttonText}>
                {loading ? <HeartLoading /> : "Save"}
              </ThemedText>
            </Pressable>
          </ThemedView>
        </ThemedView>
      </ThemedView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  typeSelector: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 20,
  },
  typeButton: {
    flex: 1,
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  typeButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  selectedTypeText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  imageButton: {
    height: 200,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    overflow: 'hidden',
  },
  selectedImage: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
  },
  imageButtonText: {
    fontSize: 16,
    opacity: 0.7,
  },
  input: {
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    marginBottom: 20,
  },
  contentInput: {
    minHeight: 120,
    textAlignVertical: 'top',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    marginTop: 20,
    marginBottom: Platform.OS === 'ios' ? 30 : 20,
  },
  actionButton: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#3A3A3C',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  disabledButton: {
    opacity: 0.5,
  },
});