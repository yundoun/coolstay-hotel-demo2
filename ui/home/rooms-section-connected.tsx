"use client";

import { useStoreInfo } from "@/application/hooks/useStoreInfo";
import RoomsSection from "./rooms-section";

/**
 * Client wrapper that fetches live room data and passes it to RoomsSection.
 * Extracted so the parent page can remain a Server Component.
 */
export default function RoomsSectionConnected() {
  const { data: store } = useStoreInfo();

  return (
    <RoomsSection
      rooms={store?.rooms ?? []}
      storeKey={store?.motelKey ?? ""}
    />
  );
}
