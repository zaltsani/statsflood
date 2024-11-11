'use client'

import { CardContent } from "@mui/material"
import { Card, CardFooter, CardTitle } from "app/ui/Cards"
import { useState } from "react"
import glossaryData from 'app/glossary/glossary-data.json'
import siteMetadata from '@/data/siteMetadata'
import Link from "next/link"


export default function Page() {
    const [elements, setElements] = useState(glossaryData.map(d => ({
        ...d,
        visibility: true
    })))
    const toggleVisibility = (title) => {
        const newState = elements.map((element) =>
            element.title === title
                ? { ...element, visibility: !element.visibility }
                : element
            )
        setElements(newState)
    }

    return (
        <>
            <div className="space-y-2 pb-10 pt-6 md:space-y-5">
                <h1 className="text-3xl font-extrabold leading-9 tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl sm:leading-10 md:text-6xl md:leading-14">
                    Glossary
                </h1>
            </div>
            <div className="grid md:grid-cols-2 grid-cols-1 grid-flow-row auto-rows gap-6 text-gray-900 dark:text-white">
                {elements.map(element => (
                    <Card key={element.title} className={`p-3 ${element.visibility ? 'row-auto' : 'row-auto'}`} >
                        <CardTitle className="flex justify-between p-3">
                            <button
                                // onClick={() => toggleVisibility(element.title)}
                            >
                                {element.title}
                            </button>
                            <button
                                // onClick={() => toggleVisibility(element.title)}
                            >
                                {/* <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6 justify-end">
                                    <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25ZM12.75 9a.75.75 0 0 0-1.5 0v2.25H9a.75.75 0 0 0 0 1.5h2.25V15a.75.75 0 0 0 1.5 0v-2.25H15a.75.75 0 0 0 0-1.5h-2.25V9Z" clipRule="evenodd" />
                                </svg> */}
                            </button>
                        </CardTitle>
                        
                        {/* Element content */}
                        {element.visibility && (
                            <>
                                <CardContent>
                                    {element.description}
                                </CardContent>
                                {element.url && (
                                    <CardFooter>
                                        <Link
                                        href={siteMetadata.siteUrl + element.url}
                                        className="text-blue-500"
                                        >Read More</Link>
                                    </CardFooter>
                                )}
                            </>
                        )}
                    </Card>
                ))}
            </div>
        </>
    )
}