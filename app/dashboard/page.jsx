"use client";

import { useEffect, useState, useCallback } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuthContext } from "@/components/AuthProvider";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getExpenses } from "@/lib/database";

// Cache duration in milliseconds (e.g., 5 minutes)
const CACHE_DURATION = 5 * 60 * 1000;

export default function Page() {
  const { user } = useAuthContext();
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);

  // Memoize loadExpenses to prevent recreation on each render
  const loadExpenses = useCallback(async (forceRefresh = false) => {
    if (!user) return;
    
    try {
      setLoading(true);
      
      // Check cache unless force refreshing
      if (!forceRefresh) {
        const cachedData = localStorage.getItem(`expenses_${user.id}_10`);
        
        if (cachedData) {
          const { data, timestamp } = JSON.parse(cachedData);
          const isExpired = Date.now() - timestamp > CACHE_DURATION;
          
          if (!isExpired) {
            console.log("Using cached expenses data");
            setExpenses(data);
            setLoading(false);
            return;
          }
          console.log("Cache expired, fetching fresh data");
        }
      }

      // Fetch fresh data
      const data = await getExpenses(10);
      setExpenses(data || []);
      
      // Store in cache
      localStorage.setItem(
        `expenses_${user.id}_10`,
        JSON.stringify({
          data: data,
          timestamp: Date.now()
        })
      );
      
      console.log("Loaded and cached expenses:", data?.length || 0);
    } catch (error) {
      console.error("Error loading expenses:", error);
      
      // Try to use cached data on error
      try {
        const cachedData = localStorage.getItem(`expenses_${user.id}_10`);
        if (cachedData) {
          const { data } = JSON.parse(cachedData);
          console.log("Using expired cache due to fetch error");
          setExpenses(data);
        }
      } catch (cacheError) {
        console.error("Could not retrieve cache:", cacheError);
      }
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Load expenses when user is available
  useEffect(() => {
    if (user) {
      loadExpenses();
    }
  }, [user, loadExpenses]);

  return (
    <ProtectedRoute>
      <div className="grid auto-rows-min gap-4 md:grid-cols-3">
        {loading ? (
          <div className="col-span-3 p-4 text-center">Loading expenses...</div>
        ) : (
          <>
            {/* <div className="col-span-3 flex justify-between items-center mb-2">
              <h2 className="text-xl font-semibold">Recent Expenses</h2>
              <button 
                onClick={() => loadExpenses(true)}
                className="px-3 py-1 text-sm bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
              >
                Refresh
              </button>
            </div> */}
            <Table className="col-span-3">
              <TableHeader>
                <TableRow>
                  <TableHead>Вид покупка</TableHead>
                  <TableHead>Описание</TableHead>
                  <TableHead>Стойност</TableHead>
                  <TableHead>Дата</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {expenses.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center">
                      No expenses found
                    </TableCell>
                  </TableRow>
                ) : (
                  expenses.map((expense) => (
                    <TableRow key={expense.id}>
                      <TableCell className="font-medium">
                        {expense.categories.name}
                      </TableCell>
                      <TableCell className="">{expense.description}</TableCell>
                      <TableCell>{expense.amount} лв.</TableCell>
                      <TableCell>{expense.date}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </>
        )}

        <div className="bg-muted/50 aspect-video rounded-xl" />
        <div className="bg-muted/50 aspect-video rounded-xl" />
      </div>
    </ProtectedRoute>
  );
}
