"use client";

import axios from "axios";
import Image from "next/image";
import { FormEvent, useMemo, useState } from "react";
import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";

type MaritalStatus = "Single" | "Married" | "Divorced" | "Widowed";

type RegistrationPayload = {
  fullName: string;
  fatherOrHusbandName: string;
  phoneNumber: string;
  whatsappNumber: string;
  dateOfBirth: string;
  email: string;
  maritalStatus: MaritalStatus;
  children: number;
  countriesVisited: string[];
  rejectedVisaCountries: string[];
  visaApprovedButNotVisitedCountries: string[];
};

const countries = [
  "Thailand",
  "Malaysia",
  "Turkey",
  "Spain",
  "Germany",
  "Netherlands",
  "France",
  "Austria",
  "Hungary",
  "Egypt",
  "South Africa",
  "Uzbekistan",
  "Tajikistan",
];

const countryFlagCodes: Record<string, string> = {
  Thailand: "th",
  Malaysia: "my",
  Turkey: "tr",
  Spain: "es",
  Germany: "de",
  Netherlands: "nl",
  France: "fr",
  Austria: "at",
  Hungary: "hu",
  Egypt: "eg",
  "South Africa": "za",
  Uzbekistan: "uz",
  Tajikistan: "tj",
};

const maritalStatuses: MaritalStatus[] = [
  "Single",
  "Married",
  "Divorced",
  "Widowed",
];

const initialForm: RegistrationPayload = {
  fullName: "",
  fatherOrHusbandName: "",
  phoneNumber: "",
  whatsappNumber: "",
  dateOfBirth: "",
  email: "",
  maritalStatus: "Single",
  children: 0,
  countriesVisited: [],
  rejectedVisaCountries: [],
  visaApprovedButNotVisitedCountries: [],
};

