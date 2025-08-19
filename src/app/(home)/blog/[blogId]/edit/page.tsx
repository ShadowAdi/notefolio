import BlogEditComponent from '@/components/global/Blog/Edit/BlogEditComponent';
import { SingleBlogResponseCombinedInterface } from '@/types/Blog/SingleBlog';
import axios from 'axios';
import React from 'react'

const Edit =async ({params}:{params:{blogId:string}}) => {
      const response = await axios.get(
    `http://localhost:3000/api/blog/${params.blogId}`
  );
  if (response.status !== 200) {
    throw new Error(`Failed to get Blog`);
  }
  const data: SingleBlogResponseCombinedInterface = await response.data;
  if (!data.success) {
    throw new Error(`Failed to get the blog: ${data.error}`);
  }

    const {
    blogFound,
    user,
    blogTagsFound,
  } = data;
  return (
    <main className='h-full flex-1 w-full flex flex-col'>
        <BlogEditComponent blogFound={blogFound} blogTagsFound={blogTagsFound} user={user} key={"BlogEdit"}/>
    </main>
  )
}

export default Edit