import { ListProductImage } from "./list-product-image";

export class ListProduct {
    id : string;
    name: string;
    price : number;
    stock : number
    createdDate: Date;
    updatedDate:Date;
    productImageFiles: ListProductImage[];
    imagePath:string;
}
