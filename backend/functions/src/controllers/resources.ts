import {Request, Response} from "express";
import db from "../utils/db";

export const getHealthArticles = async (req: Request, res: Response) => {
  try {
    const articlesSnapshot = await db.collection("healthArticles").get();
    const articles = articlesSnapshot.docs.map((doc) => doc.data());
    res.status(200).json({articles});
  } catch (error) {
    res.status(500).json({error});
  }
};

export const addHealthArticle = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const {title, description, content, type, category, image, videoUrl} =
    req.body;

  // Validate required fields
  if (!title || !description || !type) {
    return res
      .status(400)
      .json({error: "Title, description, and type are required"});
  }

  try {
    // Save health article/resource to Firestore
    const articleRef = db.collection("healthArticles").doc();
    await articleRef.set({
      title,
      description,
      content,
      type, // text or video
      category,
      image,
      videoUrl,
      createdAt: new Date(),
    });

    return res
      .status(201)
      .json({message: "Health article added successfully"});
  } catch (error) {
    return res.status(500).json({error});
  }
};

export const updateHealthArticle = async (req: Request, res: Response) => {
  const {id} = req.params;
  const {title, description, content, type, category, image, videoUrl} =
    req.body;

  try {
    const articleRef = db.collection("healthArticles").doc(id);
    const article = await articleRef.get();

    if (!article.exists) {
      return res.status(404).json({error: "Article not found"});
    }

    await articleRef.update({
      title,
      description,
      content,
      type,
      category,
      image,
      videoUrl,
      updatedAt: new Date(),
    });

    return res
      .status(200)
      .json({message: "Health article updated successfully"});
  } catch (error) {
    return res.status(500).json({error});
  }
};

export const deleteHealthArticle = async (req: Request, res: Response) => {
  const {id} = req.params;

  try {
    const articleRef = db.collection("healthArticles").doc(id);
    const article = await articleRef.get();

    if (!article.exists) {
      return res.status(404).json({error: "Article not found"});
    }

    await articleRef.delete();
    return res
      .status(200)
      .json({message: "Health article deleted successfully"});
  } catch (error) {
    return res.status(500).json({error});
  }
};
