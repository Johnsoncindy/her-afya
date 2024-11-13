/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const tintColorLight = '#0a7ea4';
const tintColorDark = '#40E0D0';

export const Colors = {
  light: {
    text: '#333D43',
    background: '#F2F0EF',
    tint: tintColorLight,
    secondary: '#F4A261',
    icon: '#4A5568',
    tabIconDefault: '#687076',
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: '#ECEDEE',
    background: '#1B1F23',
    tint: tintColorDark,
    secondary: '#E76F51',
    icon: '#A0AEC0',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
  },
};
