// LocalStorage bilan ishlash uchun utility funksiyalar

const REPORTS_KEY = 'tourReports';
const EXPENSES_KEY = 'tourExpenses';

// ==================== HISOBOTLAR ====================

export function getAllReports() {
  try {
    const data = localStorage.getItem(REPORTS_KEY);
    return data ? JSON.parse(data) : {};
  } catch {
    return {};
  }
}

export function getMonthReports(year, month) {
  const all = getAllReports();
  const key = `${year}-${String(month).padStart(2, '0')}`;
  return all[key] || [];
}

export function saveMonthReports(year, month, records) {
  const all = getAllReports();
  const key = `${year}-${String(month).padStart(2, '0')}`;
  all[key] = records;
  localStorage.setItem(REPORTS_KEY, JSON.stringify(all));
}

export function addReport(year, month, record) {
  const records = getMonthReports(year, month);
  const newRecord = {
    ...record,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
  };
  records.push(newRecord);
  saveMonthReports(year, month, records);
  return newRecord;
}

export function updateReport(year, month, id, updated) {
  const records = getMonthReports(year, month);
  const idx = records.findIndex((r) => r.id === id);
  if (idx !== -1) {
    records[idx] = { ...records[idx], ...updated };
    saveMonthReports(year, month, records);
  }
}

export function deleteReport(year, month, id) {
  const records = getMonthReports(year, month);
  const filtered = records.filter((r) => r.id !== id);
  saveMonthReports(year, month, filtered);
}

export function getAllMonthKeys() {
  const all = getAllReports();
  return Object.keys(all).sort().reverse();
}

// ==================== XARAJATLAR ====================

export function getAllExpenses() {
  try {
    const data = localStorage.getItem(EXPENSES_KEY);
    return data ? JSON.parse(data) : {};
  } catch {
    return {};
  }
}

export function getMonthExpenses(year, month) {
  const all = getAllExpenses();
  const key = `${year}-${String(month).padStart(2, '00')}`;
  return all[key] || [];
}

export function saveMonthExpenses(year, month, records) {
  const all = getAllExpenses();
  const key = `${year}-${String(month).padStart(2, '00')}`;
  all[key] = records;
  localStorage.setItem(EXPENSES_KEY, JSON.stringify(all));
}

export function addExpense(year, month, record) {
  const records = getMonthExpenses(year, month);
  const newRecord = {
    ...record,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
  };
  records.push(newRecord);
  saveMonthExpenses(year, month, records);
  return newRecord;
}

export function updateExpense(year, month, id, updated) {
  const records = getMonthExpenses(year, month);
  const idx = records.findIndex((r) => r.id === id);
  if (idx !== -1) {
    records[idx] = { ...records[idx], ...updated };
    saveMonthExpenses(year, month, records);
  }
}

export function deleteExpense(year, month, id) {
  const records = getMonthExpenses(year, month);
  const filtered = records.filter((r) => r.id !== id);
  saveMonthExpenses(year, month, filtered);
}

export function getAllExpenseMonthKeys() {
  const all = getAllExpenses();
  return Object.keys(all).sort().reverse();
}

// ==================== STATISTIKA ====================

export function getDashboardStats() {
  const allReports = getAllReports();
  const allExpenses = getAllExpenses();

  let totalRevenue = 0;
  let totalProfit = 0;
  let totalRecords = 0;
  let monthlyData = [];

  Object.entries(allReports).forEach(([key, records]) => {
    const [year, month] = key.split('-');
    const revenue = records.reduce((sum, r) => sum + (parseFloat(r.jamiSumma) || 0), 0);
    const profit = records.reduce((sum, r) => sum + (parseFloat(r.foyda) || 0), 0);
    totalRevenue += revenue;
    totalProfit += profit;
    totalRecords += records.length;
    monthlyData.push({ key, year, month, revenue, profit, records: records.length });
  });

  let totalExpenses = 0;
  Object.values(allExpenses).forEach((records) => {
    totalExpenses += records.reduce((sum, r) => sum + (parseFloat(r.summa) || 0), 0);
  });

  return {
    totalRevenue,
    totalProfit,
    totalExpenses,
    totalRecords,
    monthlyData: monthlyData.sort((a, b) => a.key.localeCompare(b.key)),
  };
}

// ==================== JSON EKSPORT/IMPORT ====================

export function exportAllData() {
  const data = {
    reports: getAllReports(),
    expenses: getAllExpenses(),
    exportedAt: new Date().toISOString(),
  };
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `hisobot_zaxira_${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

export function importAllData(jsonString) {
  try {
    const data = JSON.parse(jsonString);
    if (data.reports) localStorage.setItem(REPORTS_KEY, JSON.stringify(data.reports));
    if (data.expenses) localStorage.setItem(EXPENSES_KEY, JSON.stringify(data.expenses));
    return true;
  } catch {
    return false;
  }
}
