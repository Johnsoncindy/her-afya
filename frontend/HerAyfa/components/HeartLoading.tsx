import React, { useEffect } from 'react';
import { View, StyleSheet, Animated, Easing } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';


const HeartLoading = ({ size = 28, color = "#FF4B4B" }) => {
  // Create animated value for scaling
  const scaleValue = new Animated.Value(1);
  
  // Create animated value for opacity
  const opacityValue = new Animated.Value(1);

  useEffect(() => {
    // Create heartbeat animation sequence
    const heartbeatSequence = Animated.sequence([
      // First beat - quick expansion
      Animated.parallel([
        Animated.timing(scaleValue, {
          toValue: 1.2,
          duration: 150,
          easing: Easing.ease,
          useNativeDriver: true,
        }),
        Animated.timing(opacityValue, {
          toValue: 0.8,
          duration: 150,
          easing: Easing.ease,
          useNativeDriver: true,
        })
      ]),
      // Quick contraction
      Animated.parallel([
        Animated.timing(scaleValue, {
          toValue: 1,
          duration: 150,
          easing: Easing.ease,
          useNativeDriver: true,
        }),
        Animated.timing(opacityValue, {
          toValue: 1,
          duration: 150,
          easing: Easing.ease,
          useNativeDriver: true,
        })
      ]),
      // Small pause
      Animated.delay(200),
      // Second beat - quick expansion
      Animated.parallel([
        Animated.timing(scaleValue, {
          toValue: 1.2,
          duration: 150,
          easing: Easing.ease,
          useNativeDriver: true,
        }),
        Animated.timing(opacityValue, {
          toValue: 0.8,
          duration: 150,
          easing: Easing.ease,
          useNativeDriver: true,
        })
      ]),
      // Quick contraction
      Animated.parallel([
        Animated.timing(scaleValue, {
          toValue: 1,
          duration: 150,
          easing: Easing.ease,
          useNativeDriver: true,
        }),
        Animated.timing(opacityValue, {
          toValue: 1,
          duration: 150,
          easing: Easing.ease,
          useNativeDriver: true,
        })
      ]),
      // Longer pause before next iteration
      Animated.delay(1000),
    ]);

    // Loop the animation
    Animated.loop(heartbeatSequence).start();

    // Cleanup on unmount
    return () => {
      heartbeatSequence.stop();
    };
  }, );

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.heartContainer,
          {
            transform: [{ scale: scaleValue }],
            opacity: opacityValue,
          },
        ]}
      >
      <FontAwesome5 name="heartbeat" size={size} color={color} />
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  heartContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default HeartLoading;