import { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import TaskItem from './TaskItem';
import TaskList from './TaskList';

export default function TaskScreen() {
  const [tasksUpdated, setTasksUpdated] = useState(false);

  const handleTaskAdded = () => {
    setTasksUpdated((prev) => !prev); 
  };

  return (
    <View style={styles.container}>
      <TaskItem onTaskAdded={handleTaskAdded} />
      <TaskList tasksUpdated={tasksUpdated} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
});
