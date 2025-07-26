// // context/DoctorAuthContext.tsx
// "use client";
// import { createContext, useContext, useState, useEffect } from "react";

// const DoctorAuthContext = createContext(null);

// export const useDoctorAuth = () => useContext(DoctorAuthContext);

// export function DoctorAuthProvider({ children }) {
//   const [doctor, setDoctor] = useState(null);

//   useEffect(() => {
//     const storedDoctor = JSON.parse(localStorage.getItem("doctor"));
//     if (storedDoctor) {
//       setDoctor(storedDoctor);
//     }
//   }, []);

//   const login = (doctorData) => {
//     localStorage.setItem("doctor", JSON.stringify(doctorData));
//     setDoctor(doctorData);
//   };

//   const logout = () => {
//     localStorage.removeItem("doctor");
//     setDoctor(null);
//   };

//   return (
//     <DoctorAuthContext.Provider value={{ doctor, login, logout }}>
//       {children}
//     </DoctorAuthContext.Provider>
//   );
// }
