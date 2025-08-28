import bcrypt from 'bcrypt';

export const encryptPassword = async (
  plainPassword: string,
  saltRounds: number = 12
): Promise<string | undefined> => {
  try {
    // Validate input
    if (!plainPassword) {
      return undefined
    }

    if (plainPassword.trim().length === 0) {
      return undefined
    }

    // if (plainPassword.length < 8) {
    //   throw new Error('Password must be at least 8 characters long');
    // }

    // Hash the password with the specified salt rounds
    const hashedPassword = await bcrypt.hash(plainPassword, saltRounds);
    
    return hashedPassword;
  } catch (error) {
    console.error('Password encryption failed:', error);
    throw error;
  }
};