export default function VisaRegisterationPage() {
  const [form, setForm] = useState<RegistrationPayload>(initialForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const apiBaseUrl = useMemo(
    () => process.env.NEXT_PUBLIC_API_BASE_URL ?? "/api",
    [],
  );

  const updateArrayField = (
    field:
      | "countriesVisited"
      | "rejectedVisaCountries"
      | "visaApprovedButNotVisitedCountries",
    country: string,
    checked: boolean,
  ) => {
    setForm((prev) => ({
      ...prev,
      [field]: checked
        ? [...prev[field], country]
        : prev[field].filter((value) => value !== country),
    }));
  };

  const validateForm = () => {
    if (
      !form.fullName ||
      !form.fatherOrHusbandName ||
      !form.phoneNumber ||
      !form.whatsappNumber ||
      !form.dateOfBirth ||
      !form.email
    ) {
      return "Please fill all required fields.";
    }

    if (form.countriesVisited.length === 0) {
      return "Please select at least one country in visited countries.";
    }

    if (form.children < 0) {
      return "Children count cannot be negative.";
    }

    return "";
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSuccessMessage("");
    setErrorMessage("");

    const validationError = validateForm();
    if (validationError) {
      setErrorMessage(validationError);
      return;
    }

    setIsSubmitting(true);

    try {
      await axios.post(`${apiBaseUrl}/registration`, form, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      setSuccessMessage("Registration submitted successfully.");
      setForm(initialForm);
    } catch (error) {
      setErrorMessage(
        axios.isAxiosError(error)
          ? error.response?.data?.message?.toString() ??
              "Failed to submit registration."
          : "Unexpected error occurred while submitting the form.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-slate-50 px-4 py-10 sm:px-6">
        <div className="mx-auto w-full max-w-5xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="mb-8">
            <div className="mb-4 inline-flex items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
              <span className="inline-flex shrink-0 rounded-md border-2 border-amber-500 p-0.5 shadow-md dark:border-amber-400">
                <Image
                  src="/logo.jpeg"
                  alt="Company logo"
                  width={36}
                  height={36}
                  className="rounded-[4px] object-cover"
                  priority
                />
              </span>
              <span className="text-xs font-medium uppercase tracking-wide text-slate-600">
                Visa Adviser
              </span>
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">
              Visa Registration Form
            </h1>
            <p className="mt-2 text-sm text-slate-600">
              Fill all required fields and submit your profile for assessment.
            </p>
          </div>

          <form className="space-y-8" onSubmit={handleSubmit}>
            <section className="grid gap-4 md:grid-cols-2">
              <InputField
                label="Full Name"
                value={form.fullName}
                onChange={(value) => setForm((prev) => ({ ...prev, fullName: value }))}
                required
              />
              <InputField
                label="Father / Husband Name"
                value={form.fatherOrHusbandName}
                onChange={(value) =>
                  setForm((prev) => ({ ...prev, fatherOrHusbandName: value }))
                }
                required
              />
              <InputField
                label="Phone Number"
                value={form.phoneNumber}
                onChange={(value) => setForm((prev) => ({ ...prev, phoneNumber: value }))}
                required
              />
              <InputField
                label="WhatsApp Number"
                value={form.whatsappNumber}
                onChange={(value) =>
                  setForm((prev) => ({ ...prev, whatsappNumber: value }))
                }
                required
              />
              <InputField
                label="Date of Birth"
                type="date"
                value={form.dateOfBirth}
                onChange={(value) => setForm((prev) => ({ ...prev, dateOfBirth: value }))}
                required
              />
              <InputField
                label="Email"
                type="email"
                value={form.email}
                onChange={(value) => setForm((prev) => ({ ...prev, email: value }))}
                required
              />
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-900">
                  Marital Status
                </label>
                <select
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-900 outline-none ring-sky-500 transition focus:ring-2"
                  value={form.maritalStatus}
                  onChange={(event) =>
                    setForm((prev) => ({
                      ...prev,
                      maritalStatus: event.target.value as MaritalStatus,
                    }))
                  }
                >
                  {maritalStatuses.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>
              <InputField
                label="Children"
                type="number"
                value={String(form.children)}
                onChange={(value) =>
                  setForm((prev) => ({ ...prev, children: Number(value) || 0 }))
                }
                min={0}
              />
            </section>

            <CountryGroup
              title="Countries Visited"
              countries={countries}
              selected={form.countriesVisited}
              onToggle={(country, checked) =>
                updateArrayField("countriesVisited", country, checked)
              }
            />

            <CountryGroup
              title="Rejected Visa Countries"
              countries={countries}
              selected={form.rejectedVisaCountries}
              onToggle={(country, checked) =>
                updateArrayField("rejectedVisaCountries", country, checked)
              }
            />

            <CountryGroup
              title="Visa Approved But Not Visited Countries"
              countries={countries}
              selected={form.visaApprovedButNotVisitedCountries}
              onToggle={(country, checked) =>
                updateArrayField(
                  "visaApprovedButNotVisitedCountries",
                  country,
                  checked,
                )
              }
            />

            {successMessage ? (
              <p className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                {successMessage}
              </p>
            ) : null}

            {errorMessage ? (
              <p className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                {errorMessage}
              </p>
            ) : null}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-lg bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto"
            >
              {isSubmitting ? "Submitting..." : "Submit Registration"}
            </button>
          </form>
        </div>
      </main>
      <Footer />
    </>
  );
}

type InputFieldProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  type?: string;
  min?: number;
};

function InputField({
  label,
  value,
  onChange,
  required = false,
  type = "text",
  min,
}: InputFieldProps) {
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold text-slate-900">
        {label}
        {required ? <span className="text-rose-500"> *</span> : null}
      </label>
      <input
        type={type}
        value={value}
        min={min}
        required={required}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-900 placeholder:text-slate-500 outline-none ring-sky-500 transition focus:ring-2"
      />
    </div>
  );
}

type CountryGroupProps = {
  title: string;
  countries: string[];
  selected: string[];
  onToggle: (country: string, checked: boolean) => void;
};

function CountryGroup({ title, countries, selected, onToggle }: CountryGroupProps) {
  return (
    <section>
      <h2 className="mb-3 text-base font-semibold text-slate-900">{title}</h2>
      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {countries.map((country) => (
          <label
            key={country}
            className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm"
          >
            <input
              type="checkbox"
              checked={selected.includes(country)}
              onChange={(event) => onToggle(country, event.target.checked)}
              className="size-4 accent-slate-900"
            />
            <span className="inline-flex items-center gap-2 font-medium text-slate-900">
              <img
                src={`https://flagcdn.com/w20/${countryFlagCodes[country]}.png`}
                alt={`${country} flag`}
                width={20}
                height={14}
                loading="lazy"
                className="h-[14px] w-5 rounded-[2px] border border-slate-300 object-cover"
              />
              <span>{country}</span>
            </span>
          </label>
        ))}
      </div>
    </section>
  );
}
