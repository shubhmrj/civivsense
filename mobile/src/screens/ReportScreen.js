import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image, Alert } from 'react-native';
import ImagePicker from 'react-native-image-picker';
import Geolocation from 'react-native-geolocation-service';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../api';

export default function ReportScreen() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);
  const [location, setLocation] = useState(null);

  const pickImage = () => {
    ImagePicker.launchCamera({}, (resp) => {
      if (resp.didCancel) return;
      if (resp.error) {
        Alert.alert('Error', resp.error);
        return;
      }
      setImage(resp);
    });
  };

  const getLocation = () => {
    Geolocation.requestAuthorization('whenInUse').then(() => {
      Geolocation.getCurrentPosition(
        (pos) => {
          setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        },
        (err) => Alert.alert('Location Error', err.message),
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
      );
    });
  };

  const submit = async () => {
    if (!title || !description || !image || !location) {
      Alert.alert('Missing', 'Please fill all fields and capture image & location');
      return;
    }
    const phone = await AsyncStorage.getItem('userPhone');
    const body = {
      title,
      description,
      category: 'other',
      latitude: location.lat,
      longitude: location.lng,
      address: '',
      reporterPhone: phone,
      images: [image.uri]
    };
    try {
      await api.post('/reports', body);
      Alert.alert('Submitted', 'Report sent successfully');
      setTitle('');
      setDescription('');
      setImage(null);
      setLocation(null);
    } catch (e) {
      Alert.alert('Error', 'Failed to submit');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Report an Issue</Text>
      <TextInput placeholder="Title" style={styles.input} value={title} onChangeText={setTitle} />
      <TextInput
        placeholder="Description"
        style={[styles.input, { height: 80 }]}
        value={description}
        onChangeText={setDescription}
        multiline
      />
      <TouchableOpacity style={styles.button} onPress={pickImage}>
        <Text style={styles.buttonText}>{image ? 'Retake Photo' : 'Capture Photo'}</Text>
      </TouchableOpacity>
      {image && <Image source={{ uri: image.uri }} style={{ width: '100%', height: 180, marginVertical: 8 }} />}
      <TouchableOpacity style={styles.button} onPress={getLocation}>
        <Text style={styles.buttonText}>{location ? 'Location Captured' : 'Get Location'}</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.submit} onPress={submit}>
        <Text style={styles.buttonText}>Submit Report</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  heading: { fontSize: 20, fontWeight: 'bold', marginBottom: 16 },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 8, marginBottom: 12 },
  button: { backgroundColor: '#2980b9', padding: 12, borderRadius: 8, alignItems: 'center', marginBottom: 8 },
  submit: { backgroundColor: '#2ecc71', padding: 12, borderRadius: 8, alignItems: 'center', marginTop: 16 },
  buttonText: { color: 'white', fontWeight: 'bold' }
});
