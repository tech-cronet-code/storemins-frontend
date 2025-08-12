// src/pages/CustomerAddress.tsx

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserRoleName } from "../../auth/constants/userRoles";
import Stepper from "../components/Stepper";
import CartSummary from "../components/CartSummary";
import CustomerLayout from "../../customer/components/CustomerLayout";

const CustomerAddress: React.FC = () => {
  const navigate = useNavigate();

  // form state
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [locality, setLocality] = useState("");
  const [landmark, setLandmark] = useState("");
  const [pin, setPin] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");

  // mock summary values
  const subtotal = 990000;
  const originalSubtotal = 1980000;
  const fee = 500;
  const taxPercent = 10;

  return (
    <CustomerLayout role={UserRoleName.CUSTOMER}>
      <div className="w-full py-8">
        <div className="max-w-[1100px] mx-auto px-4 sm:px-6 lg:px-8">
          {/* ─── Stepper ───────────────────────────── */}
          <Stepper
            current={2}
            stepPaths={[
              "/customer/cart-detail",
              "/customer/address",
              "/customer/payment",
            ]}
          />

          <div className="flex flex-col lg:flex-row gap-8">
            {/* ─── LEFT: Shipping form ───────────────────────────── */}
            <div className="flex-1">
              <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold">Shipping address</h2>
                  <button
                    type="button"
                    onClick={() => navigate("/customer/cart-detail")}
                    className="text-blue-600 border border-blue-600 px-3 py-1 rounded-md text-sm hover:bg-blue-50"
                  >
                    Already a user? Sign in
                  </button>
                </div>

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    navigate("/customer/payment");
                  }}
                  className="grid grid-cols-1 sm:grid-cols-2 gap-4"
                >
                  {/* Name */}
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium mb-1">
                      Name *
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      placeholder="Enter name"
                      className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-300"
                    />
                  </div>

                  {/* Mobile */}
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Mobile Number *
                    </label>
                    <div className="flex">
                      <span className="inline-flex items-center px-3 border border-r-0 border-gray-300 bg-gray-50 text-sm">
                        +91
                      </span>
                      <input
                        type="tel"
                        value={mobile}
                        onChange={(e) =>
                          setMobile(e.target.value.replace(/\D/g, ""))
                        }
                        required
                        placeholder="Enter mobile number"
                        className="flex-1 border border-gray-300 rounded-r px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-300"
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Email Address (optional)
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter email address"
                      className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-300"
                    />
                  </div>

                  {/* Address */}
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium mb-1">
                      Address *
                    </label>
                    <input
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      required
                      placeholder="House No, Building, Colony"
                      className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-300"
                    />
                  </div>

                  {/* Locality & Landmark */}
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Locality / Area (optional)
                    </label>
                    <input
                      type="text"
                      value={locality}
                      onChange={(e) => setLocality(e.target.value)}
                      placeholder="E.g. MG Road"
                      className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-300"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Landmark (optional)
                    </label>
                    <input
                      type="text"
                      value={landmark}
                      onChange={(e) => setLandmark(e.target.value)}
                      placeholder="E.g. Near Bank"
                      className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-300"
                    />
                  </div>

                  {/* Pin & City */}
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Pin Code *
                    </label>
                    <input
                      type="text"
                      value={pin}
                      onChange={(e) =>
                        setPin(e.target.value.replace(/\D/g, ""))
                      }
                      required
                      placeholder="Enter pin code"
                      className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-300"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      City *
                    </label>
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      required
                      placeholder="Enter city"
                      className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-300"
                    />
                  </div>

                  {/* State */}
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium mb-1">
                      State *
                    </label>
                    <select
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      required
                      className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-300"
                    >
                      <option value="" disabled>
                        Select state
                      </option>
                      <option>Delhi</option>
                      <option>Karnataka</option>
                      <option>Maharashtra</option>
                      <option>West Bengal</option>
                    </select>
                  </div>

            
                </form>
              </div>
            </div>

            {/* ─── RIGHT: Order Summary ───────────────────────────── */}
            <div className="w-full lg:w-[360px] flex-shrink-0">
              <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 space-y-6 sticky top-24">
                <CartSummary
                  subtotal={subtotal}
                  originalSubtotal={originalSubtotal}
                  fee={fee}
                  taxPercent={taxPercent}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </CustomerLayout>
  );
};

export default CustomerAddress;
