import { supabase } from '@/lib/supabase';

// Expenses
export async function getExpenses(limit = 24) {
    const { data: userData } = await supabase.auth.getUser();
    const userId = userData?.user?.id;
    
    if (!userId) throw new Error("User must be authenticated");
    
    const { data, error } = await supabase
      .from('expenses')
      .select(`
        id,
        user_id,
        amount,
        description,
        date,
        categories(id, name, icon)
      `)
      .eq('user_id', userId) // Only get expenses for current user
      .order('date', { ascending: false })
      .limit(limit);
    
    if (error) throw error;
    return data;
}
  
export async function addExpense(expense) {
  const { data: userData } = await supabase.auth.getUser();
  const userId = userData?.user?.id;
  
  if (!userId) throw new Error("User must be authenticated");
  
  // Ensure the expense has the current user's ID
  const expenseWithUserId = {
    ...expense,
    user_id: userId
  };
  
  const { data, error } = await supabase
    .from('expenses')
    .insert(expenseWithUserId)
    .select();
  
  if (error) throw error;
  return data;
}

// Get categories for the current user and default categories
export async function getCategories() {
  const { data: userData } = await supabase.auth.getUser();
  const userId = userData?.user?.id;
  
  if (!userId) throw new Error("User must be authenticated");
  
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .or(`user_id.eq.${userId},user_id.is.null`) // Get user's categories AND default ones
    .order('name');
  
  if (error) throw error;
  return data;
}

// Add a new category for the current user
export async function addCategory(category) {
  const { data: userData } = await supabase.auth.getUser();
  const userId = userData?.user?.id;
  
  if (!userId) throw new Error("User must be authenticated");
  
  // Ensure the category has the current user's ID
  const categoryWithUserId = {
    ...category,
    user_id: userId
  };
  
  const { data, error } = await supabase
    .from('categories')
    .insert(categoryWithUserId)
    .select();
  
  if (error) throw error;
  return data;
}

// Update an existing category
export async function updateCategory(id, updates) {
  const { data: userData } = await supabase.auth.getUser();
  const userId = userData?.user?.id;
  
  if (!userId) throw new Error("User must be authenticated");
  
  // First check if this category belongs to the user
  const { data: categoryData, error: categoryError } = await supabase
    .from('categories')
    .select('user_id')
    .eq('id', id)
    .single();
  
  if (categoryError) throw categoryError;
  
  // Only allow updating if the category belongs to the user
  if (categoryData.user_id !== userId) {
    throw new Error("Cannot update a category that doesn't belong to you");
  }
  
  const { data, error } = await supabase
    .from('categories')
    .update(updates)
    .eq('id', id)
    .select();
  
  if (error) throw error;
  return data;
}

// Delete a category
export async function deleteCategory(id) {
  const { data: userData } = await supabase.auth.getUser();
  const userId = userData?.user?.id;
  
  if (!userId) throw new Error("User must be authenticated");
  
  // First check if this category belongs to the user
  const { data: categoryData, error: categoryError } = await supabase
    .from('categories')
    .select('user_id')
    .eq('id', id)
    .single();
  
  if (categoryError) throw categoryError;
  
  // Only allow deletion if the category belongs to the user
  if (categoryData.user_id !== userId) {
    throw new Error("Cannot delete a category that doesn't belong to you");
  }
  
  // Check if the category is in use
  const { count, error: countError } = await supabase
    .from('expenses')
    .select('id', { count: 'exact' })
    .eq('category_id', id);
  
  if (countError) throw countError;
  
  // Don't allow deletion if the category is in use
  if (count > 0) {
    throw new Error("Cannot delete a category that is in use by expenses");
  }
  
  const { error } = await supabase
    .from('categories')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
  return true;
}

// Get a single expense by ID
export async function getExpenseById(id) {
  const { data: userData } = await supabase.auth.getUser();
  const userId = userData?.user?.id;
  
  if (!userId) throw new Error("User must be authenticated");
  
  const { data, error } = await supabase
    .from('expenses')
    .select(`
      id,
      user_id,
      amount,
      description,
      date,
      category_id,
      categories(id, name, color, icon)
    `)
    .eq('id', id)
    .eq('user_id', userId) // Ensure the expense belongs to the user
    .single();
  
  if (error) throw error;
  return data;
}

// Update an expense
export async function updateExpense(id, updates) {
  const { data: userData } = await supabase.auth.getUser();
  const userId = userData?.user?.id;
  
  if (!userId) throw new Error("User must be authenticated");
  
  // First check if this expense belongs to the user
  const { data: expenseData, error: expenseError } = await supabase
    .from('expenses')
    .select('user_id')
    .eq('id', id)
    .single();
  
  if (expenseError) throw expenseError;
  
  // Only allow updating if the expense belongs to the user
  if (expenseData.user_id !== userId) {
    throw new Error("Cannot update an expense that doesn't belong to you");
  }
  
  const { data, error } = await supabase
    .from('expenses')
    .update(updates)
    .eq('id', id)
    .select();
  
  if (error) throw error;
  return data;
}

// Delete an expense
export async function deleteExpense(id) {
  const { data: userData } = await supabase.auth.getUser();
  const userId = userData?.user?.id;
  
  if (!userId) throw new Error("User must be authenticated");
  
  // First check if this expense belongs to the user
  const { data: expenseData, error: expenseError } = await supabase
    .from('expenses')
    .select('user_id')
    .eq('id', id)
    .single();
  
  if (expenseError) throw expenseError;
  
  // Only allow deletion if the expense belongs to the user
  if (expenseData.user_id !== userId) {
    throw new Error("Cannot delete an expense that doesn't belong to you");
  }
  
  const { error } = await supabase
    .from('expenses')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
  return true;
}
