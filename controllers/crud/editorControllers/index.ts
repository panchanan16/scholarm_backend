import { prisma } from "@/app";
import { ReqBody } from "./types";
import { encryptPassword } from "@/utils/createPasswordHash";

class EditorControllers {
  static create: MyRequestHandlerFn<ReqBody> = async (req, res) => {
    try {
      const { editor_email, editor_name, is_active, editor_password } =
        req.body;
      const hashedPassword = await encryptPassword(editor_password)
      const editor = await prisma.editor.create({
        data: {
          editor_name,
          editor_email,
          is_active,
          editor_password: hashedPassword,
        },
      });

      res.status(200).json({
        status: true,
        data: editor,
        message: "Editor created successfully!",
      });
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .json({ status: false, error, message: "Editor creation failed" });
    }
  };

  static findAll: MyRequestHandlerFn<ReqBody> = async (req, res) => {
    try {
      const editor = await prisma.editor.findMany();
      res.status(200).json({
        status: true,
        data: editor,
        message: "Editor retrieve successfully!",
      });
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .json({ status: false, error, message: "Editor fetched failed!" });
    }
  };

  static findOne: MyRequestHandlerFn<ReqBody, ReqBody> = async (req, res) => {
    try {
      const editor = await prisma.editor.findUnique({
        where: {
          editor_id: Number(req.query.editor_id),
        },
      });
      res.status(200).json({
        status: true,
        data: editor,
        message: "Editors retrieve successfully!",
      });
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .json({ status: false, error, message: "Editors fetched failed!" });
    }
  };

  static remove: MyRequestHandlerFn<ReqBody, ReqBody> = async (req, res) => {
    try {
      const editors = await prisma.editor.delete({
        where: {
          editor_id: Number(req.query.editor_id),
        },
      });
      res.status(200).json({
        status: true,
        data: editors,
        message: "Editors deleted successfully!",
      });
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .json({ status: false, error, message: "Editors deleting failed!" });
    }
  };
}

export default EditorControllers;
