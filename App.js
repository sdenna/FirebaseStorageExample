import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Button, Image, Platform } from 'react-native';

import { StyleSheet, Text, TouchableHighlight, View } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

export default function App() {

  const [image, setImage] = useState(null);

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <Text>Upload an image</Text>
      <TouchableHighlight onPress={() =>alert('clicked')}>
        <Text>Select</Text>
      </TouchableHighlight>

      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Button title="Pick an image from camera roll" onPress={pickImage} />
      {image && <Image source={{ uri: image }} style={{ width: 400, height: 300 }} />}
    </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
