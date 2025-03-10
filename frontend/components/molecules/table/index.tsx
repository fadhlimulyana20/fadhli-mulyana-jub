import { ReactNode, useState } from "react";
import { FaCheck, FaTimes } from "react-icons/fa";
import { FiEye, FiMoreVertical, FiTrash } from "react-icons/fi";
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'

interface option {
  name: string
  accessor: string | Function
  customAccessor?: Function
  withLink?: boolean
  link?: string | Function
  type?: 'date' | 'string' | 'boolean' | any | Array<string> | 'datenotnull' | 'currency'
  customTextTrue?: string | ReactNode
  customTextFalse?: string | ReactNode
  truncate?: boolean
}

export interface ActionTableType {
  name: string;
  action: (id: any) => any
}

export default function TableKey({
  data,
  options,
  onDetail,
  showAction = true,
  rowWithActionClick = false,
  rowActionClick = () => { },
  actions = [],
  onDelete = (id) => null
}: {
  data: Array<any>,
  options: Array<option>,
  showDeleteButton?: boolean,
  showAction?: boolean,
  rowWithActionClick?: boolean,
  rowActionClick?: Function
  actions?: Array<ActionTableType>,
  onDetail?: (id: any) => any,
  onDelete?: (id: any) => any
}) {
  const [modalDeleteOpen, setModalDeleteOpen] = useState(false)
  const [idToDelete, setIdToDelete] = useState(0)
  const [isDeleting, setIsDeleting] = useState(false)

  const dateOptions: Intl.DateTimeFormatOptions = {
    day: 'numeric',
    month: 'numeric',
    year: 'numeric',
    hour: "numeric",
    minute: "numeric",
    timeZone: "Asia/Jakarta",
    timeZoneName: "short",
  };

  return (
    <>
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg border border-gray-200 dark:border-gray-700">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              {options.map((o, idx) => (<th scope="col" className="px-6 py-3" key={idx}>{o.name}</th>))}
              <th className={`px-6 py-3 ${showAction ? '' : 'hidden'}`}>Pilihan</th>
            </tr>
          </thead>
          <tbody>
            {data.map((d, idx) => (
              <tr
                key={idx}
                className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700 border-gray-200"
                onClick={() => {
                  if (rowWithActionClick) {
                    rowActionClick(d.id)
                  }
                }}
              >
                {/* <Td>{idx + 1}</Td> */}
                {options.map((o, oidx) => {
                  if (typeof o.accessor === 'string') {
                    if (o.type && o.type === 'date') {
                      return (
                        <td key={oidx} className="px-6 py-4">
                          { new Intl.DateTimeFormat("id-ID", dateOptions).format(new Date(eval(`d.${o.accessor}`))) }
                        </td>
                      )
                      // return (<Td key={oidx}><Moment format="DD-MM-YYYY, HH:mm z" date={new Date(eval(`d.${o.accessor}`))} /></Td>)
                    } else if (o.type && o.type === 'boolean') {
                      return (
                        <td key={oidx} className="px-6 py-4">
                          {eval(`d.${o.accessor}`) === true ? <FaCheck color="green" /> : <FaTimes color="red" />}
                        </td>
                      )
                    } else if (o.type && o.type === 'datenotnull') {
                      return (
                        <td key={oidx} className="px-6 py-4">
                          {Date.parse(eval(`d.${o.accessor}`)) > 0 ? o.customTextTrue || 'Benar' : o.customTextFalse || 'Salah'}
                        </td>
                      )
                      // return (<Td color={Date.parse(eval(`d.${o.accessor}`)) > 0 ? 'green.500' : 'red.500'} key={oidx}>{Date.parse(eval(`d.${o.accessor}`)) > 0 ? o.customTextTrue || 'Benar' : o.customTextFalse || 'Salah'}</Td>)
                    } else if (o.type && o.type === 'custom') {
                      return (
                        <td key={oidx} className="px-6 py-4">
                          {typeof o.customAccessor !== 'undefined' && o.customAccessor(eval(`d.${o.accessor}`))}
                        </td>
                      )
                      // return (<Td key={oidx}>{typeof o.customAccessor !== 'undefined' && o.customAccessor(eval(`d.${o.accessor}`))}</Td>)
                    }

                    if (o.truncate) {
                      return (
                        <td key={oidx} className="px-6 py-4 break-words whitespace-pre-wrap">
                          {eval(`d.${o.accessor}`)}
                        </td>
                      )
                    }

                    return (
                      <td key={oidx} className="px-6 py-4">
                        {eval(`d.${o.accessor}`)}
                      </td>
                    )
                  } else {
                    return (
                      <td key={oidx} className="px-6 py-4">
                        { }
                      </td>
                    )
                  }
                })}
                <td className={`px-6 py-4 ${showAction ? '' : 'hidden'}`}>
                  <Menu>
                    <MenuButton
                      className={`hover:bg-gray-200 dark:hover:bg-gray-700 p-1 rounded-md cursor-pointer`}
                    >
                      <FiMoreVertical />
                    </MenuButton>
                    <MenuItems
                      transition
                      anchor="bottom end"
                      className="min-w-18 py-2 origin-top-right rounded-xl border border-gray-800/80 bg-gray-500/80 p-1 text-sm/6 text-white transition duration-100 ease-out [--anchor-gap:var(--spacing-1)] focus:outline-none data-[closed]:scale-95 data-[closed]:opacity-0"
                    >
                      {actions.map((obj, idx) => (
                        <MenuItem key={idx}>
                          <button
                            className="block data-[focus]:bg-blue-500/50 rounded-md px-2 w-full cursor-pointer"
                            onClick={() => obj.action(d.id)}
                          >
                            {obj.name}
                          </button>
                        </MenuItem>
                      ))}
                    </MenuItems>
                  </Menu>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}
