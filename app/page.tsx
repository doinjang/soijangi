"use client";

import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { Factory, Upload, ShieldCheck, BarChart3 } from "lucide-react";

// -----------------------------
// Global Daum Type Declaration
// -----------------------------
declare global {
  interface Window {
    daum?: any;
  }
}

type Company = {
  id?: string;
  name: string;
  process: string;
  location: string;
};

// ======================================================
// Main Homepage Component
// ======================================================
export default function 쇠쟁이Homepage() {
  const [page, setPage] = useState<"home" | "signup" | "vendor" | "find">("home");
  const [companies, setCompanies] = useState<Company[]>([]);

  const addCompany = (company: Company) => {
    setCompanies((prev) => [...prev, company]);
  };

  if (page === "signup") return <SignupPage onBack={() => setPage("home")} />;
  if (page === "vendor")
    return <VendorRegisterPage onBack={() => setPage("home")} onSubmit={addCompany} />;
  if (page === "find")
    return <FindCompanyPage onBack={() => setPage("home")} companies={companies} />;

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      <header className="flex items-center justify-between px-10 py-6 bg-white shadow-sm">
        <div className="flex flex-col items-start gap-2">
          <div className="flex items-center gap-2 text-2xl font-bold">
            <Factory className="w-7 h-7" /> 쇠쟁이
          </div>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={() => setPage("find")}>업체 찾기</Button>
            <Button size="sm" variant="outline" onClick={() => setPage("vendor")}>업체등록</Button>
          </div>
        </div>
        <div className="flex gap-4">
          <Button variant="outline">로그인</Button>
          <Button onClick={() => setPage("signup")}>회원가입</Button>
        </div>
      </header>

      <section className="px-10 py-20 text-center bg-gradient-to-b from-white to-gray-100">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl font-extrabold mb-6"
        >
          금속가공, 가장 빠르게 연결하다
        </motion.h1>
        <p className="text-lg mb-8 text-gray-600">
          도면 업로드 후 여러 가공업체의 견적을 비교하고 안전하게 거래하세요.
        </p>
        <div className="flex justify-center gap-4 max-w-xl mx-auto">
          <Input placeholder="가공 공정 또는 재질 검색" />
          <Button>견적 요청하기</Button>
        </div>
      </section>

      <section className="px-10 py-20 grid md:grid-cols-3 gap-8">
        <FeatureCard icon={<Upload className="mx-auto mb-4 w-10 h-10" />} title="도면 업로드" desc="PDF, DWG, STEP 파일 업로드 후 간편 견적 요청" />
        <FeatureCard icon={<ShieldCheck className="mx-auto mb-4 w-10 h-10" />} title="안전 결제" desc="에스크로 기반 안전 거래 시스템" />
        <FeatureCard icon={<BarChart3 className="mx-auto mb-4 w-10 h-10" />} title="신뢰 데이터" desc="납기 이행률과 평점 기반 업체 선택" />
      </section>

      <section className="px-10 py-20 bg-gray-900 text-white text-center">
        <h2 className="text-3xl font-bold mb-6">지금 바로 견적을 받아보세요</h2>
        <Button size="lg" onClick={() => setPage("signup")}>무료로 시작하기</Button>
      </section>

      <footer className="px-10 py-8 bg-gray-100 text-sm text-gray-600 text-center">
        © 2026 쇠쟁이. All rights reserved.
      </footer>
    </div>
  );
}

// ======================================================
// Feature Card
// ======================================================
function FeatureCard({ icon, title, desc }: any) {
  return (
    <Card className="rounded-2xl shadow-md">
      <CardContent className="p-8 text-center">
        {icon}
        <h3 className="text-xl font-semibold mb-2">{title}</h3>
        <p className="text-gray-600">{desc}</p>
      </CardContent>
    </Card>
  );
}

