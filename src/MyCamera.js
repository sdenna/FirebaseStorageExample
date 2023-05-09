import React, { useState, useEffect } from "react";
import { Text, View, TouchableOpacity, ImageBackground } from "react-native";
import { Camera } from "expo-camera";
import {storage} from '../config/firebase';

export default function MyCamera() {
  const [hasPermission, setHasPermission] = useState(true);
  const [previewVisible, setPreviewVisible] = useState(true);
  const [capturedImage, setCapturedImage] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.front);
  console.log(type);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

//   if (hasPermission === null) {
//     return <View />;
//   }
//   if (hasPermission === false) {
//     return <Text>No access to camera</Text>;
//   }

  const takePicture = async () => {
    if (!Camera) return;
    let photo = await Camera.takePictureAsync();
    setPreviewVisible(true);
    setCapturedImage(photo);
  };

  async function uploadImageAsync(uri) {
    const blob = await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = function () {
        resolve(xhr.response);
      };
      xhr.onerror = function (e) {
        console.log(e);
      reject(new TypeError("Network request failed"));
      };
      xhr.responseType = "blob";
      xhr.open("GET", uri, true);
      xhr.send(null);
  });

  const ref = storage.ref().child(new Date().toISOString());
  const snapshot = await ref.put(blob);
  blob.close();
 }

  return (
    <View  style={{ backgroundColor: 'red', flex: 1}}>
      {previewVisible ? (
        <ImageBackground
          source={{ uri: capturedImage && capturedImage.uri }}
          >
          <View  style={{ backgroundColor: 'blue', width: 100, height: 200}}>
             <TouchableOpacity
                onPress={() => setPreviewVisible(false)}
                style={{ width: 70, height: 100, marginTop: 10,
                         borderRadius: 4, backgroundColor: 'yellow'}}>
                <Text  style={{color: "#000", fontSize: 20}}>
                  Re-take
                </Text>
              </TouchableOpacity>
            
          </View>
        </ImageBackground>
      ) : (
        <View style = {{height: 200, backgroundColor: 'green'}}>
            <Text>Other text</Text>
            <Camera
               
            >
                <TouchableOpacity onPress={() => {
                    takePicture
                    // setType(
                    //     type === Camera.Contants.Type.back
                    //     ? Camera.Constants.Type.front
                    //     : Camera.Constants.Type.back
                    // );
                }}
                >
                    <Text style={{ fontSize: 20, marginBottom: 10, color: "white" }}>
                    {" "}
                    Flip{" "}
                    </Text>
                </TouchableOpacity>

                
              
                <TouchableOpacity
                  onPress={takePicture}
                  style={{
                    width: 200,
                    height: 400,
                    bottom: 0,
                    borderRadius: 50,
                    backgroundColor: "#dodgerblue",
                  }}
                />
            
          

            </Camera>
            </View>
      ) }
    </View>
)};
