import React from 'react';
import {
  Modal,
  View,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  TouchableWithoutFeedback,
} from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from 'react-native';
import { 
  AlertCircle,
  AlertTriangle,
  HelpCircle,
  Info,
  CheckCircle2,
  type LucideIcon
} from 'lucide-react-native';

type AlertType = 'info' | 'success' | 'warning' | 'error' | 'question';

interface AlertButton {
  text: string;
  onPress: () => void;
  style?: 'default' | 'cancel' | 'destructive';
  icon?: LucideIcon;
}

interface AlertDialogProps {
  visible: boolean;
  title: string;
  message?: string;
  buttons: AlertButton[];
  onDismiss: () => void;
  type?: AlertType;
}

const getAlertIcon = (type: AlertType, color: string) => {
  const iconProps = {
    size: 32,
    color,
    strokeWidth: 1.5
  };

  switch (type) {
    case 'success':
      return <CheckCircle2 {...iconProps} />;
    case 'warning':
      return <AlertTriangle {...iconProps} />;
    case 'error':
      return <AlertCircle {...iconProps} />;
    case 'question':
      return <HelpCircle {...iconProps} />;
    case 'info':
    default:
      return <Info {...iconProps} />;
  }
};

const getAlertColor = (type: AlertType, colors: any) => {
  switch (type) {
    case 'success':
      return '#4CAF50';
    case 'warning':
      return '#FF9800';
    case 'error':
      return '#F44336';
    case 'question':
      return colors.tint;
    case 'info':
    default:
      return colors.tint;
  }
};

export const AlertDialog: React.FC<AlertDialogProps> = ({
  visible,
  title,
  message,
  buttons,
  onDismiss,
  type = 'info'
}) => {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const alertColor = getAlertColor(type, colors);

  const getButtonStyle = (style?: string) => {
    switch (style) {
      case 'cancel':
        return { color: colors.text };
      case 'destructive':
        return { color: '#FF3B30' };
      default:
        return { color: alertColor };
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onDismiss}
    >
      <TouchableWithoutFeedback onPress={onDismiss}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View style={[
              styles.dialogContainer, 
              { backgroundColor: colors.background }
            ]}>
              <View style={[styles.iconContainer, { backgroundColor: `${alertColor}15` }]}>
                {getAlertIcon(type, alertColor)}
              </View>

              <View style={styles.contentContainer}>
                <ThemedText style={styles.title}>{title}</ThemedText>
                {message && (
                  <ThemedText style={styles.message}>{message}</ThemedText>
                )}
              </View>
              
              <View style={[
                styles.buttonContainer, 
                buttons.length > 2 && styles.verticalButtons,
                { borderTopColor: colors.tabIconDefault }
              ]}>
                {buttons.map((button, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.button,
                      buttons.length > 2 && styles.fullWidthButton,
                      index < buttons.length - 1 && [
                        styles.buttonBorder,
                        { borderRightColor: colors.tabIconDefault }
                      ],
                      { borderTopColor: colors.tabIconDefault }
                    ]}
                    onPress={() => {
                      button.onPress();
                      onDismiss();
                    }}
                  >
                    <View style={styles.buttonContent}>
                      {button.icon && (
                        <View style={styles.buttonIconContainer}>
                          {React.createElement(button.icon, {
                            size: 20,
                            color: getButtonStyle(button.style).color,
                            strokeWidth: 1.5
                          })}
                        </View>
                      )}
                      <ThemedText
                        style={[
                          styles.buttonText,
                          getButtonStyle(button.style),
                        ]}
                      >
                        {button.text}
                      </ThemedText>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dialogContainer: {
    width: Dimensions.get('window').width * 0.85,
    borderRadius: 20,
    overflow: 'hidden',
  },
  iconContainer: {
    paddingVertical: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  contentContainer: {
    padding: 20,
    paddingTop: 0,
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 8,
  },
  message: {
    fontSize: 15,
    textAlign: 'center',
    opacity: 0.8,
    lineHeight: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  verticalButtons: {
    flexDirection: 'column',
  },
  button: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonIconContainer: {
    marginRight: 8,
  },
  fullWidthButton: {
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  buttonBorder: {
    borderRightWidth: StyleSheet.hairlineWidth,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '500',
  },
});
