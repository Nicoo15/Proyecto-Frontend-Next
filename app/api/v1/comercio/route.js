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

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');

  try {
    const businesses = await getBusinesses();

    if (id) {
      const businessId = parseInt(id, 10);
      const business = businesses.find(b => b.id === businessId);
      if (business) {
        return new Response(JSON.stringify(business), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        });
      } else {
        return new Response(JSON.stringify({ message: 'Comercio no encontrado' }), {
          status: 404,
          headers: { 'Content-Type': 'application/json' },
        });
      }
    } else {
      return new Response(JSON.stringify(businesses), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  } catch (error) {
    return new Response(JSON.stringify({ message: 'Error al leer los datos' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

export async function DELETE(req) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');

  try {
    const businesses = await getBusinesses();
    const businessId = parseInt(id, 10);
    const newBusinesses = businesses.filter(b => b.id !== businessId);

    if (businesses.length === newBusinesses.length) {
      return new Response(JSON.stringify({ message: 'Comercio no encontrado' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    await saveBusinesses(newBusinesses);

    return new Response(JSON.stringify({ message: 'Comercio eliminado' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ message: 'Error al eliminar el comercio' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

export async function PUT(req) {
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

    const updatedBusiness = await req.json();
    const allowedUpdates = ['name', 'cif', 'address', 'email', 'phone', 'password', 'city', 'activity', 'title', 'summary', 'text'];
    allowedUpdates.forEach(key => {
      if (updatedBusiness[key] !== undefined) {
        businesses[index][key] = updatedBusiness[key];
      }
    });

    await saveBusinesses(businesses);

    return new Response(JSON.stringify({ message: 'Comercio actualizado' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ message: 'Error al actualizar el comercio' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

export async function POST(req) {
  try {
    const businesses = await getBusinesses();
    const newBusiness = await req.json();

    // Generar un nuevo ID
    const newId = businesses.length ? Math.max(...businesses.map(b => b.id)) + 1 : 1;
    const businessWithId = { 
      ...newBusiness, 
      id: newId,
      title: "",
      summary: "",
      text: "",
      activity: "",
      city: "",
      scoring: 0,
      numberOfRatings: 0,
      reseñas: []
    };

    businesses.push(businessWithId);
    await saveBusinesses(businesses);

    return new Response(JSON.stringify({ message: 'Comercio registrado', business: businessWithId }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ message: 'Error al registrar el comercio' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
