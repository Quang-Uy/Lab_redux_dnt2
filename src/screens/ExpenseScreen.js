import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addExpense, removeExpense, updateExpense } from '../redux/actions/expenseActions';
import { View, Text, TextInput, Button, FlatList, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import ModalDropdown from 'react-native-modal-dropdown';

const ExpenseScreen = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date());
  const [type, setType] = useState('income');
  const [amount, setAmount] = useState('');
  const [search, setSearch] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [currentExpenseId, setCurrentExpenseId] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const expenses = useSelector(state => state.expenses.expenses);
  const dispatch = useDispatch();

  const handleAddExpense = () => {
    if (title && description && date && type && amount) {
      const expense = {
        id: Date.now().toString(),
        title,
        description,
        date: date.toLocaleDateString(),
        type,
        amount: parseFloat(amount),
      };

      if (isEditing) {
        dispatch(updateExpense({ ...expense, id: currentExpenseId }));
        setIsEditing(false);
      } else {
        dispatch(addExpense(expense));
      }

      setTitle('');
      setDescription('');
      setDate(new Date());
      setType('income');
      setAmount('');
    }
  };

  const handleEditExpense = (id) => {
    const expense = expenses.find(exp => exp.id === id);
    if (expense) {
      setTitle(expense.title);
      setDescription(expense.description);
      setDate(new Date(expense.date));
      setType(expense.type);
      setAmount(expense.amount.toString());
      setCurrentExpenseId(id);
      setIsEditing(true);
    }
  };

  const handleRemoveExpense = (id) => {
    dispatch(removeExpense(id));
  };

  const filteredExpenses = expenses.filter(expense =>
    expense.title.toLowerCase().includes(search.toLowerCase())
  );

  const totalIncome = expenses.filter(exp => exp.type === 'income').reduce((sum, exp) => sum + exp.amount, 0);
  const totalExpense = expenses.filter(exp => exp.type === 'expense').reduce((sum, exp) => sum + exp.amount, 0);

  // Hàm chuyển đổi kiểu chi tiêu từ tiếng Anh sang tiếng Việt
  const getTypeLabel = (type) => {
    switch(type) {
      case 'income': return 'Thu nhập';
      case 'expense': return 'Chi tiêu';
      default: return '';
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Quản lý chi tiêu</Text>
      <TextInput
        placeholder="Tiêu đề"
        value={title}
        onChangeText={setTitle}
        style={styles.input}
      />
      <TextInput
        placeholder="Mô tả"
        value={description}
        onChangeText={setDescription}
        style={styles.input}
      />
      <TouchableOpacity onPress={() => setShowDatePicker(true)}>
        <TextInput
          placeholder="Ngày thu chi"
          value={date.toLocaleDateString()}
          editable={false}
          style={styles.input}
        />
      </TouchableOpacity>
      {showDatePicker && (
        <DateTimePicker
          value={date}
          mode="date"
          display="default"
          onChange={(event, selectedDate) => {
            setShowDatePicker(false);
            setDate(selectedDate || date);
          }}
        />
      )}
      <ModalDropdown
        options={['Thu nhập', 'Chi tiêu']}
        defaultValue="Thu nhập"
        onSelect={(index, value) => setType(index === 0 ? 'income' : 'expense')}
        style={styles.dropdown}
        textStyle={styles.dropdownText}
        dropdownStyle={styles.dropdownMenu}
        dropdownTextStyle={styles.dropdownMenuText}
        adjustFrame={(style) => {
          return {
            ...style,
            top: style.top + 40, // Adjust as needed
          };
        }}
        renderRow={(option, index, isSelected) => (
          <View style={styles.dropdownRow}>
            <Text style={[styles.dropdownMenuText, isSelected && styles.dropdownSelected]}>
              {option}
            </Text>
          </View>
        )}
      />
      <TextInput
        placeholder="Số tiền"
        value={amount}
        onChangeText={setAmount}
        keyboardType="numeric"
        style={styles.input}
      />
      <Button title={isEditing ? "Cập nhật" : "Thêm"} onPress={handleAddExpense} />
      <TextInput
        placeholder="Tìm kiếm theo tiêu đề"
        value={search}
        onChangeText={setSearch}
        style={styles.input}
      />
      <Text>Tổng thu nhập: {totalIncome}</Text>
      <Text>Tổng chi tiêu: {totalExpense}</Text>
      <FlatList
        data={filteredExpenses}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text>Tiêu đề: {item.title}</Text>
            <Text>Mô tả: {item.description}</Text>
            <Text>Ngày: {item.date}</Text>
            <Text>Dạng: {getTypeLabel(item.type)}</Text>
            <Text>Số tiền: {item.amount}</Text>
            <TouchableOpacity onPress={() => handleEditExpense(item.id)}>
              <Text style={styles.edit}>Sửa</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleRemoveExpense(item.id)}>
              <Text style={styles.delete}>Xóa</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
    height: 40,
  },
  dropdown: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 10,
    height: 40,
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  dropdownText: {
    lineHeight: 40,
  },
  dropdownMenu: {
    width: '100%',
    height: 120,
    borderRadius: 5,
    overflow: 'hidden',
    elevation: 3, // Add shadow effect for Android
  },
  dropdownMenuText: {
    padding: 10,
    fontSize: 16,
  },
  dropdownRow: {
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  dropdownSelected: {
    backgroundColor: '#eee',
  },
  item: {
    padding: 15,
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },
  edit: {
    color: 'blue',
    marginTop: 10,
  },
  delete: {
    color: 'red',
    marginTop: 10,
  },
});

export default ExpenseScreen;
