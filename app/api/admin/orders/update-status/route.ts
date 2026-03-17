import { NextRequest } from "next/server";
import { getSupabase } from "@/lib/supabase";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const orderId = typeof body?.orderId === "string" ? body.orderId : null;
    const status = typeof body?.status === "string" ? body.status : null;

    if (!orderId || !status) {
      return Response.json(
        { error: "orderId en status zijn verplicht" },
        { status: 400 }
      );
    }

    const allowed = ["pending", "paid", "sent_to_printify", "failed"];
    if (!allowed.includes(status)) {
      return Response.json({ error: "Ongeldige status" }, { status: 400 });
    }

    const supabase = getSupabase();
    const { error } = await supabase
      .from("orders")
      .update({ status, updatedAt: new Date().toISOString() })
      .eq("id", orderId);

    if (error) {
      return Response.json({ error: error.message }, { status: 500 });
    }

    return Response.json({ ok: true });
  } catch (e) {
    return Response.json(
      { error: e instanceof Error ? e.message : "Serverfout" },
      { status: 500 }
    );
  }
}
