import {Fragment} from 'react'
import {Menu, Transition} from '@headlessui/react'
import {ChevronDownIcon} from '@heroicons/react/20/solid'

function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}

export default function Dropdown({selected, onClick}) {
    let title = '';
    if (selected === 'all_time') {
        title = "All-time";
    } else if (selected === "weekly") {
        title = "Weekly";
    } else if (selected === "monthly") {
        title = "Monthly";
    }

    return (
        <Menu as="div" className="relative inline-block text-left">
            <div>
                <Menu.Button className="inline-flex w-full justify-center  py-2 text-sm font-medium ">
                    {title}
                    <ChevronDownIcon className="-mr-1 ml-2 h-5 w-5" aria-hidden="true"/>
                </Menu.Button>
            </div>

            <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
            >
                <Menu.Items
                    className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-gray-900 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <div className="py-1">
                        {
                            (selected != 'all_time')
                                ? <Menu.Item>
                                    {({active}) => (
                                        <a
                                            href="#"
                                            onClick={e => onClick(e, 'all_time')}
                                            className={classNames(
                                                active ? 'bg-amber-200 text-black' : 'text-white',
                                                'block px-4 py-2 text-sm'
                                            )}
                                        >
                                            All-time
                                        </a>
                                    )}
                                </Menu.Item>
                                : null
                        }
                        {
                            (selected != 'weekly')
                                ? <Menu.Item>
                                    {({active}) => (
                                        <a
                                            href="#"
                                            onClick={e => onClick(e, 'weekly')}
                                            className={classNames(
                                                active ? 'bg-amber-200 text-black' : 'text-white',
                                                'block px-4 py-2 text-sm'
                                            )}
                                        >
                                            Weekly
                                        </a>
                                    )}
                                </Menu.Item>
                                : null
                        }
                        {
                            (selected != 'monthly')
                                ? <Menu.Item>
                                    {({active}) => (
                                        <a
                                            href="#"
                                            onClick={e => onClick(e, 'monthly')}
                                            className={classNames(
                                                active ? 'bg-amber-200 text-black' : 'text-white',
                                                'block px-4 py-2 text-sm'
                                            )}
                                        >
                                            Monthly
                                        </a>
                                    )}
                                </Menu.Item>
                                : null
                        }
                    </div>
                </Menu.Items>
            </Transition>
        </Menu>
    )
}