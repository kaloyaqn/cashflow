'use client';

import { useState, useEffect } from 'react';
import { addExpense, getCategories } from '@/lib/database';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from "sonner";
import { useRouter } from 'next/navigation'; // Import useRouter

export default function AddExpenseForm() {
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [categoryId, setCategoryId] = useState(''); // Selected category ID
  const [categories, setCategories] = useState([]); // List of categories
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter(); // Initialize useRouter

  // Fetch categories on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategories();
        setCategories(data);
      } catch (err) {
        console.error('Error fetching categories:', err);
        toast('Failed to load categories');
      }
    };

    fetchCategories();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Create a new expense
      const newExpense = await addExpense({
        amount: parseFloat(amount), // Ensure amount is a number
        description,
        date,
        category_id: categoryId, // Pass the selected category ID
      });

      console.log('Expense added:', newExpense);

      // Reset form fields after successful submission
      setAmount('');
      setDescription('');
      setDate('');
      setCategoryId('');

      toast('Успешно добави нов разход');
      router.push('/dashboard/expenses'); // Redirect to the expenses page
    } catch (err) {
      console.error('Error adding expense:', err);
      toast(err.message || 'Failed to add expense');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h1 className="text-xl font-semibold">Добавяне на разход</h1>
      <div className="flex md:flex-row flex-col gap-2 w-full">
        <div className="w-full">
          <Label htmlFor="amount" className="block text-sm font-medium text-gray-700">
            Сума
          </Label>
          <Input
            id="amount"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            placeholder="Въведи сума"
            required
          />
        </div>
        <div className="w-full">
          <Label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Описание
          </Label>
          <Input
            id="description"
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            placeholder="Въведи описание"
            required
          />
        </div>
      </div>
      <div className="flex md:flex-row flex-col gap-2 w-full">
        <div className="w-full">
          <Label htmlFor="date" className="block text-sm font-medium text-gray-700">
            Дата
          </Label>
          <Input
            id="date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            required
          />
        </div>
        <div className="w-full">
          <Label htmlFor="category" className="block text-sm font-medium text-gray-700">
            Категория
          </Label>
          <Select onValueChange={(value) => setCategoryId(value)}>
            <SelectTrigger className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
              <SelectValue placeholder="Избери категория" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <Button
        type="submit"
        disabled={loading}
        className="bg-indigo-600 hover:bg-indigo-700 w-full"
      >
        {loading ? 'Добавяне...' : 'Добави разход'}
      </Button>
    </form>
  );
}
