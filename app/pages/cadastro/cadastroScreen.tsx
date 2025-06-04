import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Modal,
  TextInput,
} from "react-native";
import { useCadastro } from "../../context/cadastroContext";

export default function CadastroScreen() {
  const { adicionarModelo, adicionarSetor, modelos, setores } = useCadastro();

  const [modo, setModo] = useState<"impressora" | "setor">("impressora");
  const [modalVisible, setModalVisible] = useState(false);
  const [novaMarca, setNovaMarca] = useState("");
  const [novoModelo, setNovoModelo] = useState("");
  const [novoSetor, setNovoSetor] = useState("");
  const [editandoIndex, setEditandoIndex] = useState<number | null>(null);

  const abrirModal = () => setModalVisible(true);
  const fecharModal = () => {
    setModalVisible(false);
    setNovaMarca("");
    setNovoModelo("");
    setNovoSetor("");
    setEditandoIndex(null);
  };

  const salvar = () => {
    if (modo === "impressora") {
      if (novaMarca && novoModelo) {
        const novoItem = { marca: novaMarca, modelo: novoModelo };
        if (editandoIndex !== null) {
          const atualizados = [...modelos];
          atualizados[editandoIndex] = novoItem;
          // substitui os dados
        } else {
          adicionarModelo(novoItem);
        }
      }
    } else {
      if (novoSetor) {
        if (editandoIndex !== null) {
          const atualizados = [...setores];
          atualizados[editandoIndex] = novoSetor;
          // substitui os dados
        } else {
          adicionarSetor(novoSetor);
        }
      }
    }
    fecharModal();
  };

  const editarItem = (index: number) => {
    setEditandoIndex(index);
    if (modo === "impressora") {
      const item = modelos[index];
      setNovaMarca(item.marca);
      setNovoModelo(item.modelo);
    } else {
      setNovoSetor(setores[index]);
    }
    setModalVisible(true);
  };

  const removerItem = (index: number) => {
    if (modo === "impressora") {
      const atualizados = [...modelos];
      atualizados.splice(index, 1);
      // remover do estado/contexto se necessário
    } else {
      const atualizados = [...setores];
      atualizados.splice(index, 1);
      // remover do estado/contexto se necessário
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={[
            styles.tabButton,
            modo === "impressora" && styles.tabSelected,
          ]}
          onPress={() => setModo("impressora")}
        >
          <Text style={styles.tabText}>Impressoras</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabButton, modo === "setor" && styles.tabSelected]}
          onPress={() => setModo("setor")}
        >
          <Text style={styles.tabText}>Setores</Text>
        </TouchableOpacity>
      </View>

      {/* Botão Adicionar */}
      <TouchableOpacity style={styles.addButton} onPress={abrirModal}>
        <Text style={styles.addButtonText}>+ Adicionar</Text>
      </TouchableOpacity>

      <FlatList
        data={
          modo === "impressora"
            ? modelos.map((m) => `${m.marca} - ${m.modelo}`)
            : setores
        }
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => (
          <View style={styles.item}>
            <Text style={styles.itemText}>{item}</Text>
            <View style={styles.itemActions}>
              <TouchableOpacity onPress={() => editarItem(index)}>
                <Text style={styles.editText}>Editar</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => removerItem(index)}>
                <Text style={styles.deleteText}>Apagar</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        contentContainerStyle={{ paddingBottom: 20 }}
      />

      {/* Modal */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {modo === "impressora" ? "Nova Impressora" : "Novo Setor"}
            </Text>

            {modo === "impressora" ? (
              <>
                <Text style={styles.label}>Marca:</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Digite a marca"
                  value={novaMarca}
                  onChangeText={setNovaMarca}
                />
                <Text style={styles.label}>Modelo:</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Digite o modelo"
                  value={novoModelo}
                  onChangeText={setNovoModelo}
                />
              </>
            ) : (
              <>
                <Text style={styles.label}>Setor:</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Digite o setor"
                  value={novoSetor}
                  onChangeText={setNovoSetor}
                />
              </>
            )}

            <View style={styles.modalButtons}>
              <TouchableOpacity
                onPress={fecharModal}
                style={styles.cancelButton}
              >
                <Text style={styles.buttonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={salvar} style={styles.saveButton}>
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
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  header: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 20,
  },
  tabButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
  },
  tabSelected: { borderBottomColor: "#005CB3" },
  tabText: { fontWeight: "bold", color: "#005CB3" },
  addButton: {
    backgroundColor: "#005CB3",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 20,
  },
  addButtonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  item: {
    padding: 14,
    borderBottomColor: "#ddd",
    borderBottomWidth: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  itemText: { fontSize: 14, flex: 1 },
  itemActions: { flexDirection: "row", gap: 12 },
  editText: { color: "#005CB3", fontWeight: "bold" },
  deleteText: { color: "#FA2A2A", fontWeight: "bold" },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#fff",
    width: "90%",
    padding: 20,
    borderRadius: 10,
  },
  modalTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 12 },
  label: { marginTop: 10, fontWeight: "bold" },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    padding: 10,
    marginTop: 6,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  cancelButton: {
    backgroundColor: "#ccc",
    padding: 12,
    borderRadius: 6,
    flex: 1,
    marginRight: 10,
    alignItems: "center",
  },
  saveButton: {
    backgroundColor: "#005CB3",
    padding: 12,
    borderRadius: 6,
    flex: 1,
    marginLeft: 10,
    alignItems: "center",
  },
  buttonText: { color: "#fff", fontWeight: "bold" },
});
