import { NextResponse } from "next/server";

const MOCK_COMPANIES = [
  { id: "1", name: "정밀테크", process: "MCT / 선반", location: "경남 창원" },
  { id: "2", name: "한빛레이저", process: "레이저 / 절곡", location: "부산" },
  { id: "3", name: "대성금속", process: "용접 / 제관", location: "대구" },
];

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const keyword = searchParams.get("keyword") ?? "";

  const filtered = MOCK_COMPANIES.filter(
    (c) =>
      c.name.includes(keyword) ||
      c.process.includes(keyword) ||
      c.location.includes(keyword)
  );

  return NextResponse.json(filtered, { status: 200 });
}