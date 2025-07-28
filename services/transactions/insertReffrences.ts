import { prisma } from "@/app";

async function insertReffrences(objectsArray) {
  try {
    if (!Array.isArray(objectsArray) || objectsArray.length === 0) {
      throw new Error("Input must be a non-empty");
    }

    console.log(objectsArray)

    const results: any = [];

    // Use transaction to insert all records and get their IDs
    const insertedRecords = await prisma.$transaction(async (tx) => {
      for (const objectData of objectsArray) {
        const createdRecord = await tx.reffences.create({
          data: objectData,
        });

        if (createdRecord) {
          results.push(createdRecord);
        }
      }
    });

    return results;
  } catch (error: any) {
    // Handle specific Prisma/MySQL errors
    if (error.code === "P2002") {
      throw new Error("Duplicate entry detected");
    }

    if (error.code === "P2003") {
      throw new Error("Foreign key constraint failed");
    }

    throw error;
  }
}

export default insertReffrences;
