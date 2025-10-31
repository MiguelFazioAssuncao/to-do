import { View, StyleSheet } from 'react-native';
import Header from './src/components/Header';
import TaskItem from './src/components/TaskItem';
import TaskList from './src/components/TaskList';

export default function App() {
  return (
    <View style={styles.container}>
      <Header />
      <TaskItem />
      <TaskList />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
});
