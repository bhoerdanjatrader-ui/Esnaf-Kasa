import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, FlatList, SafeAreaView, Linking } from 'react-native';
import { StatusBar } from 'expo-status-bar';

// Dil Sözlüğü
const translations = {
  tr: {
    title: "PATRON",
    subtitle: "Bırak Patron Düşünsün",
    totalReceivable: "Alacaklı Olduğumuz",
    totalPayable: "Borçlu Olduğumuz",
    namePlaceholder: "Müşteri / Firma Adı",
    amountPlaceholder: "Tutar (TL)",
    phonePlaceholder: "Telefon (Örn: 90532...)",
    customerDebt: "Müşteri Borcu (Alacak)",
    companyDebt: "Bize Borç (Verecek)",
    addButton: "Kayıt Ekle",
    listTitle: "Güncel Cari Hesaplar",
    whatsapp: "WhatsApp",
    delete: "Sil",
    empty: "Henüz kayıt eklenmedi.",
    premiumBanner: "⭐ Patron Premium: Sınırsız Sınıf ve Raporlama (49.99 TL/Ay)",
    switchLang: "English",
  },
  en: {
    title: "PATRON",
    subtitle: "Let the Boss Think",
    totalReceivable: "Total Receivable",
    totalPayable: "Total Payable",
    namePlaceholder: "Customer / Company Name",
    amountPlaceholder: "Amount (TL)",
    phonePlaceholder: "Phone (Ex: 90532...)",
    customerDebt: "Customer Debt",
    companyDebt: "Our Debt",
    addButton: "Add Record",
    listTitle: "Current Accounts",
    whatsapp: "WhatsApp",
    delete: "Delete",
    empty: "No records added yet.",
    premiumBanner: "⭐ Patron Premium: Unlimited & Reports (49.99 TL/Mo)",
    switchLang: "Türkçe",
  }
};

