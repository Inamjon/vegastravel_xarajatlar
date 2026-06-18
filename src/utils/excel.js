import * as XLSX from 'xlsx';

const MONTHS_UZ = [
  'Yanvar', 'Fevral', 'Mart', 'Aprel', 'May', 'Iyun',
  'Iyul', 'Avgust', 'Sentabr', 'Oktabr', 'Noyabr', 'Dekabr'
];

export function exportReportsToExcel(records, year, month) {
  const monthName = MONTHS_UZ[parseInt(month) - 1];
  const sheetData = [
    [`${monthName} ${year} - Oylik Hisobot`],
    [],
    ['#', 'Davlat', 'Summa', 'Jami Summa', 'Tur Operator', 'Foyda', 'Jami Sumda (UZS)'],
    ...records.map((r, i) => [
      i + 1,
      r.davlat || '',
      parseFloat(r.summa) || 0,
      parseFloat(r.jamiSumma) || 0,
      r.turOperator || '',
      parseFloat(r.foyda) || 0,
      parseFloat(r.jammiSumda) || 0,
    ]),
    [],
    [
      '', 'JAMI:',
      records.reduce((s, r) => s + (parseFloat(r.summa) || 0), 0),
      records.reduce((s, r) => s + (parseFloat(r.jamiSumma) || 0), 0),
      '',
      records.reduce((s, r) => s + (parseFloat(r.foyda) || 0), 0),
      records.reduce((s, r) => s + (parseFloat(r.jammiSumda) || 0), 0),
    ],
  ];

  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.aoa_to_sheet(sheetData);

  // Ustun kengliklari
  ws['!cols'] = [
    { wch: 4 }, { wch: 18 }, { wch: 14 }, { wch: 14 },
    { wch: 18 }, { wch: 14 }, { wch: 18 },
  ];

  // Sarlavha birlashtirish
  ws['!merges'] = [{ s: { r: 0, c: 0 }, e: { r: 0, c: 6 } }];

  XLSX.utils.book_append_sheet(wb, ws, `${monthName} ${year}`);
  XLSX.writeFile(wb, `hisobot_${year}_${String(month).padStart(2, '0')}_${monthName}.xlsx`);
}

export function exportExpensesToExcel(records, year, month) {
  const monthName = MONTHS_UZ[parseInt(month) - 1];
  const sheetData = [
    [`${monthName} ${year} - Oylik Xarajatlar`],
    [],
    ['#', 'Sana', 'Sabab', 'Summa (UZS)'],
    ...records.map((r, i) => [
      i + 1,
      r.sana || '',
      r.sabab || '',
      parseFloat(r.summa) || 0,
    ]),
    [],
    [
      '', '', 'JAMI XARAJAT:',
      records.reduce((s, r) => s + (parseFloat(r.summa) || 0), 0),
    ],
  ];

  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.aoa_to_sheet(sheetData);

  ws['!cols'] = [{ wch: 4 }, { wch: 14 }, { wch: 30 }, { wch: 16 }];
  ws['!merges'] = [{ s: { r: 0, c: 0 }, e: { r: 0, c: 3 } }];

  XLSX.utils.book_append_sheet(wb, ws, `${monthName} ${year}`);
  XLSX.writeFile(wb, `xarajat_${year}_${String(month).padStart(2, '0')}_${monthName}.xlsx`);
}

export { MONTHS_UZ };
