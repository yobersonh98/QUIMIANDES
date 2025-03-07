"use client"

import React from 'react'
import { Button } from '../ui/button'
import Link from 'next/link'
import { Eye, Pencil } from 'lucide-react'

type DataTableDefaultRowAccionesProps = {
  pathName: string
  modifyPathName: string
}

export default function DataTableDefaultRowAcciones({ pathName, modifyPathName }: DataTableDefaultRowAccionesProps) {
  return (
    <div className="flex space-x-2">
      <Link href={pathName} passHref>
        <Button size={"icon"} variant={"secondary"}
          title="Ver"
        >
          <Eye size={18} />
        </Button>
      </Link>
      <Link href={modifyPathName} passHref>
        <Button size={"icon"}
          title="Editar">
          <Pencil size={18} />
        </Button>
      </Link>
    </div>
  )
}
