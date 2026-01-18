import { NextResponse } from "next/server";
import { auth0 } from "@/lib/auth0";
import { findOrCreateUserFromAuth0 } from "../_store";

// Necesitamos Node.js runtime para acceder a PostgreSQL
export const runtime = "nodejs";

/**
 * POST /api/v1/sync
 *
 * Sincroniza el usuario de Auth0 con la base de datos local.
 * Este endpoint se llama automaticamente despues del callback de Auth0.
 *
 * Funcionalidades:
 * - Crea el usuario en la BD si no existe
 * - Devuelve los datos del usuario sincronizado
 */
export async function POST(request) {
  try {
    // Obtener la sesion de Auth0
    const session = await auth0.getSession(request);

    if (!session) {
      return NextResponse.json(
        { error: "No hay sesion activa" },
        { status: 401 }
      );
    }

    const { user: auth0User } = session;

    // Sincronizar usuario con la base de datos
    const dbUser = await findOrCreateUserFromAuth0({
      email: auth0User.email,
      name: auth0User.name || auth0User.email.split('@')[0]
    });

    return NextResponse.json({
      success: true,
      user: {
        id: dbUser.id,
        email: dbUser.email,
        name: dbUser.name,
        role: dbUser.role,
        picture: auth0User.picture
      }
    });


  } catch (error) {
    console.error("[SYNC] Error sincronizando usuario:", error);
    return NextResponse.json(
      { error: "Error sincronizando usuario" },
      { status: 500 }
    );
  }
}

