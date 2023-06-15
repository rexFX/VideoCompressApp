import React, { useRef, useState, useEffect } from 'react';
import { View } from 'react-native';
import { Button } from 'react-native-paper';
import { Video, ResizeMode, AVPlaybackStatus } from 'expo-av';
import { ImagePickerResult } from 'expo-image-picker';
import Results from './Results';

interface Props {
  videoRemover: () => void;
  videoFile: ImagePickerResult;
}

const VideoPlayer: React.FC<Props> = ({ videoRemover, videoFile }) => {
  const videoRef = useRef<Video>(null);
  const [status, setStatus] = useState<any>({});

  useEffect(() => {
    videoRef.current.loadAsync({
      uri: videoFile.assets[0].uri,
    });
  }, []);

  return (
    <View style={{ marginTop: 40, flex: 1 }}>
      <View
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'black',
        }}>
        <Video
          ref={videoRef}
          style={{ alignSelf: 'center', width: 320, height: 200 }}
          resizeMode={ResizeMode.CONTAIN}
          useNativeControls
          onPlaybackStatusUpdate={(status: any) => {
            setStatus(() => status);
          }}
        />
      </View>
      <View
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-around',
          alignItems: 'center',
        }}>
        <Button
          mode="elevated"
          icon={status.isPlaying ? 'pause-circle-outline' : 'play-circle-outline'}
          onPress={() => (status.isPlaying ? videoRef.current.pauseAsync() : videoRef.current.playAsync())}>
          {status.isPlaying ? 'Pause' : 'Play'}
        </Button>
        <Button mode="elevated" icon="trash-can-outline" onPress={videoRemover}>
          Remove
        </Button>
      </View>

      <Results />
    </View>
  );
};

export default VideoPlayer;
