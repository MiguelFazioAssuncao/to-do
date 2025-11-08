import { View, StyleSheet, Text, Animated } from 'react-native';
import { useRef, useState } from 'react';
import Header from './src/components/Header';
import TaskItem from './src/components/TaskItem';
import TaskList from './src/components/TaskList';

export default function App() {
  const listRef = useRef(null);
  const slide = useRef(new Animated.Value(80)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const [toast, setToast] = useState({ visible: false, message: '' });

  const handleCreated = (task) => {
    if (task && listRef.current && typeof listRef.current.prependTask === 'function') {
      listRef.current.prependTask(task);
    } else if (listRef.current && typeof listRef.current.refresh === 'function') {
      listRef.current.refresh();
    }
  };

  const showToast = (message) => {
    setToast({ visible: true, message });
    Animated.parallel([
      Animated.timing(slide, { toValue: 0, duration: 180, useNativeDriver: true }),
      Animated.timing(opacity, { toValue: 1, duration: 180, useNativeDriver: true }),
    ]).start(() => {
      setTimeout(() => {
        Animated.parallel([
          Animated.timing(slide, { toValue: 80, duration: 180, useNativeDriver: true }),
          Animated.timing(opacity, { toValue: 0, duration: 160, useNativeDriver: true }),
        ]).start(() => setToast((t) => ({ ...t, visible: false })));
      }, 1400);
    });
  };

  return (
    <View style={styles.container}>
      <Header />
      <TaskItem onCreated={handleCreated} onNotify={showToast} />
      <TaskList ref={listRef} onNotify={showToast} />

      {toast.visible && (
        <Animated.View
          style={[
            styles.toast,
            { opacity, transform: [{ translateY: slide }] },
          ]}
        >
          <Text style={styles.toastText}>{toast.message}</Text>
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  toast: {
    position: 'absolute',
    left: 16,
    right: 16,
    bottom: 24,
    backgroundColor: '#111827',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    elevation: 6,
  },
  toastText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
});
