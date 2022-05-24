import BlogModel from '../models/BlogModel';
import { BlogCreation } from '../types/common';

class BlogRepository {
  createBlog(datas: BlogCreation) {
    return BlogModel.create(datas);
  }

  getAllBlogs(page: number, limit: number) {
    const offset = limit * (page - 1);
    return BlogModel.findAndCountAll({
      limit: limit,
      offset: offset,
    });
  }

  getBlogById = (id: number) => {
    return BlogModel.findOne({
      where: {
        id,
      },
    });
  };

  getBlogByOffset = (offset: number) => {
    return BlogModel.findOne({
      offset: offset,
    });
  };
}

export default new BlogRepository();
