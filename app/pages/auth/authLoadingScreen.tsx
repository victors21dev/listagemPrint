import React, { useEffect } from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../../../App";

export default function AuthLoadingScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  useEffect(() => {
    const checkLogin = async () => {
      const user = await AsyncStorage.getItem("user");
      if (user) {
        navigation.replace("Tabs");
      } else {
        navigation.replace("Login");
      }
    };
    checkLogin();
  }, []);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#007bff" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
});