import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { Category } from "./Category";

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  image: string;

  @Column("decimal", { precision: 10, scale: 2 })
  price: number;

  @ManyToOne(() => Category, (category) => category.products, {
    onDelete: "SET NULL",
  })
  @JoinColumn({ name: "category_id" })
  category: Category;

  @Column()
  category_id: number; // Foreign key
}
