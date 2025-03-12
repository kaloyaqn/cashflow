"use client";

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

export default function Page() {
  const { data: session, status } = useSession();
  const user = session?.user;
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);

  // Function to load expenses (without caching)
  const loadExpenses = async () => {
    if (!user) return;
    try {
      setLoading(true);
      const data = await getExpenses(10);
      setExpenses(data || []);
      console.log("Loaded expenses:", data?.length || 0);
    } catch (error) {
      console.error("Error loading expenses:", error);
    } finally {
      setLoading(false);
    }
  };

  // Load expenses once the user is available
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

  // Show a loader while the session is loading
  if (status === "loading") {
    return <div>Loading session...</div>;
  }

  // Prompt the user to log in if not authenticated
  if (!user) {
    return <div>Please log in to view your expenses.</div>;
  }

  return (
    <>
        <h2 className="text-2xl font-semibold mb-4">Разходи</h2>
      {loading ? (
        // Skeleton that matches the table structure
        <div className="rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>
                  <Skeleton className="h-6 w-24" />
                </TableHead>
                <TableHead>
                  <Skeleton className="h-6 w-24" />
                </TableHead>
                <TableHead>
                  <Skeleton className="h-6 w-24" />
                </TableHead>
                <TableHead>
                  <Skeleton className="h-6 w-24" />
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[...Array(8)].map((_, i) => (
                <TableRow key={i}>
                  <TableCell>
                    <Skeleton className="h-5 w-20" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-5 w-32" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-5 w-16" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-5 w-24" />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
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
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="text-center text-lg py-10 flex flex-col gap-2"
                  >
                    Все още не сте добавили разходи.
                    <Link href="/dashboard/expense/create">
                      <Button size="lg">Добави разход</Button>
                    </Link>
                  </TableCell>
                </TableRow>
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
                        <div className="p-4 bg-gray-50 rounded-md">
                            {expense.categories.icon}
                        </div>
                        <div>
                            <h2 className="text-lg font-medium">{expense.categories.name}</h2>
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
  );
}
