// CustomerContactUs.tsx

import React, { useState } from "react";
import { UserRoleName } from "../../auth/constants/userRoles";
import CustomerLayout from "../components/CustomerLayout";
import { FiPhone } from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";

type FormState = {
  fullName: string;
  phone: string;
  email: string;
  message: string;
};

const initialForm: FormState = {
  fullName: "",
  phone: "",
  email: "",
  message: "",
};

const validatePhone = (p: string) => {
  // basic 10-digit numeric
  return /^\d{10}$/.test(p.trim());
};

const CustomerContactUs: React.FC = () => {
  const [form, setForm] = useState<FormState>(initialForm);
  const [errors, setErrors] = useState<
    Partial<Record<keyof FormState, string>>
  >({});
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (k: keyof FormState, v: string) => {
    setForm((f) => ({ ...f, [k]: v }));
    setErrors((e) => ({ ...e, [k]: undefined }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;

    const newErrors: typeof errors = {};
    if (!form.fullName.trim()) newErrors.fullName = "Full name is required";
    if (!form.phone.trim()) newErrors.phone = "Phone is required";
    else if (!validatePhone(form.phone))
      newErrors.phone = "Enter valid 10 digit number";
    if (!form.message.trim()) newErrors.message = "Message is required";

    setErrors(newErrors);
    if (Object.keys(newErrors).length) return;

    setSubmitting(true);
    // simulate submit
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
      setForm(initialForm);
    }, 1000);
  };

  return (
    <CustomerLayout role={UserRoleName.CUSTOMER}>
      <div className="max-w-screen-xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <p className="text-base">
            Got a question? We had love to hear from you.
          </p>
        </div>
        <div className="flex flex-col md:flex-row gap-10">
          {/* Left info */}
          <div className="flex-shrink-0 w-full md:w-1/3 space-y-6">
            <div>
              <h2 className="text-xl font-semibold mb-1">Legal Name</h2>
              <div className="text-base font-medium">Your Shop</div>
            </div>
            <div>
              <h2 className="text-xl font-semibold mb-1">Get in Touch</h2>
              <div className="text-sm text-gray-700">
                Write to us for any information required about our products and
                business.
              </div>
            </div>
            <div className="space-y-4 text-sm">
              <div>
                <div className="font-medium">Phone</div>
                <div className="flex items-center gap-2 mt-1">
                  <FiPhone className="text-red-600" />
                  <span>0909090988</span>
                </div>
              </div>
              <div>
                <div className="font-medium">WhatsApp</div>
                <div className="flex items-center gap-2 mt-1">
                  <FaWhatsapp className="text-red-600" />
                  <span>0909090988</span>
                </div>
              </div>
              <div>
                <div className="font-medium">Store Timing</div>
                <div className="flex items-center gap-2 mt-1">
                  <div className="text-red-600">
                    <svg
                      width="16"
                      height="16"
                      fill="currentColor"
                      viewBox="0 0 16 16"
                    >
                      <path d="M8 3.5a.5.5 0 0 1 .5.5v4.25l3.5 2.1a.5.5 0 1 1-.5.866l-3.75-2.25V4a.5.5 0 0 1 .5-.5z" />
                      <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm0-1A7 7 0 1 1 8 1a7 7 0 0 1 0 14z" />
                    </svg>
                  </div>
                  <span>8 am - 9 pm</span>
                </div>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="flex-1">
            <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
              {submitted ? (
                <div className="text-center py-12">
                  <h3 className="text-xl font-semibold mb-2">Thank you!</h3>
                  <p className="text-gray-600 mb-4">
                    Your message has been submitted. We will get back to you
                    soon.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-md transition"
                  >
                    Send Another
                  </button>
                </div>
              ) : (
                <>
                  <h2 className="text-lg font-semibold mb-4">
                    Drop us message
                  </h2>
                  <form
                    onSubmit={handleSubmit}
                    noValidate
                    className="space-y-4"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="md:col-span-2">
                        <label
                          className="block text-xs font-medium mb-1"
                          htmlFor="fullName"
                        >
                          Full Name *
                        </label>
                        <input
                          id="fullName"
                          type="text"
                          value={form.fullName}
                          onChange={(e) =>
                            handleChange("fullName", e.target.value)
                          }
                          className={`w-full px-4 py-3 border rounded-md text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 transition ${
                            errors.fullName
                              ? "border-red-500"
                              : "border-gray-300"
                          }`}
                          placeholder="Full Name *"
                        />
                        {errors.fullName && (
                          <div className="text-red-600 text-xs mt-1">
                            {errors.fullName}
                          </div>
                        )}
                      </div>
                      <div>
                        <label
                          className="block text-xs font-medium mb-1"
                          htmlFor="phone"
                        >
                          Phone *
                        </label>
                        <input
                          id="phone"
                          type="tel"
                          value={form.phone}
                          onChange={(e) =>
                            handleChange(
                              "phone",
                              e.target.value.replace(/\D/g, "")
                            )
                          }
                          className={`w-full px-4 py-3 border rounded-md text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 transition ${
                            errors.phone ? "border-red-500" : "border-gray-300"
                          }`}
                          placeholder="Phone *"
                        />
                        {errors.phone && (
                          <div className="text-red-600 text-xs mt-1">
                            {errors.phone}
                          </div>
                        )}
                      </div>
                    </div>

                    <div>
                      <label
                        className="block text-xs font-medium mb-1"
                        htmlFor="email"
                      >
                        Email (Optional)
                      </label>
                      <input
                        id="email"
                        type="email"
                        value={form.email}
                        onChange={(e) => handleChange("email", e.target.value)}
                        className="w-full px-4 py-3 border rounded-md text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 transition border-gray-300"
                        placeholder="Email (Optional)"
                      />
                    </div>

                    <div>
                      <label
                        className="block text-xs font-medium mb-1"
                        htmlFor="message"
                      >
                        Message *
                      </label>
                      <textarea
                        id="message"
                        rows={3}
                        value={form.message}
                        onChange={(e) =>
                          handleChange("message", e.target.value)
                        }
                        className={`w-full px-4 py-3 border rounded-md text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 transition ${
                          errors.message ? "border-red-500" : "border-gray-300"
                        }`}
                        placeholder="Message *"
                      />
                      {errors.message && (
                        <div className="text-red-600 text-xs mt-1">
                          {errors.message}
                        </div>
                      )}
                    </div>

                    <div className="pt-2">
                      <button
                        type="submit"
                        disabled={submitting}
                        className={`px-6 py-3 rounded-md font-medium transition w-full md:w-auto ${
                          submitting
                            ? "bg-gray-300 text-gray-700 cursor-not-allowed"
                            : "border border-red-600 text-red-600 bg-white hover:bg-red-50"
                        }`}
                      >
                        {submitting ? "Submitting..." : "Submit"}
                      </button>
                    </div>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </CustomerLayout>
  );
};

export default CustomerContactUs;