// ======================================================
// Signup Page
// ======================================================
function SignupPage({ onBack }: { onBack: () => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async () => {
    setError(null);
    setSuccess(null);

    if (!validateEmail(email)) {
      setError("올바른 이메일 형식이 아닙니다.");
      return;
    }
    if (!password) {
      setError("비밀번호를 입력해 주세요.");
      return;
    }
    if (!companyName) {
      setError("회사명을 입력해 주세요.");
      return;
    }

    setLoading(true);
    try {
      await apiSignup({
        email,
        password,
        companyName,
        phone,
      });
      setSuccess("회원가입이 완료되었습니다.");
    } catch (err: any) {
      setError(err?.message || "회원가입 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <Card className="w-full max-w-md rounded-2xl shadow-xl">
        <CardContent className="p-8 space-y-4">
          <h2 className="text-2xl font-bold text-center">회원가입</h2>
          <Input
            placeholder="이메일"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            placeholder="비밀번호"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Input
            placeholder="회사명"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
          />
          <Input
            placeholder="연락처"
            value={phone}
            onChange={(e) => setPhone(formatPhone(e.target.value))}
            inputMode="numeric"
            maxLength={13}
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}
          {success && <p className="text-green-600 text-sm">{success}</p>}
          <Button className="w-full" onClick={handleSubmit} disabled={loading}>
            {loading ? "가입 중..." : "가입하기"}
          </Button>
          <Button variant="outline" className="w-full" onClick={onBack}>메인으로 돌아가기</Button>
        </CardContent>
      </Card>
    </div>
  );
}

// ======================================================
// Find Company Page
// ======================================================
function FindCompanyPage({
  onBack,
  companies: initialCompanies = [],
}: {
  onBack: () => void;
  companies?: Company[];
}) {
  const [keyword, setKeyword] = useState("");
  const [companies, setCompanies] = useState<Company[]>(initialCompanies);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async () => {
    setError(null);
    setHasSearched(true);
    setLoading(true);
    try {
      const result = await apiSearchCompanies(keyword);
      setCompanies(result);
    } catch (err: any) {
      setError(err?.message || "업체 검색 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-10">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold mb-6">업체 찾기</h2>

        <div className="flex gap-4 mb-8">
          <Input
            placeholder="공정, 지역, 업체명 검색"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
          <Button onClick={handleSearch} disabled={loading}>
            {loading ? "검색 중..." : "검색"}
          </Button>
        </div>

        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        <div className="grid md:grid-cols-2 gap-6">
          {companies.map((company, index) => (
            <Card key={company.id ?? index} className="rounded-2xl shadow-md">
              <CardContent className="p-6 space-y-2">
                <h3 className="text-xl font-semibold">{company.name}</h3>
                <p className="text-gray-600">공정: {company.process}</p>
                <p className="text-gray-600">지역: {company.location}</p>
                <Button variant="outline" className="w-full mt-2">상세보기</Button>
              </CardContent>
            </Card>
          ))}

          {companies.length === 0 && hasSearched && !loading && !error && (
            <p className="text-gray-500">검색 결과가 없습니다.</p>
          )}
          {!hasSearched && !loading && companies.length === 0 && (
            <p className="text-gray-500">검색어를 입력하고 검색을 눌러주세요.</p>
          )}
        </div>

        <div className="mt-10">
          <Button variant="outline" onClick={onBack}>메인으로 돌아가기</Button>
        </div>
      </div>
    </div>
  );
}

// ======================================================
// Vendor Register Page
// ======================================================
function VendorRegisterPage({
  onBack,
  onSubmit,
}: {
  onBack: () => void;
  onSubmit?: (company: Company) => void;
}) {
  const [companyName, setCompanyName] = useState("");
  const [phone, setPhone] = useState("");
  const [zonecode, setZonecode] = useState("");
  const [address, setAddress] = useState("");
  const [detailAddress, setDetailAddress] = useState("");
  const [email, setEmail] = useState("");
  const [mainEquipments, setMainEquipments] = useState("");
  const [processes, setProcesses] = useState("");
  const [maxSize, setMaxSize] = useState("");
  const [errors, setErrors] = useState<{ address?: string }>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);

  // -----------------------------
  // Phone Formatting
  // -----------------------------
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhone(formatPhone(e.target.value));
  };

  // -----------------------------
  // Load Daum Script Safely
  // -----------------------------
  const loadDaumScript = (): Promise<void> => {
    return new Promise((resolve) => {
      if (window.daum && window.daum.Postcode) {
        resolve();
        return;
      }

      const existing = document.querySelector('script[src*="postcode.v2.js"]');
      if (existing) {
        existing.addEventListener("load", () => resolve());
        return;
      }

      const script = document.createElement("script");
      script.src = "https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js";
      script.async = true;
      script.onload = () => resolve();
      document.body.appendChild(script);
    });
  };

  const handleSearchAddress = async () => {
    await loadDaumScript();

    if (!window.daum || !window.daum.Postcode) {
      alert("주소 검색 모듈 로드 실패");
      return;
    }

    new window.daum.Postcode({
      oncomplete: (data: any) => {
        setZonecode(data.zonecode);
        setAddress(data.roadAddress || data.jibunAddress);
        setErrors({});
      },
    }).open();
  };

  const validateAddress = () => {
    if (!zonecode || !address || !detailAddress) {
      setErrors({ address: "주소를 모두 입력해 주세요." });
      return false;
    }
    setErrors({});
    return true;
  };

  const handleSubmit = async () => {
    if (!validateAddress()) return;

    if (email && !validateEmail(email)) {
      setSubmitError("올바른 이메일 형식이 아닙니다.");
      return;
    }

    setSubmitError(null);
    setSubmitSuccess(null);
    setSubmitting(true);

    const payload = {
      companyName,
      phone,
      email,
      zonecode,
      address,
      detailAddress,
      mainEquipments,
      processes,
      maxSize,
    };

    try {
      await apiRegisterVendor(payload);

      if (onSubmit) {
        onSubmit({
          name: companyName,
          process: processes,
          location: `${zonecode} ${address} ${detailAddress}`.trim(),
        });
      }

      setSubmitSuccess("업체 등록 신청이 완료되었습니다.");
    } catch (err: any) {
      setSubmitError(err?.message || "업체 등록 중 오류가 발생했습니다.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <Card className="w-full max-w-2xl rounded-2xl shadow-xl">
        <CardContent className="p-10">
          <h2 className="text-2xl font-bold mb-8 text-center">가공업체 등록</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              placeholder="회사명"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
            />

            <Input
              placeholder="연락처"
              value={phone}
              onChange={handlePhoneChange}
              inputMode="numeric"
              maxLength={13}
            />

            <div className="flex gap-2 md:col-span-2">
              <Input
                placeholder="우편번호"
                value={zonecode}
                onChange={(e) => setZonecode(e.target.value.replace(/[^0-9]/g, ""))}
                inputMode="numeric"
                maxLength={5}
                className="w-1/2"
              />
              <Button type="button" variant="outline" className="w-1/2" onClick={handleSearchAddress}>
                우편번호 검색
              </Button>
            </div>

            <Input placeholder="기본주소" value={address} readOnly className="md:col-span-2" />

            <Input
              placeholder="상세주소"
              value={detailAddress}
              onChange={(e) => setDetailAddress(e.target.value)}
              className="md:col-span-2"
            />

            <Input
              placeholder="이메일"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              placeholder="보유 주요 장비"
              value={mainEquipments}
              onChange={(e) => setMainEquipments(e.target.value)}
            />
            <Input
              placeholder="가공 가능 공정"
              value={processes}
              onChange={(e) => setProcesses(e.target.value)}
            />
            <Input
              placeholder="최대 가공 사이즈"
              value={maxSize}
              onChange={(e) => setMaxSize(e.target.value)}
            />
          </div>

          {errors.address && <p className="text-red-500 text-sm mt-4">{errors.address}</p>}
          {submitError && <p className="text-red-500 text-sm mt-2">{submitError}</p>}
          {submitSuccess && <p className="text-green-600 text-sm mt-2">{submitSuccess}</p>}

          <div className="mt-8 space-y-4">
            <Button className="w-full" onClick={handleSubmit} disabled={submitting}>
              {submitting ? "등록 중..." : "업체 등록 신청"}
            </Button>
            <Button variant="outline" className="w-full" onClick={onBack}>메인으로 돌아가기</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// ======================================================
// Utilities + Tests
// ======================================================

interface SignupPayload {
  email: string;
  password: string;
  companyName: string;
  phone: string;
}

interface VendorRegisterPayload {
  companyName: string;
  phone: string;
  email: string;
  zonecode: string;
  address: string;
  detailAddress: string;
  mainEquipments: string;
  processes: string;
  maxSize: string;
}

async function apiSignup(payload: SignupPayload): Promise<void> {
  const response = await fetch("/api/auth/signup", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const message = await response.text().catch(() => "");
    throw new Error(message || "회원가입 요청에 실패했습니다.");
  }
}

async function apiSearchCompanies(keyword: string): Promise<Company[]> {
  const params = new URLSearchParams();
  if (keyword) {
    params.set("keyword", keyword);
  }

  const response = await fetch(`/api/companies?${params.toString()}`, {
    method: "GET",
  });

  if (!response.ok) {
    const message = await response.text().catch(() => "");
    throw new Error(message || "업체 검색 요청에 실패했습니다.");
  }

  const data = await response.json().catch(() => null);
  if (!Array.isArray(data)) {
    return [];
  }

  return data.map((item: any) => ({
    id: item.id ?? item._id,
    name: item.name,
    process: item.process,
    location: item.location,
  }));
}

async function apiRegisterVendor(payload: VendorRegisterPayload): Promise<void> {
  const response = await fetch("/api/vendors", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const message = await response.text().catch(() => "");
    throw new Error(message || "업체 등록 요청에 실패했습니다.");
  }
}

export function validateEmail(email: string): boolean {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

export function validateBizNumber(value: string): boolean {
  return /^[0-9-]{10,12}$/.test(value);
}

export function formatPhone(value: string): string {
  const numbers = value.replace(/[^0-9]/g, "");
  if (numbers.length <= 3) return numbers;
  if (numbers.length <= 7) return `${numbers.slice(0, 3)}-${numbers.slice(3)}`;
  return `${numbers.slice(0, 3)}-${numbers.slice(3, 7)}-${numbers.slice(7, 11)}`;
}

// Basic runtime tests (Node environment)
if (typeof window === "undefined") {
  console.assert(validateEmail("test@example.com") === true, "Valid email failed");
  console.assert(validateEmail("invalid-email") === false, "Invalid email passed");
  console.assert(validateBizNumber("123-45-67890") === true, "Valid biz number failed");
  console.assert(validateBizNumber("abc") === false, "Invalid biz number passed");
  console.assert(formatPhone("01012345678") === "010-1234-5678", "Phone format failed");
  console.assert(formatPhone("010") === "010", "Short phone format failed");
}
