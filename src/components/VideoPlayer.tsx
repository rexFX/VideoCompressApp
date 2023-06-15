import React, { useRef, useState, useEffect } from 'react';
import { View } from 'react-native';
import { Button, Text, ProgressBar } from 'react-native-paper';
import { Video as VideoPlayback, ResizeMode } from 'expo-av';
import { ImagePickerResult } from 'expo-image-picker';
import { Video, getVideoMetaData } from 'react-native-compressor';
import Results from './Results';

interface Props {
  videoRemover: () => void;
  videoFile: ImagePickerResult;
}

const VideoPlayer: React.FC<Props> = ({ videoRemover, videoFile }) => {
  const videoRef = useRef<VideoPlayback>(null);
  const [status, setStatus] = useState<any>({});
  const [error, setError] = useState<string>('');
  const [compressError, setCompressError] = useState<string>('');
  const [progress, setProgress] = useState<number>(0);
  const [start, setStart] = useState<boolean>(false);
  const [cancellationID, setCancellationID] = useState<string>('');
  const [originalSize, setOriginalSize] = useState<number>(0);
  const [finalSizeAndLocation, setFinalSizeAndLocation] = useState<{
    location: string;
    size: number;
  }>({
    location: '',
    size: 0,
  });

  const compressionHandler = async () => {
    if (cancellationID.length > 0) {
      Video.cancelCompression(cancellationID);
      setProgress(0);
      setStart(false);
      setCancellationID('');
      return;
    }

    if (videoFile.assets[0].type === 'video') {
      setProgress(0);
      setCompressError('');
      setStart(true);
      try {
        const result = await Video.compress(
          videoFile.assets[0].uri,
          {
            compressionMethod: 'auto',
            minimumFileSizeForCompress: 0,
            getCancellationId: (id: string) => {
              setCancellationID(id);
            },
          },
          (progress) => {
            setProgress(progress);
          },
        );

        await getVideoMetaData(videoFile.assets[0].uri).then((res) => {
          setOriginalSize(res.size);
        });
        await getVideoMetaData('file:///' + result.split('file://')[1]).then((res: { size: number }) => {
          setFinalSizeAndLocation({
            location: result,
            size: res.size,
          });
          setCompressError('');
          setProgress(0);
          setStart(false);
          setCancellationID('');
        });
      } catch (err) {
        setProgress(0);
        setStart(false);
        setCancellationID('');
        setCompressError(err);
      }
    }
  };

  useEffect(() => {
    if (videoFile.assets[0].type !== 'video') {
      setError('Wrong file type');
    }

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
        <VideoPlayback
          ref={videoRef}
          style={{ alignSelf: 'center', width: 320, height: 200 }}
          resizeMode={ResizeMode.CONTAIN}
          useNativeControls
          onPlaybackStatusUpdate={(status: any) => {
            setStatus(() => status);
          }}
        />
      </View>
      {error.length > 0 ? (
        <>
          <Text style={{ color: 'red', fontFamily: 'NotoSans_400Regular' }}>{error}</Text>
          <Button mode="elevated" icon="trash-can-outline" onPress={videoRemover}>
            Go Back
          </Button>
        </>
      ) : (
        <>
          <View
            style={{
              width: '100%',
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-evenly',
              alignItems: 'center',
              marginVertical: 20,
            }}>
            {compressError.length > 0 && <Text>{compressError}</Text>}
            <Button
              mode="elevated"
              icon={status.isPlaying ? 'pause-circle-outline' : 'play-circle-outline'}
              onPress={() => {
                if (status.isPlaying) {
                  videoRef.current.pauseAsync();
                } else if (status.didJustFinish) {
                  videoRef.current.replayAsync();
                } else {
                  videoRef.current.playAsync();
                }
              }}>
              <Text style={{ fontFamily: 'Poppins_400Regular' }}>{status.isPlaying ? 'Pause' : 'Play'}</Text>
            </Button>
            <Button
              mode="elevated"
              icon="trash-can-outline"
              onPress={() => {
                if (cancellationID.length > 0) {
                  Video.cancelCompression(cancellationID);
                }
                videoRemover();
              }}>
              <Text style={{ fontFamily: 'Poppins_400Regular' }}>Remove</Text>
            </Button>
            <Button mode="elevated" icon={start ? 'stop' : 'rocket'} onPress={compressionHandler}>
              <Text style={{ fontFamily: 'Poppins_400Regular' }}>{start ? 'Stop' : 'Start'}</Text>
            </Button>
          </View>
          {start && <ProgressBar progress={progress} color="#3498db" />}

          <Results originalSize={originalSize} finalSizeAndLocation={finalSizeAndLocation} />
        </>
      )}
    </View>
  );
};

export default VideoPlayer;
