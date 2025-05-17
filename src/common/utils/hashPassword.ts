// src/common/utils/hashPassword.ts
// import { hash } from "argon2-browser";

// export const hashPassword = async (plainPassword: string): Promise<string> => {
//   try {
//     const result = await hash({
//       pass: plainPassword,
//       salt: crypto.getRandomValues(new Uint8Array(16)), // generates a secure random salt
//       type: 2, // Argon2id
//       time: 3,
//       mem: 65536, // 64 MB
//       hashLen: 32,
//     });

//     return result.encoded; // this is the encoded hash string
//   } catch (error) {
//     console.error("Hashing failed", error);
//     throw new Error("Password hashing failed");
//   }
// };
// src/common/utils/hashPassword.ts
// src/common/utils/hashPassword.ts
// src/common/utils/hashPassword.ts

// src/common/utils/hashPassword.ts
// src/common/utils/hashPassword.ts
// import initArgon2, { ArgonType } from "argon2-wasm";

// NOTE: this should match the path in your public directory
// src/common/utils/hashPassword.ts

import argon2 from 'argon2-browser/dist/argon2-bundled.min.js';

/**
 * Hash a plaintext password using Argon2id.
 * 
 * @param plainPassword - The plaintext password to hash
 * @returns The encoded Argon2 hash string
 */
export const hashPassword = async (plainPassword: string): Promise<string> => {
    try {
        // NOTE: In production, use a secure randomly generated salt
        const salt = 'static_salt_123456';

        const { encoded } = await argon2.hash({
            pass: plainPassword,
            salt,
            //   time: 3,          // Number of iterations
            //   mem: 65536,       // Memory usage in KiB (64 MB)
            // To reduce hashing time while testing/dev, you can tweak:
            time: 2,
            mem: 16384, // 16 MB instead of 64 MB

            hashLen: 32,      // Length of the resulting hash
            parallelism: 1,   // Parallel threads
            type: argon2.ArgonType.Argon2id,
        });

        return encoded;
    } catch (err) {
        console.error('❌ Argon2 hashing failed:', err);
        throw new Error('Password hashing failed.');
    }
};
;









