'use client'

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getExpenses } from "@/lib/database";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function ExpenseListing() {
        const { data: session, status } = useSession();
        const user = session?.user;
        const [expenses, setExpenses] = useState([]);
        const [loading, setLoading] = useState(true);
      
        // Call your new /api/expenses route
        const loadExpenses = async () => {
          if (!user) return;
          try {
            setLoading(true);
            const res = await fetch("/api/expenses");
            if (!res.ok) {
              const errorData = await res.json().catch(() => ({}));
              throw new Error(`Failed to fetch expenses: ${res.status} ${errorData.error || ""}`);
            }
            
            const data = await res.json();
            setExpenses(data || []);
            console.log("Loaded expenses:", data?.length || 0);
          } catch (error) {
            console.error("Error loading expenses:", error);
          } finally {
            setLoading(false);
          }
        };
      
        useEffect(() => {
          if (user) {
            loadExpenses();
            
          }
        }, [user]);
      
    
      // Animation variants for the table container
      const tableVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.5, ease: "easeOut" },
        },
      };
    
      // Animation variants for each table row
      const rowVariants = {
        hidden: { opacity: 0, x: -10 },
        visible: (i) => ({
          opacity: 1,
          x: 0,
          transition: { delay: i * 0.05, duration: 0.3, ease: "easeOut" },
        }),
      };
    return (
        <>
        {loading ? (
        // Skeleton that matches the table structure
        <Skeleton className="bg-muted/50 aspect-video rounded-xl">
        </Skeleton>
      ) : (
        <motion.div
          initial="hidden"
          animate="visible"
          variants={tableVariants}
          className="overflow-hidden flex flex-col gap-2"
        >
          <div className="flex flex-col gap-2">
            <div className="flex flex-col gap-4">
              {expenses.length === 0 ? (
                <div>
                  <div
                    colSpan={5}
                    className="text-center text-lg py-10 flex flex-col gap-2"
                  >
                    Все още не сте добавили разходи.
                    <Link href="/dashboard/expenses/create">
                      <Button size="lg">Добави разход</Button>
                    </Link>
                  </div>
                </div>
              ) : (
                expenses.map((expense, index) => (
                  <motion.div
                    key={expense.id}
                    custom={index}
                    initial="hidden"
                    animate="visible"
                    variants={rowVariants}
                    className="border-b border-gray-100 flex flex-row justify-between items-center pb-3"
                  >
                    {/* <TableCell className="font-medium">
                      {expense.categories.icon} {expense.categories.name}
                    </TableCell>
                    <TableCell>{expense.description}</TableCell>
                    <TableCell>{expense.amount} лв.</TableCell>
                    <TableCell>{expense.date}</TableCell>
                    <TableCell className="flex justify-end items-end">
                      <Link href={`expense/edit/${expense.id}`}>
                        <Button variant="outline" className="!bg-yellow-300">
                          Редактирай
                        </Button>
                      </Link>
                    </TableCell> */}

                    <div className="flex flex-row gap-2" >
                        <div className="md:p-4 p-3 bg-gray-50 rounded-md md:text-base text-sm">
                        {expense.categories?.icon ?? "🗂"}
                        </div>
                        <div>
                            <h2 className="md:text-lg font-medium text-base">{expense.categories?.name ?? "Грешка при извличането на име"}</h2>
                            <h2 className="text-gray-500">{expense.description} • {expense.date}</h2>
                        </div>
                    </div>

                    <div className="font-semibold text-lg">
                        {expense.amount} лв.
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </div>
        </motion.div>
      )}
        </>
    )
}