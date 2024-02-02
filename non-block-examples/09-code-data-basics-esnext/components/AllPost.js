import { Button } from '@wordpress/components';

import { RichText } from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';
import Loader from './Loader';


function AllPost({ postList, postLength, currPage, totalPages, handleNext, handlePrev, handlePage, page, author, categories, tags, handleSortTitle, handleSortDate, statusArray, handleAuthor, handleTags, handleCategories }) {

  const getAuthorName = (authorId) => {
    const authorName = author?.find(element => element.id == authorId);
    return authorName?.name;
  }
  const getCategoriesName = (categoriesId) => {
    const categoriesName = categories?.find(element => element.id == categoriesId)
    return categoriesName ? categoriesName?.name : "-"
  }

  const getTagName = (tagId) => {
    const tagName = tags?.find(element => element.id == tagId)
    return tagName ? (<span>{tagName?.name}</span>) : "-"
  }
  const getDate = (date, modified) => {
    const latestDate = date == modified ? date : modified
    return (latestDate.split('T')[0]);
  }
  const getStatus = (statusId, date, modified) => {
    if (statusArray.find(element => element == statusId)) {
      return date == modified ? 'Published' : "Last Modified"
    }
  }

  return (
    <div>
      <Button href="http://localhost/testbiplav/wp-admin/post-new.php" class="page-title-action">Add New Post</Button>
      <div className='pagination-control'>

        <RichText.Content tagName='p' value={`${postList?.length} of ${postLength}`} />
        --{page.map((p) => <Button style={{ padding: '0px 10px' }} onClick={handlePage}>{p}</Button>)
        }--
        <Button onClick={handlePrev} className='prev-page button'>Previous</Button>
        {currPage} of {totalPages}
        <Button onClick={handleNext} className='next-page button'>Next</Button>
      </div>
      {
        <table className='wp-list-table widefat fixed striped table-view-list posts' >
          <thead>
            <tr>
              <th className='manage-column column-title column-primary sorted'>
                <span>Title</span>
                <span class="sorting-indicators" onClick={handleSortTitle}>
                  <span class="sorting-indicator asc" aria-hidden="true">
                  </span><span class="sorting-indicator desc" aria-hidden="true">
                  </span>
                </span></th>
              <th className='manage-column column-author'>Author</th>
              <th className='manage-column column-categories'>Categories</th>
              <th className='manage-column column-tags'>Tags</th>
              <th className='manage-column column-date sortable asc'>
                <span>Date</span>
                <span class="sorting-indicators" onClick={handleSortDate}>
                  <span class="sorting-indicator asc" aria-hidden="true">
                  </span><span class="sorting-indicator desc" aria-hidden="true">
                  </span>
                </span></th>
            </tr>
          </thead>
          <tbody id='the-list'>
            {postList ? postList?.map((data) => (
              <tr className='iedit author-self level-0 hentry '>
                <td className='title column-title has-row-actions column-primary page-title'><a href={`http://localhost/testbiplav/wp-admin/post.php?post=${data.id}&action=edit`}><strong>{data.title.rendered}</strong></a></td>
                <td className='author column-author'>
                  <span onClick={() => handleAuthor([data.author])} style={{ cursor: 'pointer' }}>
                    {getAuthorName(data.author)}
                  </span>
                </td>
                <td className='categories column-categories'>{data?.categories.map((cate, index) => (
                  <span onClick={() => handleCategories([cate])} style={{ cursor: 'pointer' }}>
                    {getCategoriesName(cate)}
                    {index < data.categories.length - 1 && ', '}
                  </span>
                ))
                }
                </td>
                <td className='tags columen-tags'>{data?.tags.map((tags, index) => (
                  <span onClick={() => handleTags([tags])} style={{ cursor: 'pointer' }}>
                    {getTagName(tags)}
                    {index < data.tags.length - 1 && ', '}
                  </span>
                )
                )}</td>
                <td className='date date column-date'>{getStatus(data.status, data.date, data.modified)}<RichText.Content tagName='p' value={getDate(data.date, data.modified)} /></td>
              </tr>
            )) : <Loader />}
          </tbody>
        </table>
      }

    </div >
  )
}

export default AllPost;