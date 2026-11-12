import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, FlatList, SafeAreaStorage, ScrollView, Linking } from 'react-native';
import { StatusBar } from 'expo-status-bar';

export default function App() {
  const [customers, setCustomers] = useState([]);
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [phone, setPhone] = useState('');
  const [type, setType] = useState('borc'); // 'borc' (Alacağımız) veya 'alacak' (Vereceğimiz)

  // Toplam hesaplamaları
  const totalReceivable = customers
    .filter(c => c.type === 'borc')
    .reduce((sum, c) => sum + parseFloat(c.amount || 0), 0);

  const totalPayable = customers
    .filter(c => c.type === 'alacak')
    .reduce((sum, c) => sum + parseFloat(c.amount || 0), 0);

  const addCustomer = () => {
    if (!name.trim() || !amount.trim()) return;
    const newCustomer = {
      id: Date.now().toString(),
      name,
      amount: parseFloat(amount),
      phone,
      type,
    };
    setCustomers([newCustomer, ...customers]);
    setName('');
    setAmount('');
    setPhone('');
  };

  const deleteCustomer = (id) => {
    setCustomers(customers.filter(c => c.id !== id));
  };

  const sendWhatsApp = (customer) => {
    if (!customer.phone) {
      alert('Bu müşteri için telefon numarası girilmemiş!');
      return;
    }
    const message = `Sayın ${customer.name}, TOCO Ticaret Ofisi - Esnaf Kasa kayıtlarımıza göre ${customer.amount} TL bakiye borcunuz bulunmaktadır. Bilgilerinize sunar, iyi günler dileriz.`;
    const url = `whatsapp://send?phone=${customer.phone}&text=${encodeURIComponent(message)}`;
    Linking.openURL(url).catch(() => {
      alert('WhatsApp yüklü değil veya numara hatalı.');
    });
  };

  return (
    <SafeAreaStorage style={styles.container}>
      <StatusBar style="light" />
      
      {/* Üst Başlık */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>TOCO Esnaf Kasa</Text>
        <Text style={styles.headerSubtitle}>Cep Tahsilat ve Borç Takip Sistemi</Text>
      </View>

      {/* Özet Kartları */}
      <View style={styles.summaryContainer}>
        <View style={[styles.card, styles.cardRed]}>
          <Text style={styles.cardTitle}>Alacaklı Olduğumuz</Text>
          <Text style={styles.cardAmount}>{totalReceivable.toFixed(2)} TL</Text>
        </View>
        <View style={[styles.card, styles.cardGreen]}>
          <Text style={styles.cardTitle}>Borçlu Olduğumuz</Text>
          <Text style={styles.cardAmount}>{totalPayable.toFixed(2)} TL</Text>
        </View>
      </View>

      {/* Veri Giriş Alanı */}
      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="Müşteri / Firma Adı"
          placeholderTextColor="#888"
          value={name}
          onChangeText={setName}
        />
        <TextInput
          style={styles.input}
          placeholder="Tutar (TL)"
          placeholderTextColor="#888"
          keyboardType="numeric"
          value={amount}
          onChangeText={setAmount}
        />
        <TextInput
          style={styles.input}
          placeholder="Telefon (Örn: 90532...)"
          placeholderTextColor="#888"
          keyboardType="phone-pad"
          value={phone}
          onChangeText={setPhone}
        />

        {/* Tip Seçimi */}
        <View style={styles.typeSelector}>
          <TouchableOpacity
            style={[styles.typeButton, type === 'borc' && styles.activeBorc]}
            onClick={() => setType('borc')}
            onPress={() => setType('borc')}
          >
            <Text style={[styles.typeText, type === 'borc' && styles.activeText]}>Müşteri Borcu (Alacak)</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.typeButton, type === 'alacak' && styles.activeAlacak]}
            onPress={() => setType('alacak')}
          >
            <Text style={[styles.typeText, type === 'alacak' && styles.activeText]}>Bize Borç (Verecek)</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.addButton} onPress={addCustomer}>
          <Text style={styles.addButtonText}>Kayıt Ekle</Text>
        </TouchableOpacity>
      </View>

      {/* Liste */}
      <View style={styles.listContainer}>
        <Text style={styles.listTitle}>Güncel Cari Hesaplar</Text>
        <FlatList
          data={customers}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={[styles.itemCard, item.type === 'borc' ? styles.borderRed : styles.borderGreen]}>
              <View style={styles.itemInfo}>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemPhone}>{item.phone || 'Telefon yok'}</Text>
                <Text style={[styles.itemAmount, item.type === 'borc' ? styles.textRed : styles.textGreen]}>
                  {item.amount} TL ({item.type === 'borc' ? 'Borçlu' : 'Alacaklı'})
                </Text>
              </View>
              <View style={styles.itemActions}>
                {item.phone ? (
                  <TouchableOpacity style={styles.waButton} onPress={() => sendWhatsApp(item)}>
                    <Text style={styles.waButtonText}>WhatsApp</Text>
                  </TouchableOpacity>
                ) : null}
                <TouchableOpacity style={styles.deleteButton} onPress={() => deleteCustomer(item.id)}>
                  <Text style={styles.deleteButtonText}>Sil</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
          ListEmptyComponent={<Text style={styles.emptyText}>Henüz kayıt eklenmedi.</Text>}
        />
      </View>
    </SafeAreaStorage>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212', padding: 15 },
  header: { marginTop: 40, marginBottom: 15, alignItems: 'center' },
  headerTitle: { fontSize: 24, fontWeight: 'bold', color: '#fff' },
  headerSubtitle: { fontSize: 13, color: '#aaa', marginTop: 4 },
  summaryContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15 },
  card: { flex: 1, padding: 12, borderRadius: 10, alignItems: 'center', marginHorizontal: 4 },
  cardRed: { backgroundColor: '#3b1a1a' },
  cardGreen: { backgroundColor: '#1a3b1a' },
  cardTitle: { fontSize: 12, color: '#ccc', marginBottom: 5 },
  cardAmount: { fontSize: 18, fontWeight: 'bold', color: '#fff' },
  form: { backgroundColor: '#1e1e1e', padding: 12, borderRadius: 10, marginBottom: 15 },
  input: { backgroundColor: '#2c2c2c', color: '#fff', padding: 10, borderRadius: 8, marginBottom: 8, fontSize: 14 },
  typeSelector: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  typeButton: { flex: 1, padding: 8, alignItems: 'center', borderRadius: 6, backgroundColor: '#2c2c2c', marginHorizontal: 2 },
  activeBorc: { backgroundColor: '#b71c1c' },
  activeAlacak: { backgroundColor: '#1b5e20' },
  typeText: { color: '#aaa', fontSize: 11, fontWeight: 'bold' },
  activeText: { color: '#fff' },
  addButton: { backgroundColor: '#0288d1', padding: 12, borderRadius: 8, alignItems: 'center' },
  addButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 15 },
  listContainer: { flex: 1 },
  listTitle: { color: '#fff', fontSize: 16, fontWeight: 'bold', marginBottom: 10 },
  itemCard: { flexDirection: 'row', justifyContent: 'space-between', backgroundColor: '#1e1e1e', padding: 12, borderRadius: 8, marginBottom: 8, borderLeftWidth: 5 },
  borderRed: { borderLeftColor: '#f44336' },
  borderGreen: { borderLeftColor: '#4caf50' },
  itemInfo: { flex: 1 },
  itemName: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  itemPhone: { color: '#888', fontSize: 12, marginVertical: 2 },
  itemAmount: { fontSize: 14, fontWeight: 'bold', marginTop: 4 },
  textRed: { color: '#f44336' },
  textGreen: { color: '#4caf50' },
  itemActions: { justifyContent: 'center', alignItems: 'flex-end' },
  waButton: { backgroundColor: '#25D366', paddingVertical: 5, paddingHorizontal: 10, borderRadius: 5, marginBottom: 5 },
  waButtonText: { color: '#fff', fontSize: 11, fontWeight: 'bold' },
  deleteButton: { backgroundColor: '#d32f2f', paddingVertical: 5, paddingHorizontal: 10, borderRadius: 5 },
  deleteButtonText: { color: '#fff', fontSize: 11, fontWeight: 'bold' },
  emptyText: { color: '#666', textAlign: 'center', marginTop: 20 }
});
