import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();
  console.log("Vendor register request:", body);
  // 실제 저장 없이 성공만 응답
  return NextResponse.json({ ok: true }, { status: 200 });
}