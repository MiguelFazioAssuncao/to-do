import { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity} from 'react-native';
import { Feather } from '@expo/vector-icons';

export default function TaskItem({ onCreated, onNotify }) {
  const [isAdding, setIsAdding] = useState(false);
  const [taskName, setTaskName] = useState('');

  const handleAddPress = async () => {
    if (isAdding && taskName.trim() !== '') {
      try {
        const newTask = {
          name: taskName.trim(),
          description: 'Nova tarefa criada pelo app',
          active: true,
          createdAt: new Date().toISOString(),
        };

        const response = await fetch('https://690531d5ee3d0d14c1321cc7.mockapi.io/api/Task', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newTask),
        });

        if (!response.ok) {
          throw new Error('Erro ao criar tarefa');
        }

        const data = await response.json();
        if (typeof onCreated === 'function') {
          onCreated(data);
        }
        if (typeof onNotify === 'function') {
          onNotify('Tarefa criada');
        }
        setTaskName('');
        setIsAdding(false);
      } catch (error) {
        console.error(error);
        if (typeof onNotify === 'function') {
          onNotify('Erro ao criar tarefa');
        }
      }
    } else {
      setIsAdding(true);
    }
  };

  return (
    <View style={styles.container}>
      {isAdding ? (
        <>
          <TextInput
            style={styles.input}
            placeholder="Adicionar tarefa"
            placeholderTextColor="#9CA3AF"
            value={taskName}
            onChangeText={setTaskName}
            autoFocus
          />
          <TouchableOpacity style={styles.addButton} onPress={handleAddPress}>
            <Text style={styles.addButtonText}>Add</Text>
          </TouchableOpacity>
        </>
      ) : (
        <TouchableOpacity style={styles.addRow} onPress={handleAddPress} activeOpacity={0.8}>
          <Feather name="plus" size={20} color="#2563EB" style={styles.icon} />
          <Text style={styles.text}>Adicionar tarefa</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
    marginHorizontal: 16,
    marginVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  addRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: 8,
  },
  text: {
    color: '#2563EB',
    fontSize: 16,
    fontWeight: '500',
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#111827',
    paddingVertical: 6,
  },
  addButton: {
    backgroundColor: '#F3F4F6',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 4,
    marginLeft: 8,
  },
  addButtonText: {
    color: '#2563EB',
    fontWeight: '600',
  },
});
