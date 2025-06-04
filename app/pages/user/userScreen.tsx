import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { LogOut } from "lucide-react-native";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../../../App"; // ajuste o caminho conforme necessário

export default function UserScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const handleLogout = () => {
    // Aqui você pode adicionar limpeza de dados (ex: AsyncStorage)
    navigation.replace("Login"); // substitui a stack atual e evita voltar com o botão de hardware
  };

  return (
    <View style={styles.container}>
      <View style={styles.profileContainer}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>VS</Text>
        </View>
        <View style={styles.userInfo}>
          <Text style={styles.userName}>Victor Santos</Text>
          <Text style={styles.userEmail}>santos.victors2000@gmail.com</Text>
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
