'use client'


import Hero from "./components/Hero";
import Main from "./components/Main";
import { useAuth } from "../../context/AuthContext";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Loading from "./components/Loading";


export default function Home() {

  const {currentUser, loading} = useAuth()
  const router = useRouter()

  useEffect(() => {
    if(!loading && currentUser) {
      router.push('/dashboard')
    }
  }, [loading, currentUser, router])

  if(loading) return <Loading />

  return (
    <Main>
      <Hero />
    </Main>
  );
}
