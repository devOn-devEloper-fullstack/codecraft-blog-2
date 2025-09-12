import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    
    
    const deleteAllAccounts = await prisma.account.deleteMany({})
    const deleteAllSessions = await prisma.session.deleteMany({})
    const deleteAllUsers = await prisma.user.deleteMany({})
    const deleteAllRevisions = await prisma.revision.deleteMany({})
    // const deleteAllModerationJobs = await prisma.moderationJob.deleteMany({})
    const deleteAllPosts = await prisma.posts.deleteMany({})
    // const deleteAllDecisions = await prisma.decision.deleteMany({})
    // const deleteAllPictures = await prisma.postPictures.deleteMany({})
    // const deleteAllReviewTasks = await prisma.reviewTask.deleteMany({})

    const user = await prisma.user.createManyAndReturn({
        data: [
            {
              name: 'Admin User',
              email: 'admin@example.com',
              emailVerified: true,
              role: 'Admin'
            },
            {
              name: 'Author User',
              email: 'author@example.com',
              emailVerified: true,
              role: 'Creator'
            },
            {
              name: 'Moderator User',
              email: 'moderator@example.com',
              emailVerified: true,
              role: 'Moderator'
            },
            {
              name: 'Basic User',
              email: 'basic@example.com',
              emailVerified: true,
              role: 'User'
            }
        ]
    })

    const session = await prisma.session.createMany({
        data: [
            {
              userId: user[0].id,
              expiresAt: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
              token: 'admin-session-token',
              createdAt: new Date(),
              updatedAt: new Date()
            },
            {
              userId: user[1].id,
              expiresAt: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
              token: 'author-session-token',
              createdAt: new Date(),
              updatedAt: new Date()
            },
            {
              userId: user[2].id,
              expiresAt: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
              token: 'moderator-session-token',
              createdAt: new Date(),
              updatedAt: new Date()
            },
            {
              userId: user[3].id,
              expiresAt: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
              token: 'basic-session-token',
              createdAt: new Date(),
              updatedAt: new Date()
            }
        ]
    })

  const posts = await prisma.posts.createManyAndReturn({
    data: [
      {
        postTitle: 'My First Post',
        userId: user[1].id,
        slug: 'my-first-post',
        status: 'DRAFT',
        excerpt: 'This is a brief summary of my first post.',
        contentHtml: '<p>This is the content of my first post.</p>',
      },
      {
        postTitle: 'My Second Post',
        userId: user[1].id,
        slug: 'my-second-post',
        status: 'DRAFT',
        excerpt: 'This is a brief summary of my second post.',
        contentHtml: '<p>This is the content of my second post.</p>',
      },
      {
        postTitle: 'This post should get flagged!',
        userId: user[1].id,
        slug: 'this-post-should-get-flagged',
        status: 'DRAFT',
        excerpt: 'This post contains inappropriate content and should be flagged.',
        contentHtml: '<p>This post contains inappropriate content and should be flagged, bitch!</p>',
      }
    ]
  });

  const revisions = await prisma.revision.createMany({
    data: [
      {
        postId: posts[0].id,
        content: posts[0].contentHtml,
        createdBy: user[1].id,
        version: 1
      },
      {
        postId: posts[0].id,
        content: '<p>This is the content of my first post. I have also made some edits. </p>',
        createdBy: user[1].id,
        currentRevisionPostId: posts[0].id,
        version: 2
      },
      {
        postId: posts[1].id,
        content: posts[1].contentHtml,
        createdBy: user[1].id,
        currentRevisionPostId: posts[1].id,
        version: 1
      },
      {
        postId: posts[2].id,
        content: posts[2].contentHtml,
        createdBy: user[1].id,
        currentRevisionPostId: posts[2].id,
        version: 1
      }
    ]
  })

  const accounts = await prisma.account.createMany({
    data: [
      {
        userId: user[0].id,
        accountId: user[0].id,
        providerId: 'credential',
        password: 'f8fd9b78ecf16ae7ecc27a7eb1df6ca6:a7901a383f62536207f4c45d082bc8310c13826735cdefbbd3e3fc542c35366ddc554ef02c33312adb9f5416d0d4fa94d96387e647a0a496c718d381a2f33049',
        createdAt: new Date(),
        updatedAt: new Date()

      },
      {
        userId: user[1].id,
        accountId: user[1].id,
        providerId: 'credential',
        password: 'f8fd9b78ecf16ae7ecc27a7eb1df6ca6:a7901a383f62536207f4c45d082bc8310c13826735cdefbbd3e3fc542c35366ddc554ef02c33312adb9f5416d0d4fa94d96387e647a0a496c718d381a2f33049',
        createdAt: new Date(),
        updatedAt: new Date()

      },
      {
        userId: user[2].id,
        accountId: user[2].id,
        providerId: 'credential',
        password: 'f8fd9b78ecf16ae7ecc27a7eb1df6ca6:a7901a383f62536207f4c45d082bc8310c13826735cdefbbd3e3fc542c35366ddc554ef02c33312adb9f5416d0d4fa94d96387e647a0a496c718d381a2f33049',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        userId: user[3].id,
        accountId: user[3].id,
        providerId: 'credential',
        password: 'f8fd9b78ecf16ae7ecc27a7eb1df6ca6:a7901a383f62536207f4c45d082bc8310c13826735cdefbbd3e3fc542c35366ddc554ef02c33312adb9f5416d0d4fa94d96387e647a0a496c718d381a2f33049',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]
  })
}

main()  
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
