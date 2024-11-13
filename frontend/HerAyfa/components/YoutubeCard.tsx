import { StyleSheet, Pressable, Dimensions, Image } from 'react-native';
import YoutubePlayer from 'react-native-youtube-iframe';
import { useState, useCallback } from 'react';
import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.7;

type VideoContentCardProps = {
  id: string,
  title: string;
  category: string;
  duration: string;
  videoUrl: string;
  thumbnailUrl?: string;
  type?: string;
  description?: string;
  content?: string;
  image?: string

};

const getYouTubeVideoId = (url: string): string => {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : '';
};

export const VideoContentCard: React.FC<VideoContentCardProps> = ({
  id,
  title,
  category,
  duration,
  videoUrl,
  thumbnailUrl
}) => {
  const [playing, setPlaying] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const isLight = colorScheme === 'light';
  const videoId = getYouTubeVideoId(videoUrl);

  const onStateChange = useCallback((state: string) => {
    if (state === 'ended') {
      setPlaying(false);
      setShowVideo(false);
    }
  }, []);

  const handlePress = () => {
    setShowVideo(true);
    setPlaying(true);   
  };

  return (
    <Pressable onPress={handlePress}>
      <ThemedView
        style={[
          styles.contentCard,
          {
            backgroundColor: colors.background,
            borderColor: colors.tabIconDefault,
            borderWidth: !isLight ? 1 : 0,
          },
        ]}
      >
        <ThemedView style={styles.videoContainer}>
          {showVideo ? (
            <YoutubePlayer
              height={160}
              width={CARD_WIDTH}
              play={playing}
              videoId={videoId}
              onChangeState={onStateChange}
            />
          ) : (
            <ThemedView
              style={[
                styles.thumbnailContainer,
                {
                  backgroundColor: colors.tabIconDefault + '20',
                },
              ]}
            >
              {thumbnailUrl ? (
                <Image
                  source={{ uri: thumbnailUrl }}
                  style={styles.thumbnail}
                  resizeMode="cover"
                />
              ) : null}
              <TabBarIcon name="play-circle" color={colors.tint} size={40} />
            </ThemedView>
          )}
        </ThemedView>
        <ThemedView style={styles.contentInfo}>
          <ThemedText
            style={[styles.contentCategory, { color: colors.tabIconDefault }]}
          >
            {category}
          </ThemedText>
          <ThemedText style={styles.contentTitle}>{title}</ThemedText>
          <ThemedText
            style={[styles.contentDuration, { color: colors.tabIconDefault }]}
          >
            {duration}
          </ThemedText>
        </ThemedView>
      </ThemedView>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  contentCard: {
    width: CARD_WIDTH,
    marginRight: 16,
    borderRadius: 12,
    overflow: 'hidden',
  },
  videoContainer: {
    height: 160,
    width: CARD_WIDTH,
  },
  thumbnailContainer: {
    height: 160,
    justifyContent: 'center',
    alignItems: 'center',
  },
  thumbnail: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  contentInfo: {
    padding: 12,
  },
  contentCategory: {
    fontSize: 12,
    opacity: 0.7,
    marginBottom: 4,
  },
  contentTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  contentDuration: {
    fontSize: 12,
    opacity: 0.7,
  },
});
