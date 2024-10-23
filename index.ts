const express=require('express')
import { PrismaClient } from "@prisma/client";
const prisma=new PrismaClient()

const app=express();
const PORT=3000
app.use(express.json());

app.post('/user',async (req: any,res: any )=>{
    const {email,username,password}=req.body;
    try{
        const user=await prisma.user.create({
            data:{
                email,
                username,
                password
            }
        })
        return res.json(user)
    }catch(error){
        res.status(500).json({error: 'User creation failed'})
    }
})

app.post('/disscussion',async (req: any,res: any)=>{
    const {title,description,userEmail}=req.body
    try {
        const user=await prisma.user.findUnique({
            where: {email: userEmail}
        })
        if(!user){
            return res.status(404).json({error: 'User not found'})
        }
        const discussion=prisma.discussion.create({
            data: {
                title,
                description,
                userId: user.id
            }

        })
        return res.json(discussion)
    } catch (error) {
        res.status(500).json({ error: 'Discussion creation failed' });
    }
})
app.get('/discussions', async (req: any, res: any) => {
    const discussions = await prisma.discussion.findMany({
      include: { user: true }, 
    });
    res.json(discussions);
  });
  app.post('/comments', async (req: any, res: any) => {
    const { content, discussionId, userEmail, parentId } = req.body;
  
    // Validate required fields
    if (!content || !discussionId || !userEmail) {
      return res.status(400).json({ error: 'Content, discussionId, and userEmail are required.' });
    }
  
    try {
      const user = await prisma.user.findUnique({
        where: { email: userEmail },
      });
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      const comment = await prisma.comment.create({
        data: {
          content,
          Discussion: { connect: { id: discussionId } },
          user: { connect: { id: user.id } }, 
          parent: parentId ? { connect: { id: parentId } } : undefined, 
        },
      });
      return res.json(comment);
    } catch (error) {
      console.error(error); 
      res.status(500).json({ error: 'Comment creation failed', msg: error
       });
    }
  })

app.get('/discussions/:id/comments', async (req: any, res: any) => {
    const { id } = req.params; 
  
    try {
      const comments = await prisma.comment.findMany({
        where: {
          discussionId: id, 
          parentId: undefined,    
        },
        include: {
          user: true, 
          replies: {
            include: {
              user: true, 
            },
          },
        },
      });
  
      return res.json(comments);
    } catch (error) {
      console.log(error); 
      res.status(500).json({ error: 'Error fetching comments' });
    }
  });
  


app.listen(PORT,()=>{
    console.log('working, .... chill dude');
});
