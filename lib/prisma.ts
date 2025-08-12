import { PrismaClient } from '../app/generated/prisma'

// Prevent multiple instances of Prisma Client in development
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
})

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

// WordPress-specific utility functions
export class WordPressDB {
  private prisma: PrismaClient

  constructor(prismaClient: PrismaClient) {
    this.prisma = prismaClient
  }

  // Get posts with pagination and filters
  async getPosts(options: {
    post_type?: string
    post_status?: string
    limit?: number
    offset?: number
    orderBy?: 'date' | 'title' | 'modified'
    order?: 'asc' | 'desc'
    author_id?: bigint
    search?: string
  } = {}) {
    const {
      post_type = 'post',
      post_status = 'publish',
      limit = 10,
      offset = 0,
      orderBy = 'date',
      order = 'desc',
      author_id,
      search,
    } = options

    const where: {
      post_type: string
      post_status: string
      post_author?: bigint
      OR?: Array<{
        post_title?: { contains: string; mode: 'insensitive' }
        post_content?: { contains: string; mode: 'insensitive' }
      }>
    } = {
      post_type,
      post_status,
    }

    if (author_id) {
      where.post_author = author_id
    }

    if (search) {
      where.OR = [
        { post_title: { contains: search, mode: 'insensitive' } },
        { post_content: { contains: search, mode: 'insensitive' } },
      ]
    }

    const orderByField = orderBy === 'date' ? 'post_date' :
                        orderBy === 'title' ? 'post_title' : 'post_modified'

    return await this.prisma.post.findMany({
      where,
      include: {
        author: {
          select: {
            id: true,
            display_name: true,
            user_nicename: true,
          },
        },
        post_meta: true,
        _count: {
          select: {
            comments: {
              where: {
                comment_approved: '1',
              },
            },
          },
        },
      },
      orderBy: {
        [orderByField]: order,
      },
      take: limit,
      skip: offset,
    })
  }

  // Get post by slug
  async getPostBySlug(slug: string, post_type: string = 'post') {
    return await this.prisma.post.findFirst({
      where: {
        post_name: slug,
        post_type,
        post_status: 'publish',
      },
      include: {
        author: {
          select: {
            id: true,
            display_name: true,
            user_nicename: true,
            user_email: true,
          },
        },
        post_meta: true,
        comments: {
          where: {
            comment_approved: '1',
            comment_parent: 0,
          },
          include: {
            children: {
              where: {
                comment_approved: '1',
              },
              orderBy: {
                comment_date: 'asc',
              },
            },
          },
          orderBy: {
            comment_date: 'desc',
          },
        },
        term_relationships: {
          include: {
            term_taxonomy: {
              include: {
                term: true,
              },
            },
          },
        },
      },
    })
  }

  // Get categories/tags for a post
  async getPostTerms(post_id: bigint, taxonomy: string = 'category') {
    return await this.prisma.termRelationship.findMany({
      where: {
        object_id: post_id,
        term_taxonomy: {
          taxonomy,
        },
      },
      include: {
        term_taxonomy: {
          include: {
            term: true,
          },
        },
      },
    })
  }

  // Get WordPress option
  async getOption(option_name: string, defaultValue: string = '') {
    const option = await this.prisma.option.findUnique({
      where: {
        option_name,
      },
    })
    return option?.option_value || defaultValue
  }

  // Set WordPress option
  async setOption(option_name: string, option_value: string, autoload: string = 'yes') {
    return await this.prisma.option.upsert({
      where: {
        option_name,
      },
      update: {
        option_value,
        autoload,
      },
      create: {
        option_name,
        option_value,
        autoload,
      },
    })
  }

  // Get user meta
  async getUserMeta(user_id: bigint, meta_key?: string) {
    const where: { user_id: bigint; meta_key?: string } = { user_id }
    if (meta_key) {
      where.meta_key = meta_key
    }

    const user_meta = await this.prisma.userMeta.findMany({
      where,
    })

    if (meta_key) {
      return user_meta[0]?.meta_value || null
    }

    // Return as key-value object
    return user_meta.reduce((acc, meta) => {
      if (meta.meta_key) {
        acc[meta.meta_key] = meta.meta_value
      }
      return acc
    }, {} as Record<string, string | null>)
  }

  // Set user meta
  async setUserMeta(user_id: bigint, meta_key: string, meta_value: string) {
    return await this.prisma.userMeta.upsert({
      where: {
        userId_metaKey: {
          user_id,
          meta_key,
        },
      },
      update: {
        meta_value,
      },
      create: {
        user_id,
        meta_key,
        meta_value,
      },
    })
  }

  // Get post meta
  async getPostMeta(post_id: bigint, meta_key?: string) {
    const where: { post_id: bigint; meta_key?: string } = { post_id }
    if (meta_key) {
      where.meta_key = meta_key
    }

    const post_meta = await this.prisma.postMeta.findMany({
      where,
    })

    if (meta_key) {
      return post_meta[0]?.meta_value || null
    }

    // Return as key-value object
    return post_meta.reduce((acc, meta) => {
      if (meta.meta_key) {
        acc[meta.meta_key] = meta.meta_value
      }
      return acc
    }, {} as Record<string, string | null>)
  }

  // Set post meta
  async setPostMeta(post_id: bigint, meta_key: string, meta_value: string) {
    return await this.prisma.postMeta.upsert({
      where: {
        postId_metaKey: {
          post_id,
          meta_key,
        },
      },
      update: {
        meta_value,
      },
      create: {
        post_id,
        meta_key,
        meta_value,
      },
    })
  }

  // Get terms by taxonomy
  async getTerms(taxonomy: string, options: {
    hide_empty?: boolean
    parent?: bigint
    orderBy?: 'name' | 'count' | 'id'
    order?: 'asc' | 'desc'
  } = {}) {
    const {
      hide_empty = true,
      parent,
      orderBy = 'name',
      order = 'asc',
    } = options

    const where: {
      taxonomy: string
      count?: { gt: number }
      parent?: bigint
    } = {
      taxonomy,
    }

    if (hide_empty) {
      where.count = {
        gt: 0,
      }
    }

    if (parent !== undefined) {
      where.parent = parent
    }

    const orderByField = orderBy === 'name' ? { term: { name: order } } :
                        orderBy === 'count' ? { count: order } :
                        { term_taxonomy_id: order }

    return await this.prisma.termTaxonomy.findMany({
      where,
      include: {
        term: true,
      },
      orderBy: orderByField,
    })
  }

  // Search functionality
  async searchContent(query: string, options: {
    post_types?: string[]
    limit?: number
  } = {}) {
    const {
      post_types = ['post', 'page'],
      limit = 20,
    } = options

    return await this.prisma.post.findMany({
      where: {
        post_type: {
          in: post_types,
        },
        post_status: 'publish',
        OR: [
          {
            post_title: {
              contains: query,
              mode: 'insensitive',
            },
          },
          {
            post_content: {
              contains: query,
              mode: 'insensitive',
            },
          },
          {
            post_excerpt: {
              contains: query,
              mode: 'insensitive',
            },
          },
        ],
      },
      include: {
        author: {
          select: {
            display_name: true,
            user_nicename: true,
          },
        },
      },
      orderBy: {
        post_date: 'desc',
      },
      take: limit,
    })
  }
}

// Create instance
export const wp = new WordPressDB(prisma)

// Export types for use in components
export type { User, Post, Comment, Term, Option } from '../app/generated/prisma'
