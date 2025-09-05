import { prisma } from "@/app";
import { JournalInput } from "./types";

class JournalControllers {
  static create: MyRequestHandlerFn<JournalInput> = async (req, res) => {
    try {
      const {
        journal_type,
        journal_issn,
        journal_eissn,
        publication_type,
        journal_name,
        is_active,
      } = req.body;

      const insertionResult = await prisma.journal.create({
        data: {
          journal_type,
          journal_issn,
          journal_eissn,
          publication_type,
          journal_name,
          is_active,
        },
      });

      res.status(200).json({
        status: true,
        data: insertionResult,
        message: "Journal created successfully!",
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        status: false,
        error,
        message: "Journal creation failed",
      });
    }
  };

  static findAll: MyRequestHandlerFn<JournalInput> = async (req, res) => {
    try {
      const journals = await prisma.journal.findMany();
      if (!journals || journals.length === 0) {
        res.status(404).json({
          status: false,
          message: "No journals found",
        });
        return;
      }

      res.status(200).json({
        status: true,
        data: journals,
        message: "Journals fetched successfully!",
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        status: false,
        error,
        message: "Fetching journals failed",
      });
    }
  };

  static findOne: MyRequestHandlerFn<JournalInput, JournalInput> = async (
    req,
    res
  ) => {
    try {
      const journal = await prisma.journal.findUnique({
        where: {
          journal_id: Number(req.query.journal_id),
        },

        include: {
          JOurnalVolume: {
            include: {
              JournalIssue: true,
            },
          },
        },
      });
      if (!journal) {
        res.status(404).json({
          status: false,
          message: "Journal not found",
        });
        return;
      }

      res.status(200).json({
        status: true,
        data: journal,
        message: "Journal fetched successfully!",
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        status: false,
        error,
        message: "Fetching journal failed",
      });
    }
  };

  static update: MyRequestHandlerFn<JournalInput> = async (req, res) => {
    try {
      const {
        journal_id,
        journal_type,
        journal_issn,
        journal_eissn,
        publication_type,
        journal_name,
        is_active,
      } = req.body;

      const updatedJournal = await prisma.journal.update({
        where: { journal_id },
        data: {
          journal_type,
          journal_issn,
          journal_eissn,
          publication_type,
          journal_name,
          is_active,
        },
      });

      res.status(200).json({
        status: true,
        data: updatedJournal,
        message: "Journal updated successfully!",
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        status: false,
        error,
        message: "Updating journal failed",
      });
    }
  };

  static remove: MyRequestHandlerFn<JournalInput, JournalInput> = async (
    req,
    res
  ) => {
    try {
      const id = Number(req.query.journal_id);

      await prisma.journal.delete({
        where: { journal_id: id },
      });

      res.status(200).json({
        status: true,
        message: "Journal deleted successfully!",
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        status: false,
        error,
        message: "Deleting journal failed",
      });
    }
  };
}

export default JournalControllers;
