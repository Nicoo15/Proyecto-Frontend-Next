
import { NextResponse } from 'next/server'
import { readFileSync } from 'fs';

export async function GET() {
    try {
        const admin = JSON.parse(readFileSync("data/admin.json"))
        return NextResponse.json({ admin })
    } catch (e) {
        return NextResponse.json({ message: "admin.json no existen...", status: 400 })
    }
}

