 import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';

export default function Header({ initialTitle = 'Sem nome' }) {
  const [title, setTitle] = useState(initialTitle);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.localStorage) {
      const saved = window.localStorage.getItem('todo_list_title');
      if (saved !== null && saved !== undefined) {
        setTitle(saved);
      }
    }
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem('todo_list_title', title);
    }
  }, [title]);

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        {isEditing ? (
          <TextInput
            style={styles.input}
            value={title}
            onChangeText={setTitle}
            onSubmitEditing={() => setIsEditing(false)}
            autoFocus
          />
        ) : (
          <Text style={styles.title}>{title}</Text>
        )}
        <TouchableOpacity onPress={handleEditToggle} style={styles.iconButton}>
          <Feather name={isEditing ? 'check' : 'edit-2'} size={20} color="#E0F2FE" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#3561daff',
    paddingVertical: 8,
    paddingHorizontal: 12,
    elevation: 6,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    color: '#E0F2FE',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  input: {
    color: '#E0F2FE',
    fontSize: 24,
    fontWeight: 'bold',
    minWidth: 180,
    textAlign: 'center',
  },
  iconButton: {
    marginLeft: 8,
  },
});
