import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Switch,
  ActivityIndicator,
} from "react-native";

export default function TaskSidebar({ visible, task, onClose, onUpdate }) {
  const [name, setName] = useState(task?.name || "");
  const [description, setDescription] = useState(task?.description || "");
  const [isActive, setIsActive] = useState(task?.isActive ?? true);
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!task) return;
    setLoading(true);

    try {
      const response = await fetch(
        `https://690531d5ee3d0d14c1321cc7.mockapi.io/api/Task/${task.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name,
            description,
            isActive,
            updatedAt: new Date().toISOString(),
          }),
        }
      );

      if (!response.ok) throw new Error("Erro ao atualizar tarefa");
      const updated = await response.json();
      onUpdate(updated);
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.sidebar}>
          <Text style={styles.title}>Editar Tarefa</Text>

          <Text style={styles.label}>Nome</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="Digite o nome da tarefa"
          />

          <Text style={styles.label}>Descrição</Text>
          <TextInput
            style={[styles.input, { height: 80 }]}
            value={description}
            onChangeText={setDescription}
            placeholder="Adicione uma descrição"
            multiline
          />

          <View style={styles.switchContainer}>
            <Text style={styles.label}>Ativa</Text>
            <Switch
              value={isActive}
              onValueChange={setIsActive}
              thumbColor={isActive ? "#2563EB" : "#9CA3AF"}
            />
          </View>

          <Text style={styles.date}>
            Criada em:{" "}
            {new Date(task?.createdAt || Date.now()).toLocaleDateString()}
          </Text>

          <View style={styles.actions}>
            <TouchableOpacity style={styles.cancel} onPress={onClose}>
              <Text style={styles.cancelText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.save}
              onPress={handleSave}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#FFF" />
              ) : (
                <Text style={styles.saveText}>Salvar</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  sidebar: {
    width: "85%",
    backgroundColor: "#FFF",
    padding: 20,
    borderTopLeftRadius: 16,
    borderBottomLeftRadius: 16,
    elevation: 10,
  },
  title: { fontSize: 20, fontWeight: "700", marginBottom: 16 },
  label: { fontSize: 14, fontWeight: "600", marginTop: 12, color: "#374151" },
  input: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 8,
    padding: 10,
    marginTop: 6,
    color: "#111827",
  },
  switchContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 16,
  },
  date: { marginTop: 20, fontSize: 13, color: "#6B7280" },
  actions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 24,
  },
  cancel: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: "#E5E7EB",
    borderRadius: 8,
    marginRight: 10,
  },
  save: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: "#2563EB",
    borderRadius: 8,
  },
  cancelText: { color: "#111827", fontWeight: "600" },
  saveText: { color: "#FFF", fontWeight: "600" },
});
