import { prisma } from "@/app";
import { JournalInput } from "./types";

class JournalControllers {
  static findAllbyFilter: MyRequestHandlerFn<JournalInput> = async (
    req,
    res
  ) => {
    try {
      const journals = await prisma.journal.findMany({
        where: {
          OR: req.body.journal_type.map((cat) => ({
            journal_type: { array_contains: [cat] },
          })),
        },
      });
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

  static findOneByCode: MyRequestHandlerFn<JournalInput, JournalInput> = async (
    req,
    res
  ) => {
    try {
      const journal = await prisma.journal.findUnique({
        where: {
          journal_code: req.query.journal_code,
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
        journal_code,
        publication_type,
        journal_name,
        is_active,
      } = req.body;

      const updatedJournal = await prisma.journal.update({
        where: { journal_id },
        data: {
          journal_type,
          journal_code,
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
