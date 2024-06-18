import { promises as fs } from 'fs';
import path from 'path';

async function getBusinesses() {
    const filePath = path.join(process.cwd(), 'data', 'comercios.json');
    const jsonData = await fs.readFile(filePath, 'utf8');
    return JSON.parse(jsonData);
}

async function saveBusinesses(businesses) {
    const filePath = path.join(process.cwd(), 'data', 'comercios.json');
    await fs.writeFile(filePath, JSON.stringify(businesses, null, 2), 'utf8');
}

export async function POST(req) {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    try {
        const businesses = await getBusinesses();
        const businessId = parseInt(id, 10);
        const index = businesses.findIndex(b => b.id === businessId);

        if (index === -1) {
            return new Response(JSON.stringify({ message: 'Comercio no encontrado' }), {
                status: 404,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        const newReview = await req.json();
        businesses[index].reseñas.push(newReview);

        const totalRatings = businesses[index].reseñas.reduce((acc, review) => acc + review.rating, 0);
        businesses[index].numberOfRatings = businesses[index].reseñas.length;
        businesses[index].scoring = totalRatings / businesses[index].numberOfRatings;

        await saveBusinesses(businesses);

        return new Response(JSON.stringify({ message: 'Reseña añadida' }), {
            status: 201,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        return new Response(JSON.stringify({ message: 'Error al añadir la reseña' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}
