import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();
  console.log("Signup request:", body);
  // 실제 DB 대신 그냥 성공했다고 응답
  return NextResponse.json({ ok: true }, { status: 200 });
}