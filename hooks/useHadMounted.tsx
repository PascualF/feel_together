'use client'

import { useEffect, useState } from "react"

export default function useHasMounted() {
    const [hadMounted, setHasMounted ] = useState(false)
    useEffect(() => {
        setHasMounted(true)
    }, [])

    return hadMounted
}