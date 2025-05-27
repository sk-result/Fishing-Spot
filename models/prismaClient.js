import { PrismaClient } from "@prisma/client"; //Import kelas PrismaClient dari package Prisma
const prisma = new PrismaClient(); //Buat objek PrismaClient untuk akses database.
// console.log(prisma.specie); 
export default prisma; //Ekspor objek tersebut supaya bisa digunakan di modul lain.
