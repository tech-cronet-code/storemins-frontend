// import { useEffect, useState } from "react";

// const use30SecondCountdown = (): number => {
//   const [timer, setTimer] = useState(30);

//   useEffect(() => {
//     const interval = setInterval(() => {
//       setTimer((prev) => {
//         if (prev <= 1) {
//           clearInterval(interval);
//           return 0;
//         }
//         return prev - 1;
//       });
//     }, 1000);

//     return () => clearInterval(interval);
//   }, []);

//   return timer;
// };

// export default use30SecondCountdown;
