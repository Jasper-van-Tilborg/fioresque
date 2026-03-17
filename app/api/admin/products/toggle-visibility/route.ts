import { NextRequest } from "next/server";
import { setProductVisibility } from "@/lib/hidden-products";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const printifyProductId = typeof body?.printifyProductId === "string" ? body.printifyProductId : null;
    const hidden = body?.hidden === true;

    if (!printifyProductId) {
      return Response.json(
        { error: "printifyProductId is verplicht" },
        { status: 400 }
      );
    }

    await setProductVisibility(printifyProductId, hidden);
    return Response.json({ ok: true });
  } catch (e) {
    return Response.json(
      { error: e instanceof Error ? e.message : "Serverfout" },
      { status: 500 }
    );
  }
}
