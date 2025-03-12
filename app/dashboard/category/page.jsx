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
import { getCategories } from "@/lib/database";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion"; // Add framer-motion for animations
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Page() {
  const { data: session, status } = useSession();
  const user = session?.user;
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Simple function to load categories
  const loadCategories = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const data = await getCategories(24);
      setCategories(data || []);
      console.log("Loaded categories:", data?.length || 0);
    } catch (error) {
      console.error("Error loading categories:", error);
    } finally {
      setLoading(false);
    }
  };

  // Load categories when user is available
  useEffect(() => {
    if (user) {
      loadCategories();
    }
  }, [user]);

  // Animation variants for the table
  const tableVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  // Animation variants for table rows
  const rowVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: (i) => ({ 
      opacity: 1, 
      x: 0,
      transition: { 
        delay: i * 0.05, // Stagger the animations
        duration: 0.3,
        ease: "easeOut"
      }
    })
  };

  // Show a loader while session is loading
  if (status === "loading") {
    return <div>Loading session...</div>;
  }

  // If there is no user, prompt for login
  if (!user) {
    return <div>Please log in to view your categories.</div>;
  }

  return (
    <>
      {loading ? (
        // Skeleton matching the table structure
        <div className="rounded-md border">
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
          className="overflow-hidden rounded-md border"
        >
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Име</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-lg py-10 flex flex-col gap-2">
                    Все още не сте добавили категория.
                    <Link href="/dashboard/category/create">
                      <Button size="lg">Създай категория</Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ) : (
                categories.map((category, index) => (
                  <motion.tr
                    key={category.id}
                    custom={index} // Pass the index for staggered animations
                    initial="hidden"
                    animate="visible"
                    variants={rowVariants}
                    className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
                  >
                    <TableCell className="font-medium">
                      {category.icon} {category.name || "Uncategorized"}
                    </TableCell>
                    <TableCell className="flex justify-end items-end">
                      <Link href={`category/edit/${category.id}`}>
                        <Button variant="outline" className="!bg-yellow-300">
                          Редактирай
                        </Button>
                      </Link>
                    </TableCell>
                  </motion.tr>
                ))
              )}
            </TableBody>
          </Table>
        </motion.div>
      )}
    </>
  );
}
