import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  FlatList,
  TouchableOpacity,
  Modal,
  Share,
} from "react-native";
import {
  Printer,
  Trash,
  Pencil,
  CirclePlus,
  Share2,
} from "lucide-react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { Picker } from "@react-native-picker/picker";
import { useCadastro } from "../../context/cadastroContext";

type TabParamList = {
  Home: undefined;
  Perfil: undefined;
};

type NavigationProp = BottomTabNavigationProp<TabParamList, "Home">;

interface Impressora {
  id: string;
  marca: string;
  modelo: string;
  setor: string;
}

export default function HomeScreen() {
  const navigation = useNavigation<NavigationProp>();
  const { modelos, setores } = useCadastro();

  const [impressoras, setImpressoras] = useState<Impressora[]>([]);
  const [totalImpressoras, setTotalImpressoras] = useState<number>(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [editandoId, setEditandoId] = useState<string | null>(null);

  const [modelo, setModelo] = useState("");
  const [marca, setMarca] = useState("");
  const [setor, setSetor] = useState("");

  useEffect(() => {
    if (modelos.length > 0) {
      const primeiroModelo = modelos[0];
      setModelo(`${primeiroModelo.marca} - ${primeiroModelo.modelo}`);
      setMarca(primeiroModelo.marca);
    }
    if (setores.length > 0) {
      setSetor(setores[0]);
    }
  }, [modelos, setores]);

  const gerarId = () => Math.floor(1000 + Math.random() * 9000).toString();

  const salvarImpressora = () => {
    if (editandoId) {
      const atualizadas = impressoras.map((imp) =>
        imp.id === editandoId ? { id: editandoId, modelo, marca, setor } : imp
      );
      setImpressoras(atualizadas);
    } else {
      const novaImpressora: Impressora = {
        id: gerarId(),
        modelo,
        marca,
        setor,
      };
      const novaLista = [...impressoras, novaImpressora];
      setImpressoras(novaLista);
      setTotalImpressoras(novaLista.length);
    }
    setModalVisible(false);
    setEditandoId(null);
  };

  const editarImpressora = (item: Impressora) => {
    setEditandoId(item.id);
    setModelo(item.modelo);
    setMarca(item.marca);
    setSetor(item.setor);
    setModalVisible(true);
  };

  const removerImpressora = (id: string) => {
    const novaLista = impressoras.filter((item) => item.id !== id);
    setImpressoras(novaLista);
    setTotalImpressoras(novaLista.length);
  };

  const compartilharImpressora = async (item: Impressora) => {
    try {
      await Share.share({
        message: `Impressora ${item.marca} - ${item.modelo} no setor ${item.setor}. ID: ${item.id}`,
      });
    } catch (error) {
      console.error("Erro ao compartilhar:", error);
    }
  };

  const renderItem = ({ item }: { item: Impressora }) => (
    <View style={styles.cardItem}>
      <View style={{ flex: 1 }}>
        <Text style={styles.itemTextView}>ID: {item.id}</Text>
        <Text style={styles.itemTextView}>Modelo: {item.modelo}</Text>
        <Text style={styles.itemTextView}>Marca: {item.marca}</Text>
        <Text style={styles.itemTextView}>Setor: {item.setor}</Text>
      </View>
      <View style={styles.cardItemActions}>
        <TouchableOpacity onPress={() => editarImpressora(item)}>
          <Pencil color="#A8A8A8" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => removerImpressora(item.id)}>
          <Trash color="#FA2A2A" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => compartilharImpressora(item)}>
          <Share2 color="#005CB3" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.contentNav}>
        <Text style={styles.title}>Dashboard</Text>
        <Pressable onPress={() => navigation.navigate("Perfil")}>
          <Text style={styles.text_users}>Victor Santos</Text>
        </Pressable>
      </View>

      <View style={styles.content}>
        <LinearGradient
          colors={["#005CB3", "transparent"]}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1.4, y: 0.5 }}
          style={styles.card_totalImpressoras}
        >
          <Printer color="#fff" />
          <View>
            <Text style={styles.textImpressoras}>Total de Impressoras</Text>
            <Text style={styles.totalImpressoras}>{totalImpressoras}</Text>
          </View>
        </LinearGradient>

        <Text style={styles.titleList}>Lista de impressoras registradas</Text>
        <Pressable
          style={styles.addPrinter}
          onPress={() => setModalVisible(true)}
        >
          <CirclePlus />
          <Text>Adicionar nova impressora</Text>
        </Pressable>

        <FlatList
          data={impressoras}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      </View>

      {/* Modal de Adição / Edição */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Impressora</Text>

            <Text style={styles.label}>Modelo:</Text>
            <Picker
              selectedValue={modelo}
              onValueChange={(value) => {
                setModelo(value);
                const match = modelos.find(
                  (m) => `${m.marca} - ${m.modelo}` === value
                );
                if (match) setMarca(match.marca);
              }}
            >
              {modelos.map((m, i) => (
                <Picker.Item
                  key={i}
                  label={`${m.marca} - ${m.modelo}`}
                  value={`${m.marca} - ${m.modelo}`}
                />
              ))}
            </Picker>

            <Text style={styles.label}>Setor:</Text>
            <Picker selectedValue={setor} onValueChange={setSetor}>
              {setores.map((s, i) => (
                <Picker.Item key={i} label={s} value={s} />
              ))}
            </Picker>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.buttonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.saveButton}
                onPress={salvarImpressora}
              >
                <Text style={styles.buttonText}>Salvar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  contentNav: {
    justifyContent: "space-between",
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
    marginBottom: 20,
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: "#005CB3",
  },
  title: {
    fontWeight: "bold",
    fontSize: 18,
    color: "#fff",
  },
  text_users: {
    color: "#fff",
    fontSize: 16,
  },
  card_totalImpressoras: {
    width: "100%",
    padding: 16,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 20,
  },
  textImpressoras: {
    fontSize: 14,
    color: "#fff",
  },
  totalImpressoras: {
    fontWeight: "bold",
    fontSize: 28,
    color: "#fff",
  },
  titleList: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
  },
  addPrinter: {
    borderStyle: "dashed",
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 14,
    flexDirection: "row",
    gap: 12,
    borderRadius: 14,
    alignItems: "center",
    marginBottom: 16,
  },
  cardItem: {
    borderColor: "#ddd",
    borderWidth: 1,
    padding: 14,
    borderRadius: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
    backgroundColor: "#f9f9f9",
  },
  cardItemActions: {
    flexDirection: "row",
    gap: 16,
    marginLeft: 10,
  },
  itemTextView: {
    fontSize: 14,
    marginBottom: 2,
  },
  itemText: { fontSize: 14, color: "#333" },
  label: { fontWeight: "bold", marginTop: 12, color: "#444" },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#fff",
    width: "90%",
    padding: 20,
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  cancelButton: {
    backgroundColor: "#ccc",
    padding: 12,
    borderRadius: 8,
    flex: 1,
    marginRight: 10,
    alignItems: "center",
  },
  saveButton: {
    backgroundColor: "#005CB3",
    padding: 12,
    borderRadius: 8,
    flex: 1,
    marginLeft: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
