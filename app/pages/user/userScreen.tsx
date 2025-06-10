import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { LogOut } from "lucide-react-native";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../../../App"; // ajuste o caminho conforme necessário
import { useUser } from "../../context/userContext";
import { useState, useEffect } from "react";
import { auth } from "../../firebase/config";
import { signOut } from "firebase/auth";

function gerarIniciais(nomeCompleto: string): string {
  const partes = nomeCompleto.trim().split(" ");
  if (partes.length === 0) return "";

  const primeiraLetra = partes[0][0];
  const ultimaLetra = partes[partes.length - 1][0];

  return (primeiraLetra + ultimaLetra).toUpperCase();
}

export default function UserScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  // Dados do usuário
  const { user, loading } = useUser();

  if (loading) return <Text>Carregando...</Text>;

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigation.replace("Login");
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    }
  };

  const [initialUser, setInitialUser] = useState("");
  const nameUser = user?.nome ?? "";
  
  useEffect(() => {
    if (nameUser) {
      const iniciais = gerarIniciais(nameUser);
      setInitialUser(iniciais);
    }
  }, [nameUser]);

  return (
    <View style={styles.container}>
      <View style={styles.profileContainer}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{initialUser}</Text>
        </View>
        <View style={styles.userInfo}>
          <Text style={styles.userName}>{user?.nome}</Text>
          <Text style={styles.userEmail}>{user?.email}</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.button} onPress={handleLogout}>
        <LogOut color="#fff" />
        <Text style={styles.textButton}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: "space-between",
    backgroundColor: "#fff",
  },
  profileContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 20,
    marginTop: 40,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: "#005CB3",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "bold",
  },
  userInfo: {
    flexShrink: 1,
  },
  userName: {
    fontSize: 22,
    fontWeight: "600",
    color: "#333",
  },
  userEmail: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  button: {
    backgroundColor: "#FA2A2A",
    padding: 16,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    marginBottom: 30,
  },
  textButton: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
});
