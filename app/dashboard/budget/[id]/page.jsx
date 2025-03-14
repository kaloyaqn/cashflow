"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

export default function Page() {
  const { data: session, status } = useSession();
  const user = session?.user;

  const [budget, setBudget] = useState([]);

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
    setBudget(data);
  };

  useEffect(() => {
    loadBudgets();
  }, [user]);

  return (
    <>
      {/* <h1>Вашият бюджет е: {budget[0].amount}</h1> */}
      {budget.length > 0 && <>{budget[0].amount}</>}
    </>
  );
}
