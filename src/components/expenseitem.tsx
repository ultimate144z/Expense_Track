// src/components/ExpenseItem.tsx
import React from 'react';

interface ExpenseItemProps {
  title: string;
  amount: number;
  date: Date;
}

const ExpenseItem: React.FC<ExpenseItemProps> = ({ title, amount, date }) => {
  return (
    <div>
      <h2>{title}</h2>
      <div>${amount}</div>
      <div>{date.toDateString()}</div>
    </div>
  );
};

export default ExpenseItem;
