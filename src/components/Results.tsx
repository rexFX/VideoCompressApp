import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import { Text, Button } from 'react-native-paper';
import * as MediaLibrary from 'expo-media-library';

interface Props {
  originalSize: number;
  finalSizeAndLocation: {
    location: string;
    size: number;
  };
}

const Results: React.FC<Props> = ({ originalSize, finalSizeAndLocation }) => {
  const [error, setError] = useState<string>('');
  const [saved, setSaved] = useState<boolean>(false);

  const saveFile = async () => {
    const uri = 'file:///' + finalSizeAndLocation.location.split('file://')[1];

    try {
      const permission = await MediaLibrary.requestPermissionsAsync();
      if (!permission.granted) {
        return;
      }

      const asset = await MediaLibrary.createAssetAsync(uri);
      MediaLibrary.createAlbumAsync('Compressed', asset, false)
        .then((res) => {
          setSaved(true);
          setError('');
        })
        .catch((err) => {
          setError(err);
        });
    } catch (err) {
      setError(err);
    }
  };

  return (
    <View
      style={{
        flex: 1,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      {originalSize > 0 && finalSizeAndLocation.size > 0 && (
        <>
          {error.length > 0 && <Text style={{ color: 'red', fontFamily: 'NotoSans_400Regular' }}>{error}</Text>}
          {saved && (
            <View
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Text
                style={{
                  fontFamily: 'NotoSans_400Regular',
                  color: 'green',
                }}>
                File created in "Compressed" album!
              </Text>
              <Text
                style={{
                  fontFamily: 'NotoSans_400Regular',
                  color: 'green',
                }}>
                Check your gallery!
              </Text>
            </View>
          )}
          <View>
            <Text style={{ marginTop: 20, fontFamily: 'NotoSans_400Regular' }}>
              Original Size: {originalSize / 1000} MB
            </Text>
            <Text style={{ fontFamily: 'NotoSans_400Regular' }}>
              Compressed Size: {finalSizeAndLocation.size / 1000} MB
            </Text>
            <Text style={{ fontFamily: 'NotoSans_400Regular' }}>
              Compression Ratio: {(originalSize / finalSizeAndLocation.size).toFixed(2)}
            </Text>
            <Text style={{ fontFamily: 'NotoSans_400Regular' }}>
              Savings: {((originalSize - finalSizeAndLocation.size) / 1000).toFixed(2)} MB
            </Text>
          </View>
          <Button
            mode="elevated"
            onPress={saveFile}
            style={{
              marginTop: 20,
            }}>
            <Text
              style={{
                fontFamily: 'Poppins_400Regular',
              }}>
              Save
            </Text>
          </Button>
        </>
      )}
    </View>
  );
};

export default Results;
