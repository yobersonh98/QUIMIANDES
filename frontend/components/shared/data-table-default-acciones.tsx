"use client"

import React from 'react'
import { Button } from '../ui/button'
import Link from 'next/link'
import { Eye, Pencil } from 'lucide-react'

type DataTableDefaultRowAccionesProps = {
  pathName: string
  modifyPathName: string
  modifyTitle?: string
  viewTitle?: string
  ViewIcon?: React.ReactNode
  ModifyIcon?: React.ReactNode
}

export default function DataTableDefaultRowAcciones({ pathName, modifyPathName, modifyTitle="Editar", viewTitle="Ver", ViewIcon, ModifyIcon  }: DataTableDefaultRowAccionesProps) {
  return (
    <div className="flex space-x-2">
      <Link href={pathName} passHref>
        <Button size={"icon"} variant={"secondary"}
          title={viewTitle}
        >
          {ViewIcon ? ViewIcon : <Eye size={18} />}
        </Button>
      </Link>
      <Link href={modifyPathName} passHref>
        <Button size={"icon"}
          title={modifyTitle}>
          {ModifyIcon ? ModifyIcon : <Pencil size={18} />}
        </Button>
      </Link>
    </div>
  )
}
