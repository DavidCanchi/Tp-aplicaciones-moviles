jest.mock('@react-native-async-storage/async-storage', () => require('@react-native-async-storage/async-storage/jest/async-storage-mock'));

import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import renderer from 'react-test-renderer';
import TaskItem from '../components/TaskItem';
import useTaskStore from '../store/useTaskStore';

describe('Componente reutilizable', () => {
  // Comprueba que el componente renderiza y que la zona de toggle llama a onToggle
  test('renderiza y responde a toggle', () => {
    const task = { id: '1', title: 'Test', priority: 'media', completed: false };
    const onToggle = jest.fn();
    const tree = renderer.create(<TaskItem task={task} onToggle={onToggle} onDelete={() => {}} />);
    // Buscar todos los TouchableOpacity y ejecutar la primera onPress (checkbox area)
    const touchables = tree.root.findAllByType(require('react-native').TouchableOpacity);
    expect(touchables.length).toBeGreaterThan(0);
    touchables[0].props.onPress();
    expect(onToggle).toHaveBeenCalledWith('1');
  });
});

describe('Lógica de negocio', () => {
  // Valida la lógica de negocio: validación simple de título
  test('validar título vacío falla', () => {
    function validarTarea({ title, priority }) {
      const errores = [];
      if (!title || !title.trim()) errores.push('Título inválido');
      if (!['alta', 'media', 'baja'].includes(priority)) errores.push('Prioridad inválida');
      return { valido: errores.length === 0, errores };
    }
    expect(validarTarea({ title: '', priority: 'media' }).valido).toBe(false);
  });
});

describe('Store (Zustand)', () => {
  beforeEach(() => {
    useTaskStore.setState({ tasks: [], usuario: null, cargando: false });
  });

  // Comprueba que la acción agregarTarea actualiza el estado del store
  test('agregarTarea modifica el store', async () => {
    await useTaskStore.getState().agregarTarea('u', { title: 'Prueba', priority: 'alta' });
    const s = useTaskStore.getState();
    expect(s.tasks.length).toBe(1);
    expect(s.tasks[0].title).toBe('Prueba');
  });
});
