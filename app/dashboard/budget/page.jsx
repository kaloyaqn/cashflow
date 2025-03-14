"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";



export default function Page() {
  const { data: session } = useSession();
  const user = session?.user;

  const [budget, setBudget] = useState([]);
  const [budgetAmount, setBudgetAmount] = useState(0);

  const loadBudgets = async () => {
    if (!user) {
      console.log("User is not available yet.");
      return;
    }

    const res = await fetch(`/api/budgets`);
    if (!res.ok) {
      console.log("Error fetching data", res);
      return;
    }

    const data = await res.json();
    console.log("Fetched data:", data);

    if (data.length > 0) {
      setBudget(data);
      setBudgetAmount(data[0]?.amount || 0);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Ensure budgetAmount is a valid number
      if (isNaN(parseFloat(budgetAmount)) || parseFloat(budgetAmount) <= 0) {
        throw new Error("Моля, въведете валидна сума.");
      }

      const res = await fetch(`/api/budgets/${budget[0]?.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ amount: parseFloat(budgetAmount) }),
      });

      if (!res.ok) {
        throw new Error("Грешка при актуализиране на бюджета.");
      }

      const updatedBudget = await res.json();
      console.log("Updated Budget:", updatedBudget);
      setBudgetAmount(updatedBudget[0]?.amount || 0);

      toast.success("Бюджетът е актуализиран успешно!");
    } catch (err) {
      console.error("Error updating budget:", err);
      toast.error(err.message || "Неуспешна актуализация на бюджета");
    }
  };

  useEffect(() => {
    if (user) {
      loadBudgets();
    }
  }, [user]);

  return (
    <>
      <h1 className="text-2xl">Вашият бюджет:</h1>
      <Input
        type="number"
        value={budgetAmount}
        onChange={(e) => setBudgetAmount(e.target.value)}
        placeholder='Въведете бюджет'
      />
      <Button onClick={handleSubmit}>Запази бюджета</Button>
    </>
  );
}
