import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Image, 
         Button, ActivityIndicator } from 'react-native'
import React, {useState} from 'react'
import * as ImagePicker from 'expo-image-picker';

import {firebase} from '../config/firebase';

export default function UploadScreen () {
    const [image, setImage] = useState(null);
    const [uploading, setUploading] = useState(false);
    
    const pickImage = async () => {
        // no permissions request is necessary for launching the image library
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });


        console.log(result.assets);

        if (!result.canceled) {
            setImage(result.assets[0].uri)  // new code:
        }
    };


    // New version of this method from a different tutorial
    // https://dev.to/adii9/uploading-images-to-firebase-storage-in-react-native-with-expo-workflow-24kj

    const uploadImage = async () => {
        const blob = await new Promise((resolve, reject) => {
          const xhr = new XMLHttpRequest();
          xhr.onload = function() {
            resolve(xhr.response);
          };
          xhr.onerror = function() {
            reject(new TypeError('Network request failed'));
          };
          xhr.responseType = 'blob';
          xhr.open('GET', image, true);
          xhr.send(null);
        })
        
        // tutorial has this reference, but this will always replace the image
        // const ref = firebase.storage().ref().child(`Pictures/Image1`)

        // this method will give a unique name to each image based on date stamp
        const ref = firebase.storage().ref().child(`Pictures/`+ (new Date().toISOString()))
        const snapshot = ref.put(blob)
        snapshot.on(firebase.storage.TaskEvent.STATE_CHANGED,
          ()=>{
            setUploading(true)
          },
          (error) => {
            setUploading(false)
            console.log(error)
            blob.close()
            return 
          },
          () => {
            snapshot.snapshot.ref.getDownloadURL().then((url) => {
              setUploading(false)
              // This could be saved into a variable if wanted to use it for something else
              console.log("Download URL: ", url)
              setImage(url)
              blob.close()
              return url
            })
          }
          )
      }


  return (
    <SafeAreaView style={styles.container}>

        <TouchableOpacity style={styles.selectButton} onPress={pickImage}>
            <Text style={styles.buttonText}>Pick an image</Text>
        </TouchableOpacity>
        <View style={styles.imageContainer}>
            {image && <Image source={{uri:image}} style={styles.image}/>}

            {/* // the upload button doesn't have the styles - it is because it is a basic Button */}

            {!uploading ? <Button title='Upload Image'  onPress={uploadImage} /> : 
                          <ActivityIndicator size={'small'} color='black' />}

        </View>
    </SafeAreaView>
  )
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '90%',
        alignItems: 'center',
        marginTop: 25,
        backgroundColor: 'grey',
        justifyContent: 'center'
    },
    selectButton: {
        borderRadius: 5,
        width: 150,
        height: 50,
        backgroundColor: 'blue',
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',

    },
    uploadButton: {
        borderRadius: 5,
        width: 150,
        height: 50,
        backgroundColor: 'red',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 30,
    },
    imageContainer: {
        marginTop: 30,
        marginBottom: 50,
        alignItems: 'center'
    }, 
    image: {
        width:300, 
        height:225,
        marginBottom: 30,
    }

})