import { NextResponse } from "next/server";

const API_BASE_URL_MOCKED = "https://mock.apidog.com/m1/1172760-1166489-default";

export async function GET() {
  try {
    const response = await fetch(`${API_BASE_URL_MOCKED}/api/v1/metrics`);

    if (!response.ok) {
      throw new Error(`Error fetching metrics: ${response.status}`);
    }

    const metrics = await response.json();

    // Actualizar el timestamp con la hora actual
    return NextResponse.json({
      ...metrics,
      updatedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('[METRICS] Error fetching from mock API:', error.message);

    // Fallback a datos estaticos si falla el mock
    return NextResponse.json({
      ticketsSoldToday: 150000,
      ticketsSoldMonth: 38542,
      minutesWatchedYear: 125400000,
      averageRating: 4.3,
      activeScreenings: 24,
      totalCustomers: 892341,
      updatedAt: new Date().toISOString()
    });
  }
}
