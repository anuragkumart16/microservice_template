'use client'

import React, { useState, useEffect } from 'react'
import { MdDelete, MdEdit } from "react-icons/md";



interface App {
    id: string;
    name: string;
    description: string | null;
    hashid: string;
}

function Page() {
    const [overlay, setOverlay] = useState(null)
    const [apps, setApps] = useState<App[]>([])
    const [error, setError] = useState("")
    const [appName, setAppName] = useState("")
    const [appDesc, setAppDesc] = useState("")

    // Edit state
    const [editingApp, setEditingApp] = useState<App | null>(null)
    const [editName, setEditName] = useState("")
    const [editDesc, setEditDesc] = useState("")

    function handleAppCreation() {
        if (appName == "") {
            setError("Please enter app name")
        } else {
            setError("")
        }

        fetch(`/api/allowed-app`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name: appName,
                desc: appDesc
            })
        }).then((res) => res.json())
            .then((data) => {
                if (data.success) {
                    console.log(data)
                    setApps([...apps, data.data])
                    setAppName("")
                    setAppDesc("")
                }
            })
    }

    function handleAppDeletion(id: string) {
        fetch(`/api/allowed-app`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ id })
        }).then((res) => res.json())
            .then((data) => {
                if (data.success) {
                    setApps(apps.filter(app => app.id !== id))
                }
            })
    }

    function openEditModal(app: App) {
        setEditingApp(app)
        setEditName(app.name)
        setEditDesc(app.description || "")
    }

    function closeEditModal() {
        setEditingApp(null)
        setEditName("")
        setEditDesc("")
    }

    function handleUpdateApp() {
        if (!editName || !editingApp) return; // Basic validation

        fetch(`/api/allowed-app`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                id: editingApp.id,
                name: editName,
                desc: editDesc
            })
        }).then((res) => res.json())
            .then((data) => {
                if (data.success) {
                    setApps(apps.map(app => app.id === editingApp.id ? data.data : app))
                    closeEditModal()
                }
            })
    }

    useEffect(() => {
        fetch(`/api/allowed-app`)
            .then((res) => res.json())
            .then((data) => {
                if (data.success) {
                    console.log(data)
                    setApps(data.data)
                }
            })
    }, [])
    return (
        <div className='h-screen w-screen flex flex-col items-center justify-center relative'>
            <h1 className='text-2xl'>Dashboard</h1>
            <div className='p-8 border rounded-xl flex flex-row gap-4'>
                <div className='flex w-auto h-full flex-row'>
                    <div className='w-full border p-4 rounded-lg'>
                        <p className='text-lg mb-4'>Add a new app</p>
                        {error && <p className='text-red-500'>{error}</p>}
                        <div className=' flex flex-col gap-4 '>
                            <input type="text" placeholder='App name' className='px-4 py-2 rounded border' value={appName} onChange={(e) => {
                                setAppName(e.target.value)
                            }} />
                            <textarea name="" id="" className='rounded border p-4' placeholder='Add description ...' value={appDesc} onChange={(e) => {
                                setAppDesc(e.target.value)
                            }}></textarea>
                            <button className='px-4 py-2 bg-white text-black rounded cursor-pointer' onClick={handleAppCreation}>Add</button>
                        </div>
                    </div>
                </div>
                <div className='flex flex-col border rounded-xl p-4 px-6 gap-2 h-100 overflow-auto'>
                    <h1 className='text-2xl'>Apps</h1>
                    {apps ? (<div className='flex flex-col gap-4 scroll-auto'>
                        {
                            apps.map((app) => {
                                return (
                                    <div className='border rounded-lg p-2  justify-between gap-4 flex flex-row items-center' key={app.id}>
                                        <p className='ml-2'>App name : {app.name}</p>
                                        <div className='flex flex-row gap-2'>
                                            <MdEdit size={20} className='cursor-pointer' onClick={() => openEditModal(app)} />
                                            <MdDelete size={20} className='cursor-pointer' onClick={() => handleAppDeletion(app.id)} />
                                        </div>
                                    </div>
                                )
                            })
                        }
                    </div>) : (<p>Loading ...</p>)}
                </div>
            </div>

            {/* Edit Modal */}
            {editingApp && (
                <div className='absolute inset-0 bg-black/50 flex items-center justify-center backdrop-blur-sm'>
                    <div className='bg-black border p-6 rounded-xl w-96 flex flex-col gap-4'>
                        <h2 className='text-xl font-bold'>Edit App</h2>
                        <div className='flex flex-col gap-2'>
                            <label className='text-sm text-gray-400'>Name</label>
                            <input
                                type="text"
                                className='px-4 py-2 rounded border bg-transparent'
                                value={editName}
                                onChange={(e) => setEditName(e.target.value)}
                            />
                        </div>
                        <div className='flex flex-col gap-2'>
                            <label className='text-sm text-gray-400'>Description</label>
                            <textarea
                                className='rounded border p-4 bg-transparent'
                                value={editDesc}
                                onChange={(e) => setEditDesc(e.target.value)}
                            ></textarea>
                        </div>
                        <div className='flex flex-row gap-2 justify-end mt-2'>
                            <button
                                className='px-4 py-2 border rounded hover:bg-gray-800 transition-colors'
                                onClick={closeEditModal}
                            >
                                Cancel
                            </button>
                            <button
                                className='px-4 py-2 bg-white text-black rounded hover:bg-gray-200 transition-colors'
                                onClick={handleUpdateApp}
                            >
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Page
