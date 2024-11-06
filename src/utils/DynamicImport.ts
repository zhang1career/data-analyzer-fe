import {ContentShowable} from "@/components/Content.tsx";
import NoPage from "@/pages/NoPage.tsx";

export const DynamicImport = async (path: string): Promise<ContentShowable<null>> => {
  try {
    const module = await import(path);
    return module.default; // Assuming you're using default exports
  } catch (e) {
    console.log('Dynamic import failed:', e);
    return NoPage;
  }
}