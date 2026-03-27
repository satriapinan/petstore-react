import type { Category } from "@/shared/models/category.model";
import type { Tag } from "@/shared/models/tag.model";


export interface Pet {
  id?: number;
  name: string;
  category?: Category;
  tags?: Tag[];
  photoUrls: string[];
  status?: 'available' | 'pending' | 'sold';
}
