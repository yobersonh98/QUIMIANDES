"use server";
import { revalidatePath } from "next/cache";


export default async function RefreshPage(path:string) {
  revalidatePath(path);
}
