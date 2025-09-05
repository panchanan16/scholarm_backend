import { prisma } from "@/app";
import { JournalIssueInput } from "./types";


class JournalIssueControllers {
  static create: MyRequestHandlerFn<JournalIssueInput> = async (req, res) => {
    try {
      const {
        iss_name,
        is_special,
        is_published,
        created_at,
        journal_id,
        vol_id,
      } = req.body;

      const insertionResult = await prisma.journalIssue.create({
        data: {
          iss_name,
          is_special,
          is_published,
          created_at,
          journal_id,
          vol_id,
        },
      });

      res.status(200).json({
        status: true,
        data: insertionResult,
        message: "Journal Issue created successfully!",
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        status: false,
        error,
        message: "Journal Issue creation failed",
      });
    }
  };

  static findAll: MyRequestHandlerFn<JournalIssueInput> = async (req, res) => {
    try {
      const issues = await prisma.journalIssue.findMany({
        include: {
          journalRef: true,
          volRef: true,
        },
      });

      if (!issues || issues.length === 0) {
        res.status(404).json({
          status: false,
          message: "No journal issues found",
        });
        return;
      }

      res.status(200).json({
        status: true,
        data: issues,
        message: "Journal Issues fetched successfully!",
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        status: false,
        error,
        message: "Fetching Journal Issues failed",
      });
    }
  };

  static findOne: MyRequestHandlerFn<JournalIssueInput, JournalIssueInput> =
    async (req, res) => {
      try {
        const issue = await prisma.journalIssue.findUnique({
          where: {
            iss_id: Number(req.query.iss_id),
          },
          include: {
            journalRef: true,
            volRef: true,
          },
        });

        if (!issue) {
          res.status(404).json({
            status: false,
            message: "Journal Issue not found",
          });
          return;
        }

        res.status(200).json({
          status: true,
          data: issue,
          message: "Journal Issue fetched successfully!",
        });
      } catch (error) {
        console.error(error);
        res.status(500).json({
          status: false,
          error,
          message: "Fetching Journal Issue failed",
        });
      }
    };

  static update: MyRequestHandlerFn<JournalIssueInput> = async (req, res) => {
    try {
      const {
        iss_id,
        iss_name,
        is_special,
        is_published,
        created_at,
        journal_id,
        vol_id,
      } = req.body;

      const updatedIssue = await prisma.journalIssue.update({
        where: { iss_id },
        data: {
          iss_name,
          is_special,
          is_published,
          created_at,
          journal_id,
          vol_id,
        },
      });

      res.status(200).json({
        status: true,
        data: updatedIssue,
        message: "Journal Issue updated successfully!",
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        status: false,
        error,
        message: "Updating Journal Issue failed",
      });
    }
  };

  static remove: MyRequestHandlerFn<JournalIssueInput, JournalIssueInput> =
    async (req, res) => {
      try {
        const id = Number(req.query.iss_id);

        await prisma.journalIssue.delete({
          where: { iss_id: id },
        });

        res.status(200).json({
          status: true,
          message: "Journal Issue deleted successfully!",
        });
      } catch (error) {
        console.error(error);
        res.status(500).json({
          status: false,
          error,
          message: "Deleting Journal Issue failed",
        });
      }
    };
}

export default JournalIssueControllers;
