import { useCallback, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { PaperProvider, Text, MD3DarkTheme, MD3LightTheme, Button } from 'react-native-paper';
import { Feather } from '@expo/vector-icons';
import { useFonts, Poppins_400Regular, Poppins_700Bold } from '@expo-google-fonts/poppins';
import { NotoSans_400Regular } from '@expo-google-fonts/noto-sans';
import * as SplashScreen from 'expo-splash-screen';
import MainLogic from './src/MainLogic';

SplashScreen.preventAutoHideAsync().catch((error) => {});

const App = () => {
  const [darkMode, setDarkMode] = useState<boolean>(true);

  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_700Bold,
    NotoSans_400Regular,
  });

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync().catch((error) => {});
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  const theme = darkMode ? MD3DarkTheme : MD3LightTheme;

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <PaperProvider theme={theme}>
      <SafeAreaProvider onLayout={onLayoutRootView}>
        <StatusBar style="light" backgroundColor="black" />
        <SafeAreaView
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-start',
            alignItems: 'center',
            flex: 1,
            backgroundColor: theme.colors.background,
          }}>
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'flex-end',
              alignItems: 'center',
              height: 50,
              width: '100%',
            }}>
            <Button mode="text" dark={darkMode} style={{ marginRight: 10 }} onPress={toggleDarkMode}>
              {darkMode ? (
                <Feather name="sun" size={20} color={theme.colors.primary} />
              ) : (
                <Feather name="moon" size={20} color={theme.colors.primary} />
              )}
            </Button>
          </View>
          <Text
            style={{
              marginTop: 20,
              fontFamily: 'Poppins_700Bold',
              fontSize: 16,
            }}>
            Video Compression
          </Text>
          <MainLogic darkMode={darkMode} />
        </SafeAreaView>
      </SafeAreaProvider>
    </PaperProvider>
  );
};

export default App;
