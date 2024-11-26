import { connectDB } from "@/lib/db/mongodb";
import { ObjectId } from 'mongodb';

export interface CodeSnippet {
  _id?: ObjectId;
  userId: string;
  code: string;
  language: string;
  title: string;
  createdAt: Date;
}

export async function saveCodeSnippet(snippet: Omit<CodeSnippet, '_id' | 'createdAt'>) {
  const { db } = await connectDB();
  const collection = db.collection('code_snippets');
  
  const result = await collection.insertOne({
    ...snippet,
    createdAt: new Date()
  });

  return result;
}

export async function getUserSnippets(userId: string) {
  const { db } = await connectDB();
  const collection = db.collection('code_snippets');
  
  const snippets = await collection
    .find({ userId })
    .sort({ createdAt: -1 })
    .toArray();

  return snippets;
}

export async function getSnippetById(id: string) {
  const { db } = await connectDB();
  const collection = db.collection('code_snippets');
  
  const snippet = await collection.findOne({
    _id: new ObjectId(id)
  });

  return snippet;
}

export async function updateSnippet(id: string, updates: Partial<Omit<CodeSnippet, '_id' | 'userId'>>) {
  const { db } = await connectDB();
  const collection = db.collection('code_snippets');
  
  const result = await collection.updateOne(
    { _id: new ObjectId(id) },
    { $set: updates }
  );

  return result;
}

export async function deleteSnippet(id: string) {
  const { db } = await connectDB();
  const collection = db.collection('code_snippets');
  
  const result = await collection.deleteOne({
    _id: new ObjectId(id)
  });

  return result;
}
