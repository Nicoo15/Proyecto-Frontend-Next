import {Montserrat} from "next/font/google"
import 'bootstrap/dist/css/bootstrap.css'
import "./globals.css"
import React from "react"
import NavBar from "@/components/NavBar"

const montserrat = Montserrat({subsets: ["latin"]})

export const metadata = {
    title: "Commerce App",
    description: "Practica final de Web Frontend",
}

export default function RootLayout({children}) {
    return (
        <html lang="en">
        <body className={montserrat.className}>
        <NavBar />
        <div className="d-flex flex-column vh-100 p-0 m-0">
            {children}
        </div>
        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz" crossOrigin="anonymous"></script>
        </body>
        </html>
    )
}