export default function App() {
  const [lang, setLang] = useState(null); // 'tr' veya 'en' (null ise dil seçim ekranı gelir)
  const [customers, setCustomers] = useState([]);
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [phone, setPhone] = useState('');
  const [type, setType] = useState('borc');

  const t = translations[lang] || translations.tr;

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
    if (!customer.phone) return;
    const message = lang === 'en' 
      ? `Dear ${customer.name}, according to Patron records, you have a balance of ${customer.amount} TL. Best regards.`
      : `Sayın ${customer.name}, Patron kayıtlarımıza göre ${customer.amount} TL bakiye borcunuz bulunmaktadır. Bilgilerinize sunarız.`;
    const url = `whatsapp://send?phone=${customer.phone}&text=${encodeURIComponent(message)}`;
    Linking.openURL(url).catch(() => alert('WhatsApp error'));
  };

  // 1. AŞAMA: Dil Seçim Ekranı (Splash / Welcome Screen)
  if (!lang) {
    return (
      <SafeAreaView style={styles.welcomeContainer}>
        <StatusBar style="light" />
        <View style={styles.welcomeCard}>
          <Text style={styles.welcomeLogo}>💼 PATRON</Text>
          <Text style={styles.welcomeSlogan}>Bırak Patron Düşünsün / Let the Boss Think</Text>
          <Text style={styles.welcomeDesc}>Lütfen uygulama dilini seçiniz / Please select language</Text>
          
          <TouchableOpacity style={styles.langButton} onPress={() => setLang('tr')}>
            <Text style={styles.langButtonText}>🇹🇷 Türkçe</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.langButton} onPress={() => setLang('en')}>
            <Text style={styles.langButtonText}>🇬🇧 English</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // 2. AŞAMA: Ana Uygulama Ekranı
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      
      {/* Üst Başlık ve Dil Değiştirme */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>💼 {t.title}</Text>
          <Text style={styles.headerSubtitle}>{t.subtitle}</Text>
        </View>
        <TouchableOpacity style={styles.langSwitch} onPress={() => setLang(lang === 'tr' ? 'en' : 'tr')}>
          <Text style={styles.langSwitchText}>{t.switchLang}</Text>
        </TouchableOpacity>
      </View>

      {/* Premium Abonelik Bilgilendirme Banneri (49.99 TL) */}
      <View style={styles.premiumBanner}>
        <Text style={styles.premiumText}>{t.premiumBanner}</Text>
      </View>

      {/* Özet Kartları */}
      <View style={styles.summaryContainer}>
        <View style={[styles.card, styles.cardRed]}>
          <Text style={styles.cardTitle}>{t.totalReceivable}</Text>
          <Text style={styles.cardAmount}>{totalReceivable.toFixed(2)} TL</Text>
        </View>
        <View style={[styles.card, styles.cardGreen]}>
          <Text style={styles.cardTitle}>{t.totalPayable}</Text>
          <Text style={styles.cardAmount}>{totalPayable.toFixed(2)} TL</Text>
        </View>
      </View>

      {/* Veri Giriş Formu */}
      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder={t.namePlaceholder}
          placeholderTextColor="#888"
          value={name}
          onChangeText={setName}
        />
        <TextInput
          style={styles.input}
          placeholder={t.amountPlaceholder}
          placeholderTextColor="#888"
          keyboardType="numeric"
          value={amount}
          onChangeText={setAmount}
        />
        <TextInput
          style={styles.input}
          placeholder={t.phonePlaceholder}
          placeholderTextColor="#888"
          keyboardType="phone-pad"
          value={phone}
          onChangeText={setPhone}
        />

        <View style={styles.typeSelector}>
          <TouchableOpacity
            style={[styles.typeButton, type === 'borc' && styles.activeBorc]}
            onPress={() => setType('borc')}
          >
            <Text style={[styles.typeText, type === 'borc' && styles.activeText]}>{t.customerDebt}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.typeButton, type === 'alacak' && styles.activeAlacak]}
            onPress={() => setType('alacak')}
          >
            <Text style={[styles.typeText, type === 'alacak' && styles.activeText]}>{t.companyDebt}</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.addButton} onPress={addCustomer}>
          <Text style={styles.addButtonText}>{t.addButton}</Text>
        </TouchableOpacity>
      </View>

      {/* Liste */}
      <View style={styles.listContainer}>
        <Text style={styles.listTitle}>{t.listTitle}</Text>
        <FlatList
          data={customers}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={[styles.itemCard, item.type === 'borc' ? styles.borderRed : styles.borderGreen]}>
              <View style={styles.itemInfo}>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemPhone}>{item.phone || '-'}</Text>
                <Text style={[styles.itemAmount, item.type === 'borc' ? styles.textRed : styles.textGreen]}>
                  {item.amount} TL
                </Text>
              </View>
              <View style={styles.itemActions}>
                {item.phone ? (
                  <TouchableOpacity style={styles.waButton} onPress={() => sendWhatsApp(item)}>
                    <Text style={styles.waButtonText}>{t.whatsapp}</Text>
                  </TouchableOpacity>
                ) : null}
                <TouchableOpacity style={styles.deleteButton} onPress={() => deleteCustomer(item.id)}>
                  <Text style={styles.deleteButtonText}>{t.delete}</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
          ListEmptyComponent={<Text style={styles.emptyText}>{t.empty}</Text>}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  welcomeContainer: { flex: 1, backgroundColor: '#0f172a', justifyContent: 'center', alignItems: 'center', padding: 20 },
  welcomeCard: { width: '100%', maxWidth: 350, backgroundColor: '#1e293b', padding: 25, borderRadius: 16, alignItems: 'center', borderWidth: 1, borderColor: '#334155' },
  welcomeLogo: { fontSize: 32, fontWeight: 'bold', color: '#38bdf8', marginBottom: 10 },
  welcomeSlogan: { fontSize: 13, color: '#fbbf24', textAlign: 'center', marginBottom: 15, fontStyle: 'italic' },
  welcomeDesc: { fontSize: 12, color: '#94a3b8', textAlign: 'center', marginBottom: 25 },
  langButton: { width: '100%', backgroundColor: '#0284c7', padding: 14, borderRadius: 10, alignItems: 'center', marginBottom: 12 },
  langButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },

  container: { flex: 1, backgroundColor: '#0f172a', padding: 15 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10, marginBottom: 10 },
  headerTitle: { fontSize: 22, fontWeight: 'bold', color: '#f8fafc' },
  headerSubtitle: { fontSize: 11, color: '#fbbf24', fontStyle: 'italic' },
  langSwitch: { backgroundColor: '#334155', paddingVertical: 6, paddingHorizontal: 12, borderRadius: 8 },
  langSwitchText: { color: '#38bdf8', fontSize: 12, fontWeight: 'bold' },
  premiumBanner: { backgroundColor: '#422006', padding: 8, borderRadius: 8, marginBottom: 12, borderWidth: 1, borderColor: '#b45309', alignItems: 'center' },
  premiumText: { color: '#fde047', fontSize: 11, fontWeight: 'bold' },
  summaryContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  card: { flex: 1, padding: 10, borderRadius: 10, alignItems: 'center', marginHorizontal: 4 },
  cardRed: { backgroundColor: '#450a0a' },
  cardGreen: { backgroundColor: '#052e16' },
  cardTitle: { fontSize: 11, color: '#cbd5e1', marginBottom: 4 },
  cardAmount: { fontSize: 16, fontWeight: 'bold', color: '#fff' },
  form: { backgroundColor: '#1e293b', padding: 12, borderRadius: 10, marginBottom: 12 },
  input: { backgroundColor: '#0f172a', color: '#fff', padding: 10, borderRadius: 8, marginBottom: 8, fontSize: 13, borderWidth: 1, borderColor: '#334155' },
  typeSelector: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  typeButton: { flex: 1, padding: 8, alignItems: 'center', borderRadius: 6, backgroundColor: '#0f172a', marginHorizontal: 2, borderWidth: 1, borderColor: '#334155' },
  activeBorc: { backgroundColor: '#991b1b', borderColor: '#f87171' },
  activeAlacak: { backgroundColor: '#166534', borderColor: '#4ade80' },
  typeText: { color: '#94a3b8', fontSize: 10, fontWeight: 'bold' },
  activeText: { color: '#fff' },
  addButton: { backgroundColor: '#0284c7', padding: 12, borderRadius: 8, alignItems: 'center' },
  addButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 14 },
  listContainer: { flex: 1 },
  listTitle: { color: '#f8fafc', fontSize: 14, fontWeight: 'bold', marginBottom: 8 },
  itemCard: { flexDirection: 'row', justifyContent: 'space-between', backgroundColor: '#1e293b', padding: 10, borderRadius: 8, marginBottom: 6, borderLeftWidth: 4 },
  borderRed: { borderLeftColor: '#ef4444' },
  borderGreen: { borderLeftColor: '#22c55e' },
  itemInfo: { flex: 1 },
  itemName: { color: '#fff', fontSize: 14, fontWeight: 'bold' },
  itemPhone: { color: '#94a3b8', fontSize: 11, marginVertical: 1 },
  itemAmount: { fontSize: 13, fontWeight: 'bold', marginTop: 2 },
  textRed: { color: '#ef4444' },
  textGreen: { color: '#22c55e' },
  itemActions: { justifyContent: 'center', alignItems: 'flex-end' },
  waButton: { backgroundColor: '#16a34a', paddingVertical: 4, paddingHorizontal: 8, borderRadius: 4, marginBottom: 4 },
  waButtonText: { color: '#fff', fontSize: 10, fontWeight: 'bold' },
  deleteButton: { backgroundColor: '#dc2626', paddingVertical: 4, paddingHorizontal: 8, borderRadius: 4 },
  deleteButtonText: { color: '#fff', fontSize: 10, fontWeight: 'bold' },
  emptyText: { color: '#64748b', textAlign: 'center', marginTop: 15, fontSize: 12 }
});
