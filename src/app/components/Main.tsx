import React, { ReactNode } from 'react'

interface MainPropsType extends React.PropsWithChildren {
    children: ReactNode
}

export default function Main({children}: MainPropsType) {
  return (
    <div className='flex-1 flex flex-col p-4 sm:p-8'>
        {children}
    </div>
  )
}
