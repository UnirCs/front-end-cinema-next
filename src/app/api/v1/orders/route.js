import { NextResponse } from "next/server";
import { auth0 } from "@/lib/auth0";
import { findUserByEmail, createOrderWithTickets, getUserOrders } from "../_store";

// Necesitamos Node.js runtime para acceder a PostgreSQL
export const runtime = "nodejs";

/**
 * GET /api/v1/orders
 *
 * Obtiene las ordenes del usuario autenticado con todos sus detalles.
 * No usa cache para mostrar siempre datos actualizados.
 */
export async function GET(request) {
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

    // Buscar usuario en la BD
    const dbUser = await findUserByEmail(auth0User.email);

    if (!dbUser) {
      return NextResponse.json(
        { error: "Usuario no encontrado" },
        { status: 404 }
      );
    }

    // Obtener ordenes del usuario
    const orders = await getUserOrders(dbUser.id);

    return NextResponse.json({
      success: true,
      orders
    });

  } catch (error) {
    console.error("[ORDERS GET] Error obteniendo ordenes:", error);
    return NextResponse.json(
      { error: "Error obteniendo ordenes" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/v1/orders
 *
 * Crea una nueva orden con tickets para el usuario autenticado.
 * Simula el procesamiento de pago.
 *
 * Body esperado:
 * {
 *   screeningId: number,
 *   seats: string[],
 *   paymentData: { cardName, cardNumber, cardExpiry, cardCvv }
 * }
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
    const body = await request.json();
    const { screeningId, seats, paymentData } = body;

    // Validar datos requeridos
    if (!screeningId || !seats || seats.length === 0) {
      return NextResponse.json(
        { error: "Datos de compra incompletos" },
        { status: 400 }
      );
    }

    if (!paymentData || !paymentData.cardNumber || !paymentData.cardName) {
      return NextResponse.json(
        { error: "Datos de pago incompletos" },
        { status: 400 }
      );
    }

    // Buscar usuario en la BD
    const dbUser = await findUserByEmail(auth0User.email);

    if (!dbUser) {
      return NextResponse.json(
        { error: "Usuario no encontrado" },
        { status: 404 }
      );
    }

    // Simular procesamiento de pago (siempre exitoso con datos validos)
    const isValidPayment = validatePaymentData(paymentData);
    if (!isValidPayment) {
      return NextResponse.json(
        { error: "Datos de pago invalidos" },
        { status: 400 }
      );
    }

    // Crear la orden con los tickets
    const result = await createOrderWithTickets({
      userId: dbUser.id,
      screeningId: parseInt(screeningId, 10),
      seats
    });

    if (!result) {
      return NextResponse.json(
        { error: "Error creando la orden. La sesion puede no existir." },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Compra realizada con exito",
      order: {
        id: result.order.id,
        totalAmount: Number(result.order.total_amount),
        status: result.order.status,
        createdAt: result.order.created_at,
        ticketsCount: result.tickets.length
      }
    });

  } catch (error) {
    console.error("[ORDERS POST] Error creando orden:", error);

    // Verificar si es error de asiento ya ocupado (unique constraint)
    if (error.code === '23505') {
      return NextResponse.json(
        { error: "Uno o mas asientos ya estan ocupados. Por favor selecciona otros." },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: "Error procesando la compra" },
      { status: 500 }
    );
  }
}

/**
 * Valida los datos de pago (simulacion).
 * En produccion esto seria una llamada a un procesador de pagos como Stripe.
 */
function validatePaymentData(paymentData) {
  const { cardNumber, cardName, cardExpiry, cardCvv } = paymentData;

  // Validar que el numero de tarjeta tenga 16 digitos
  const cleanNumber = cardNumber.replace(/\s/g, '');
  if (!/^\d{16}$/.test(cleanNumber)) {
    return false;
  }

  // Validar nombre no vacio
  if (!cardName || cardName.trim().length < 2) {
    return false;
  }

  // Validar formato de expiracion MM/YY
  if (!/^\d{2}\/\d{2}$/.test(cardExpiry)) {
    return false;
  }

  // Validar CVV de 3 digitos
  if (!/^\d{3}$/.test(cardCvv)) {
    return false;
  }

  return true;
}

