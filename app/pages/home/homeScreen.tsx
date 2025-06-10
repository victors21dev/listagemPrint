import React, { useState, useEffect, useRef } from "react";
import { useUser } from "../../context/userContext";
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
  LoaderCircle,
} from "lucide-react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { Picker } from "@react-native-picker/picker";
import { useCadastro } from "../../context/cadastroContext";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";
import RNPickerSelect from "react-native-picker-select";

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
  const { user, loading, refreshUser } = useUser();
  const { modelos, setores } = useCadastro();
  const [impressoras, setImpressoras] = useState<Impressora[]>([]);
  const [totalImpressoras, setTotalImpressoras] = useState<number>(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [editandoId, setEditandoId] = useState<string | null>(null);
  const [modelo, setModelo] = useState("");
  const [marca, setMarca] = useState("");
  const [setor, setSetor] = useState<string>("");
  const modeloRef = useRef<any>(null);
  const setorRef = useRef<any>(null);

  useEffect(() => {
    if (!loading && modelos.length > 0) {
      const primeiroModelo = modelos[0];
      setModelo(`${primeiroModelo.marca} - ${primeiroModelo.modelo}`);
      setMarca(primeiroModelo.marca);
    }
    if (!loading && setores.length > 0) {
      setSetor(setores[0].setor);
    }
  }, [loading, modelos, setores]);

  useFocusEffect(
    useCallback(() => {
      refreshUser(); // carrega os dados sempre que entra na Home
    }, [])
  );

  if (loading)
    return (
      <View style={styles.contentLoading}>
        <Text style={styles.contentLoadingText}>
          <LoaderCircle /> Carregando...
        </Text>
      </View>
    );

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
          <Text style={styles.text_users}>{user?.nome}</Text>
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

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Impressora</Text>

            {/* MODELO */}
            <Text style={styles.label}>Modelo:</Text>
            <TouchableOpacity
              style={teste.testando}
              onPress={() => modeloRef.current?.togglePicker()}
            >
              <View>
                <RNPickerSelect
                  ref={modeloRef}
                  placeholder={{ label: "Selecione um modelo", value: null }}
                  value={modelo}
                  onValueChange={(value) => {
                    setModelo(value);
                    const match = modelos.find(
                      (m) => `${m.marca} - ${m.modelo}` === value
                    );
                    if (match) setMarca(match.marca);
                  }}
                  items={modelos.map((m) => ({
                    label: `${m.marca} - ${m.modelo}`,
                    value: `${m.marca} - ${m.modelo}`,
                  }))}
                  useNativeAndroidPickerStyle={false}
                  style={pickerSelectStyles}
                />
              </View>
            </TouchableOpacity>

            {/* SETOR */}
            <Text style={styles.label}>Setor:</Text>
            <TouchableOpacity onPress={() => setorRef.current?.togglePicker()}>
              <View>
                <RNPickerSelect
                  ref={setorRef}
                  placeholder={{ label: "Selecione o setor", value: null }}
                  value={setor}
                  onValueChange={setSetor}
                  items={setores.map((s) => ({
                    label: s.setor,
                    value: s.setor,
                  }))}
                  useNativeAndroidPickerStyle={false}
                  style={pickerSelectStyles}
                />
              </View>
            </TouchableOpacity>

            {/* BOTÕES */}
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
    marginTop: 40,
    marginBottom: 20,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  title: {
    fontWeight: "bold",
    fontSize: 18,
    color: "#000",
  },
  text_users: {
    color: "#000",
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
  contentLoading: {
    flex: 1,
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  contentLoadingText: {
    alignItems: "center",
    justifyContent: "center",
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    marginTop: 6,
    marginBottom: 16,
    overflow: "hidden",
  },

  picker: {
    height: 50,
    width: "100%",
  },
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    color: "#000",
    backgroundColor: "#fff",
    paddingRight: 30, // espaço para o ícone ▼
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    color: "#000",
    backgroundColor: "#fff",
    paddingRight: 30,
  },
  iconContainer: {
    top: 10,
    right: 12,
  },
});

const teste = StyleSheet.create({
  testando: {
    backgroundColor: "#000",
    padding: 40,
  },
});
