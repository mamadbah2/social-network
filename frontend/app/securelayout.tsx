'use client'
export default function SecurityLayout({children}: {
    children : React.ReactNode
}) {
    return <section className="flex items-center justify-center h-screen bg-gray-900">
        {children}
    </section>
}