import { prisma } from "@/app";
import { JournalVolumeInput } from "./types";

class JournalVolumeControllers {
  static create: MyRequestHandlerFn<JournalVolumeInput> = async (req, res) => {
    try {
      const { vol_name, journal_id } = req.body;

      const insertionResult = await prisma.journalVolume.create({
        data: {
          vol_name,
          journal_id,
        },
      });

      res.status(200).json({
        status: true,
        data: insertionResult,
        message: "Journal Volume created successfully!",
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        status: false,
        error,
        message: "Journal Volume creation failed",
      });
    }
  };

  static findAll: MyRequestHandlerFn<JournalVolumeInput> = async (req, res) => {
    try {
      const volumes = await prisma.journalVolume.findMany({
        include: {
          journalRef: true, // include parent journal
          JournalIssue: true, // include related issues
        },
      });

      if (!volumes || volumes.length === 0) {
        res.status(404).json({
          status: false,
          message: "No journal volumes found",
        });
        return;
      }

      res.status(200).json({
        status: true,
        data: volumes,
        message: "Journal Volumes fetched successfully!",
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        status: false,
        error,
        message: "Fetching Journal Volumes failed",
      });
    }
  };

  static findOne: MyRequestHandlerFn<JournalVolumeInput, JournalVolumeInput> =
    async (req, res) => {
      try {
        const volume = await prisma.journalVolume.findUnique({
          where: {
            vol_id: Number(req.query.vol_id),
          },
          include: {
            journalRef: true,
            JournalIssue: true,
          },
        });

        if (!volume) {
          res.status(404).json({
            status: false,
            message: "Journal Volume not found",
          });
          return;
        }

        res.status(200).json({
          status: true,
          data: volume,
          message: "Journal Volume fetched successfully!",
        });
      } catch (error) {
        console.error(error);
        res.status(500).json({
          status: false,
          error,
          message: "Fetching Journal Volume failed",
        });
      }
    };

  static update: MyRequestHandlerFn<JournalVolumeInput> = async (req, res) => {
    try {
      const { vol_id, vol_name, journal_id } = req.body;

      const updatedVolume = await prisma.journalVolume.update({
        where: { vol_id },
        data: {
          vol_name,
          journal_id,
        },
      });

      res.status(200).json({
        status: true,
        data: updatedVolume,
        message: "Journal Volume updated successfully!",
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        status: false,
        error,
        message: "Updating Journal Volume failed",
      });
    }
  };

  static remove: MyRequestHandlerFn<JournalVolumeInput, JournalVolumeInput> =
    async (req, res) => {
      try {
        const id = Number(req.query.vol_id);

        await prisma.journalVolume.delete({
          where: { vol_id: id },
        });

        res.status(200).json({
          status: true,
          message: "Journal Volume deleted successfully!",
        });
      } catch (error) {
        console.error(error);
        res.status(500).json({
          status: false,
          error,
          message: "Deleting Journal Volume failed",
        });
      }
    };
}

export default JournalVolumeControllers;
