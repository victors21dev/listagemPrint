import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { auth, db } from "../../firebase/config";
import { doc, setDoc } from "firebase/firestore";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../../../App";

export default function CompleteProfileScreen() {
  const [nome, setNome] = useState("");
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const handleSalvar = async () => {
    const user = auth.currentUser;

    if (!user) {
      Alert.alert("Erro", "Usuário não autenticado.");
      return;
    }

    if (!nome.trim()) {
      Alert.alert("Erro", "Informe seu nome completo.");
      return;
    }

    try {
      const userRef = doc(db, "users", user.uid);
      await setDoc(userRef, { nome });
      navigation.replace("Tabs");
    } catch (error: any) {
      Alert.alert("Erro ao salvar", error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Complete seu perfil</Text>
      <TextInput
        style={styles.input}
        placeholder="Nome completo"
        value={nome}
        onChangeText={setNome}
      />
      <TouchableOpacity style={styles.button} onPress={handleSalvar}>
        <Text style={styles.buttonText}>Salvar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: "center" },
  title: { fontSize: 22, marginBottom: 20, textAlign: "center" },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    padding: 10,
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#005CB3",
    padding: 12,
    borderRadius: 6,
    alignItems: "center",
  },
  buttonText: { color: "#fff", fontSize: 16 },
});
