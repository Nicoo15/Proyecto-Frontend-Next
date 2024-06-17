import { promises as fs } from 'fs';
import path from 'path';

async function getUsers() {
  const filePath = path.join(process.cwd(), 'data', 'users.json');
  const jsonData = await fs.readFile(filePath, 'utf8');
  return JSON.parse(jsonData);
}

async function saveUsers(users) {
  const filePath = path.join(process.cwd(), 'data', 'users.json');
  await fs.writeFile(filePath, JSON.stringify(users, null, 2), 'utf8');
}

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  const interest = searchParams.get('interest');

  try {
    const users = await getUsers();

    if (id) {
      const userId = parseInt(id, 10);
      const user = users.find(u => u.id === userId);
      if (user) {
        return new Response(JSON.stringify(user), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        });
      } else {
        return new Response(JSON.stringify({ message: 'Usuario no encontrado' }), {
          status: 404,
          headers: { 'Content-Type': 'application/json' },
        });
      }
    } else if (interest) {
      const interestedUsers = users.filter(user => user.interests.includes(interest));
      return new Response(JSON.stringify(interestedUsers), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    } else {
      return new Response(JSON.stringify(users), {
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

export async function POST(req) {
  try {
    const users = await getUsers();
    const newUser = await req.json();

    const newId = users.length ? Math.max(...users.map(user => user.id)) + 1 : 1;
    const userWithId = { ...newUser, id: newId };

    users.push(userWithId);
    await saveUsers(users);

    return new Response(JSON.stringify({ message: 'Usuario registrado', user: userWithId }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ message: 'Error al registrar el usuario' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

export async function PUT(req) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');

  try {
    const users = await getUsers();
    const userId = parseInt(id, 10);
    const index = users.findIndex(u => u.id === userId);

    if (index === -1) {
      return new Response(JSON.stringify({ message: 'Usuario no encontrado' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const updatedUser = await req.json();
    users[index] = { ...users[index], ...updatedUser };

    await saveUsers(users);

    return new Response(JSON.stringify({ message: 'Usuario actualizado' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ message: 'Error al actualizar el usuario' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

export async function DELETE(req) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');

  try {
    const users = await getUsers();
    const userId = parseInt(id, 10);
    const newUsers = users.filter(u => u.id !== userId);

    if (users.length === newUsers.length) {
      return new Response(JSON.stringify({ message: 'Usuario no encontrado' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    await saveUsers(newUsers);

    return new Response(JSON.stringify({ message: 'Usuario eliminado' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ message: 'Error al eliminar el usuario' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
