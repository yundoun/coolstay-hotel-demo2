"use client";

import { InlineReservation } from "./inline-reservation";

/**
 * Client-only wrapper for the reservation flow.
 * Ensures hydration happens correctly for the interactive booking widget.
 */
export function OnepageReservation() {
  return <InlineReservation />;
}
