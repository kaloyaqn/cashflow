'use client'

import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export default function Home() {

  return (
    <div className='h-[100vh] grid place-items-center'>
      <Link href='/login'>
      <Button size="lg">Пренасочване, логин</Button>
      </Link>
    </div>
  );
}
