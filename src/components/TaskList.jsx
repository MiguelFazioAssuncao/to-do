import { useEffect, useState, useRef, forwardRef, useImperativeHandle } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Modal,
  Animated,
  TextInput,
  Switch,
} from "react-native";
import { Feather } from "@expo/vector-icons";

 const TaskList = (_props, ref) => {
  const { onNotify } = _props || {};
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [editingName, setEditingName] = useState("");
  const [editingDescription, setEditingDescription] = useState("");
  const [editingActive, setEditingActive] = useState(true);
  const [saving, setSaving] = useState(false);
  const animationValues = useRef({}).current;

  const fetchTasks = async () => {
    try {
      const response = await fetch("https://690531d5ee3d0d14c1321cc7.mockapi.io/api/Task");
      const data = await response.json();
      setTasks(data);
      data.forEach((t) => {
        animationValues[t.id] = new Animated.Value(1);
      });
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  useImperativeHandle(ref, () => ({
    refresh: fetchTasks,
    prependTask: (task) => {
      if (!task) return;
      setTasks((prev) => [task, ...prev]);
      if (task.id && !animationValues[task.id]) {
        animationValues[task.id] = new Animated.Value(1);
       }
    },
  }));

  const confirmDelete = (task) => {
    setTaskToDelete(task);
    setModalVisible(true);
  };

  const handleDelete = async () => {
    if (!taskToDelete) return;
    try {
      await fetch(`https://690531d5ee3d0d14c1321cc7.mockapi.io/api/Task/${taskToDelete.id}`, {
        method: "DELETE",
      });
      setTasks((prev) => prev.filter((t) => t.id !== taskToDelete.id));
      setModalVisible(false);
      setTaskToDelete(null);
      if (typeof onNotify === 'function') {
        onNotify('Tarefa deletada');
      }
    } catch (error) {
      console.error(error);
      if (typeof onNotify === 'function') {
        onNotify('Erro ao deletar tarefa');
      }
    }
  };

  const openSidebar = (task) => {
    setSelectedTask(task);
    setEditingName(task.name);
    setEditingDescription(task.description);
    setEditingActive(task.isActive ?? task.active ?? true);
    setSidebarVisible(true);
  };

  const handleSave = async () => {
    if (!selectedTask) return;
    setSaving(true);
    try {
      const response = await fetch(
        `https://690531d5ee3d0d14c1321cc7.mockapi.io/api/Task/${selectedTask.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: editingName,
            description: editingDescription,
            isActive: editingActive,
            active: editingActive,
            updatedAt: new Date().toISOString(),
          }),
        }
      );
      const updated = await response.json();
      setTasks((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
      setSidebarVisible(false);
      if (typeof onNotify === 'function') {
        onNotify('Tarefa atualizada');
      }
    } catch (err) {
      console.error(err);
      if (typeof onNotify === 'function') {
        onNotify('Erro ao atualizar tarefa');
      }
    } finally {
      setSaving(false);
    }
  };

  const renderItem = ({ item }) => {
    const isActive = item.isActive ?? item.active ?? true;

    return (
      <View
        style={[
          styles.taskItem,
          !isActive && { backgroundColor: "rgba(239, 68, 68, 0.2)" },
        ]}
      >
        <TouchableOpacity style={styles.taskContent} onPress={() => openSidebar(item)}>
          <Text style={styles.taskName}>{item.name}</Text>
          <Text style={styles.taskDescription}>{item.description}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => confirmDelete(item)}>
          <Feather name="trash-2" size={20} color="#EF4444" />
        </TouchableOpacity>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#2563EB" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContainer}
      />

      <Modal visible={modalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Confirmar Exclusão</Text>
            <Text style={styles.modalMessage}>
              Tem certeza que deseja deletar a tarefa "{taskToDelete?.name}"?
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.cancelText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.deleteButton]}
                onPress={handleDelete}
              >
                <Text style={styles.deleteText}>Deletar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal visible={sidebarVisible} transparent animationType="none">
        <View style={styles.sidebarOverlay}>
          <View style={styles.sidebar}>
            <Text style={styles.sidebarTitle}>Editar Tarefa</Text>
            <Text style={styles.sidebarLabel}>Nome</Text>
            <TextInput
              style={styles.input}
              value={editingName}
              onChangeText={setEditingName}
              placeholder="Digite o nome"
            />
            <Text style={styles.sidebarLabel}>Descrição</Text>
            <TextInput
              style={[styles.input, { height: 80 }]}
              value={editingDescription}
              onChangeText={setEditingDescription}
              placeholder="Digite a descrição"
              multiline
            />
            <View style={styles.switchContainer}>
              <Text style={styles.sidebarLabel}>Ativa</Text>
              <Switch
                value={editingActive}
                onValueChange={setEditingActive}
                thumbColor={editingActive ? "#2563EB" : "#9CA3AF"}
              />
            </View>
            <Text style={styles.date}>
              Criada em:{" "}
              {new Date(selectedTask?.createdAt || Date.now()).toLocaleDateString()}
            </Text>
            <View style={styles.sidebarButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setSidebarVisible(false)}
              >
                <Text style={styles.cancelText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.saveButton]}
                onPress={handleSave}
                disabled={saving}
              >
                {saving ? (
                  <ActivityIndicator color="#FFF" />
                ) : (
                  <Text style={styles.deleteText}>Salvar</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

    </View>
  );
};

export default forwardRef(TaskList);

const styles = StyleSheet.create({
  listContainer: { paddingHorizontal: 16, paddingVertical: 8 },
  taskItem: {
    backgroundColor: "#FFF",
    padding: 16,
    borderRadius: 10,
    marginBottom: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  taskContent: { flex: 1, marginRight: 12 },
  taskName: { fontSize: 16, fontWeight: "600", color: "#111827" },
  taskDescription: { fontSize: 14, color: "#6B7280", marginTop: 4 },
  loader: { flex: 1, justifyContent: "center", alignItems: "center" },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "80%",
    backgroundColor: "#FFF",
    borderRadius: 12,
    padding: 20,
    alignItems: "center",
  },
  modalTitle: { fontSize: 18, fontWeight: "700", marginBottom: 10 },
  modalMessage: {
    fontSize: 14,
    color: "#4B5563",
    textAlign: "center",
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  modalButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  cancelButton: { backgroundColor: "#E5E7EB", marginRight: 10 },
  deleteButton: { backgroundColor: "#EF4444" },
  saveButton: { backgroundColor: "#2563EB" },
  cancelText: { color: "#111827", fontWeight: "600" },
  deleteText: { color: "#FFF", fontWeight: "600" },
  sidebarOverlay: {
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
  sidebarTitle: { fontSize: 20, fontWeight: "700", marginBottom: 16 },
  sidebarLabel: { fontSize: 14, fontWeight: "600", marginTop: 12, color: "#374151" },
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
  sidebarButtons: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 24,
  },
});
