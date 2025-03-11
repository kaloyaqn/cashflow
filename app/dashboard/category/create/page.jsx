'use client';

import { useState } from 'react';
import { addCategory } from '@/lib/database';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from "sonner";
import { useRouter } from 'next/navigation'; // Import useRouter

export default function AddCategoryForm() {
  const [name, setName] = useState('');
  const [color, setColor] = useState(null); // Default color
  const [icon, setIcon] = useState('📁'); // Default icon
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter(); // Initialize useRouter

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const newCategory = await addCategory({ name, color, icon });
      console.log('Category added:', newCategory);
      // Reset form fields after successful submission
      setName('');
      setColor('#000000');
      setIcon('📁');
      toast('Успешно създаде нова категория');
      router.push('/dashboard/category'); // Use router.push for navigation
    } catch (err) {
      console.error('Error adding category:', err);
      toast(err.message || 'Failed to add category');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h1 className="text-xl font-semibold">Добавяне на категория</h1>
      <div className="flex md:flex-row flex-col gap-2 w-full">
        <div className="w-full">
          <Label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Име на категорията
          </Label>
          <Input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            required
          />
        </div>
        <div className="w-full">
          <Label htmlFor="icon" className="block text-sm font-medium text-gray-700">
            Икона
          </Label>
          <Input
            id="icon"
            type="text"
            value={icon}
            onChange={(e) => setIcon(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            placeholder="Enter an emoji (e.g., 📁)"
          />
        </div>
      </div>
      <Button
        type="submit"
        disabled={loading}
        className="bg-indigo-600 hover:bg-indigo-700 w-full"
      >
        {loading ? 'Добавяне...' : 'Добави категория'}
      </Button>
    </form>
  );
}
