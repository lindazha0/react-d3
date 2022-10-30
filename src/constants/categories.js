const incomeColors = ["#003333", "#006633", "#009933", "#00CC66", "#00FF99"];
const expenseColors = [
  "#CC0000",
  "#CC3300",
  "#cC3333",
  "#CC6633",
  "#CC6666",
  "#FF6666",
];

export const incomeCategories = [
  { type: "Deposits", amount: 0, color: incomeColors[0] },
  { type: "Gifts", amount: 0, color: incomeColors[1] },
  { type: "Salary", amount: 0, color: incomeColors[2] },
  { type: "Savings", amount: 0, color: incomeColors[3] },
];

export const expenseCategories = [
  { type: "Food", amount: 0, color: expenseColors[0] },
  { type: "Transportation", amount: 0, color: expenseColors[1] },
  { type: "Shopping", amount: 0, color: expenseColors[2] },
  { type: "Entertainment", amount: 0, color: expenseColors[3] },
  { type: "Self Care", amount: 0, color: expenseColors[4] },
  { type: "Other", amount: 0, color: expenseColors[5] },
];

export const resetCategories = () => {
  incomeCategories.forEach((c) => (c.amount = 0));
  expenseCategories.forEach((c) => (c.amount = 0));
};
