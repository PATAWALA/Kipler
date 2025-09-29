import { UserType } from '../utils/types';
import { ProductType } from "../services/productServices";



export function withSafeAuthor(p: ProductType, me: UserType | null): ProductType {
  if (p.author && p.author.name) return p;
  return {
    ...p,
    author: me
      ? { _id: me._id, name: me.name }
      : { _id: "", name: "Utilisateur inconnu" },
  };
}