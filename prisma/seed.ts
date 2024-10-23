import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main(){
    await prisma.user.create({
        data: {
            email: 'kai@gmail.com',
            username: 'kai',
            password: '1234'
        }
    })

    await prisma.discussion.create({
        data: {
            title: 'first here',
            description:' first to start ',
            user: {connect: {email: 'kai@gmail.com'}},
        }
    })
    console.log("database seeded");
    
}
main().catch((e)=>{
    console.log('broken !!',e);
    process.exit(1);
})
.finally(async ()=>{
    await prisma.$disconnect();
})