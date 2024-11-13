import React from 'react';
import { View, Text, StyleSheet, TextStyle, ViewStyle } from 'react-native';

type SectionType = 'heading' | 'paragraph' | 'list';

interface Section {
  type: SectionType;
  content: string | string[];
  level: number;
}

interface ArticleContentFormatterProps {
  content: string;
  textStyle?: TextStyle;
}

const ArticleContentFormatter: React.FC<ArticleContentFormatterProps> = ({ content, textStyle }) => {
  const cleanMarkdown = (text: string): string => {
    return text
      // Remove bold markers
      .replace(/\*\*(.*?)\*\*/g, '$1')
      // Remove italic markers
      .replace(/\*(.*?)\*/g, '$1')
      // Remove underscore italic/bold
      .replace(/_{1,2}(.*?)_{1,2}/g, '$1')
      // Remove hash symbols from headings while preserving the content
      .replace(/^#{1,6}\s+/, '')
      // Remove any remaining hash symbols
      .replace(/#/g, '')
      // Remove any remaining asterisks
      .replace(/\*/g, '')
      // Remove any remaining underscores
      .replace(/_/g, '')
      // Trim extra whitespace
      .trim();
  };

  const formatContent = (rawContent: string): Section[] => {
    const sections: Section[] = [];
    const lines = rawContent.split('\n');
    
    let currentSection: Section = {
      type: 'paragraph',
      content: [],
      level: 0
    };

    lines.forEach((line) => {
      const trimmedLine = line.trim();
      
      // Handle headings
      if (trimmedLine.startsWith('#')) {
        if (Array.isArray(currentSection.content) && currentSection.content.length) {
          sections.push({...currentSection});
          currentSection = { type: 'paragraph', content: [], level: 0 };
        }
        sections.push({
          type: 'heading',
          content: cleanMarkdown(trimmedLine),
          level: (trimmedLine.match(/^#+/) || [''])[0].length
        });
        return;
      }

      // Handle bullet points
      if (trimmedLine.startsWith('*') && trimmedLine[1] === ' ') {
        if (currentSection.type !== 'list') {
          if (Array.isArray(currentSection.content) && currentSection.content.length) {
            sections.push({...currentSection});
          }
          currentSection = { type: 'list', content: [], level: 0 };
        }
        if (Array.isArray(currentSection.content)) {
          currentSection.content.push(cleanMarkdown(trimmedLine.substring(2)));
        }
        return;
      }

      // Handle paragraphs
      if (trimmedLine !== '') {
        if (currentSection.type !== 'paragraph') {
          if (Array.isArray(currentSection.content) && currentSection.content.length) {
            sections.push({...currentSection});
          }
          currentSection = { type: 'paragraph', content: [], level: 0 };
        }
        if (Array.isArray(currentSection.content)) {
          currentSection.content.push(cleanMarkdown(trimmedLine));
        }
      } else if (Array.isArray(currentSection.content) && currentSection.content.length) {
        sections.push({...currentSection});
        currentSection = { type: 'paragraph', content: [], level: 0 };
      }
    });

    if (Array.isArray(currentSection.content) && currentSection.content.length) {
      sections.push(currentSection);
    }

    return sections;
  };

  const renderSection = (section: Section, index: number): React.ReactElement | null => {
    switch (section.type) {
      case 'heading':
        return (
          <Text key={index} style={[
            styles.heading,
            { fontSize: 28 - (section.level * 4) },
            textStyle
          ]}>
            {section.content}
          </Text>
        );
      case 'list':
        return (
          <View key={index} style={styles.listContainer}>
            {Array.isArray(section.content) && section.content.map((item, idx) => (
              <View key={idx} style={styles.listItem}>
                <Text style={[styles.bullet, textStyle]}>•</Text>
                <Text style={[styles.listItemText, textStyle]}>{item}</Text>
              </View>
            ))}
          </View>
        );
      case 'paragraph':
        return (
          <Text key={index} style={[styles.paragraph, textStyle]}>
            {Array.isArray(section.content) ? section.content.join(' ') : section.content}
          </Text>
        );
      default:
        return null;
    }
  };

  const formattedSections = formatContent(content);

  return (
    <View style={styles.container}>
      {formattedSections.map((section, index) => renderSection(section, index))}
    </View>
  );
};

interface Styles {
  container: ViewStyle;
  heading: TextStyle;
  paragraph: TextStyle;
  listContainer: ViewStyle;
  listItem: ViewStyle;
  bullet: TextStyle;
  listItemText: TextStyle;
}

const styles = StyleSheet.create<Styles>({
  container: {
    gap: 16,
  },
  heading: {
    fontWeight: 'bold',
    marginVertical: 8,
  },
  paragraph: {
    lineHeight: 24,
  },
  listContainer: {
    gap: 8,
  },
  listItem: {
    flexDirection: 'row',
    paddingLeft: 8,
  },
  bullet: {
    marginRight: 8,
  },
  listItemText: {
    flex: 1,
    lineHeight: 24,
  },
});

export default ArticleContentFormatter;
