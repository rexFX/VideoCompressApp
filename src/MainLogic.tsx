import React, { useState, useRef } from 'react';
import { Text, Button, useTheme, TouchableRipple } from 'react-native-paper';
import { View } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Video, ResizeMode } from 'expo-av';
import VideoPlayer from './components/VideoPlayer';

interface Props {
  darkMode: boolean;
}

const MainLogic: React.FC<Props> = ({ darkMode }) => {
  const theme = useTheme();
  const [video, setVideo] = useState<ImagePicker.ImagePickerResult>(null);

  const videoRemover = () => {
    setVideo(null);
  };

  const pickVideo = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      quality: 1,
    });

    if (!result.canceled) {
      setVideo(result);
    }
  };

  return (
    <View
      style={{
        width: '100%',
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      {video ? (
        <VideoPlayer videoRemover={videoRemover} videoFile={video} />
      ) : (
        <TouchableRipple
          centered={true}
          style={{
            padding: 50,
            width: '80%',
            backgroundColor: darkMode ? '#202020' : '#edede9',
            borderRadius: 10,
            borderWidth: 1,
            borderColor: theme.colors.outline,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: 40,
          }}
          onPress={pickVideo}>
          <Text style={{ fontFamily: 'Poppins_400Regular' }}>Select Video</Text>
        </TouchableRipple>
      )}
    </View>
  );
};

export default MainLogic;
