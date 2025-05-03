import { AfterInsert, BeforeInsert, Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ProductImage } from "./product-image.entity";
import { User } from "src/auth/entities/user.entity";
import { ApiProperty } from "@nestjs/swagger";

@Entity({ name: 'products' })
export class Product {

    @ApiProperty({
        example: 'a1b2c3d4-e5f6-7g8h-9i0j-k1l2m3n4o5p6',
        description: 'Unique identifier for the product',
        format: 'uuid',
        uniqueItems: true
    })
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ApiProperty({
        example: 'T-shirt teslo',
        description: 'Product title',
        uniqueItems: true
    })
    @Column('text', {
        unique: true
    })
    title: string;

    @ApiProperty({
        example: 0,
        description: 'Price',
    })
    @Column('float', {
        default: 0
    })
    price: number;

    @ApiProperty({
        example: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
        description: 'Product description',
        default: null
    })
    @Column({
        type: 'text',
        nullable: true
    })
    description: string;

    @ApiProperty({
        example: 'teslo_t-shirt',
        description: 'Product slug',
        uniqueItems: true
    })
    @Column('text', {
        unique: true
    })
    slug: string;

    @ApiProperty({
        example: 0,
        description: 'Product stock',
        default: 0
    })
    @Column('int', {
        default: 0
    })
    stock: number;

    @ApiProperty({
        example: ['M', 'L', 'XL'],
        description: 'Product sizes',
        default: []
    })
    @Column('text', {
        array: true
    })
    sizes: string[];

    @ApiProperty({
        example: 'M',
        description: 'Product gender'
    })
    @Column('text')
    gender: string;

    @ApiProperty( {
        example: ['t-shirt', 'clothes'],
        description: 'Product tags',
        default: []
    })
    @Column('text', {
        array: true,
        default: []
    })
    tags: string[]

    @ApiProperty( {
        example: [
            'https://teslo.com/img1.jpg',
            'https://teslo.com/img2.jpg'
        ],
        description: 'Product images',
        default: []
    })
    @OneToMany(
        () => ProductImage,
        ( productImage ) => productImage.product,
        { cascade: true, eager: true }
    )
    images?: ProductImage[];

    @ApiProperty()
    @ManyToOne(
        () => User,
        ( user ) => user.product,
        { eager: true }
    )
    user: User;

    @BeforeInsert()
    checkSlugInsert() {
        if (!this.slug) {
            this.slug = this.title;
        }

        this.slug = this.slug.toLowerCase()
            .replaceAll(' ', '_')
            .replaceAll("'", '')
    }

    @AfterInsert()
    checkSlugAfterInsert() {
        this.slug = this.slug.toLowerCase()
            .replaceAll(' ', '_')
            .replaceAll("'", '')
    }
}
