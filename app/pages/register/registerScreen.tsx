import React from "react";
import { useState } from "react";

import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert
} from "react-native";

import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../../../App";
import { auth } from "../../firebase/config";
import { createUserWithEmailAndPassword } from "firebase/auth";

export default function RegisterScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");

  const handleRegister = async () => {
    if (!email || !senha || !confirmarSenha) {
      Alert.alert("Registro","Preencha todos os campos");
      return;
    }

    if (senha !== confirmarSenha) {
      Alert.alert("Problema na senha","As senhas não coincidem");
      return;
    }

    try {
      await createUserWithEmailAndPassword(auth, email, senha);
      Alert.alert("Tudo certo!","Cadastro realizado com sucesso!");
      navigation.replace("Login");
    } catch (error: any) {
      console.error(error);
      Alert.alert("Algo deu errado!","Erro ao cadastrar: " + error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cadastro</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Senha"
        secureTextEntry
        value={senha}
        onChangeText={setSenha}
      />
      <TextInput
        style={styles.input}
        placeholder="Repetir senha"
        secureTextEntry
        value={confirmarSenha}
        onChangeText={setConfirmarSenha}
      />

      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>Salvar Registro</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.buttonOut}
        onPress={() => {
          navigation.replace("Login");
        }}
      >
        <Text style={styles.buttonText}>Voltar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 80,
    paddingHorizontal: 30,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 40,
    textAlign: "center",
  },
  input: {
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 15,
    paddingHorizontal: 15,
  },
  button: {
    backgroundColor: "#28a745",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  buttonOut: {
    backgroundColor: "#d30000",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
});
