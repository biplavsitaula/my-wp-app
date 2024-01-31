import './style.css'
import { useState, useEffect } from '@wordpress/element';
import apiFetch from '@wordpress/api-fetch';
import { addQueryArgs } from '@wordpress/url';
import AllPost from './components/AllPost';
import FormFilter from './components/FormFilter';
import Loader from './components/Loader';
import { useNavigate, useSearchParams } from 'react-router-dom';



function App() {
  let url = window.location.href;
  const [postLength, setPostLength] = useState()
  const [totalPages, setTotalPages] = useState()
  const [postList, setPostList] = useState([])

  const [currentPage, setCurrentPage] = useState(1)

  const [author, setAuthor] = useState()
  const [categories, setCategories] = useState()
  const [tags, setTags] = useState([])
  const [status, setStatus] = useState()
  const [pages, setPages] = useState([1])

  const [searchInput, setSearchInput] = useState('')
  const [filterAuthor, setFilterAuthor] = useState([])
  const [filterCategories, setFilterCategories] = useState([])
  const [filterTags, setFilterTags] = useState()
  const [filterStatus, setFilterStatus] = useState([])
  const [filterSlug, setFilterSlug] = useState('')
  const [orderBy, setOrderBy] = useState('date')
  const [order, setOrder] = useState('desc')

  const [filterAfter, setFilterAfter] = useState()

  const [statusArray, setStatusArray] = useState([])
  const [statusName, setStatusName] = useState([])

  const [params, setParams] = useSearchParams(new URLSearchParams(url.search))

  const fetchPost = () => {
    const postArgs = {
      page: currentPage,
      categories: filterCategories,
      author: filterAuthor,
      tags: filterTags,
      status: filterStatus,
      orderby: orderBy,
      order: order
    }
    apiFetch({
      path: addQueryArgs(`/wp/v2/posts`, postArgs),
      method: 'GET',
      parse: false
    })
      .then((res) => {
        setPostLength(res.headers.get('X-WP-Total'))
        setTotalPages(res.headers.get('X-WP-Totalpages'))
        return res.json()
      }).then((post) => {
        setPostList(post);
      })
  }

  // const handleDate = (newDate) => {
  //   setFilterAfter(newDate)
  // }

  const fetchTag = () => {
    const tagArgs = {
      id: filterTags,
    }
    apiFetch({ path: `/wp/v2/tags`, tagArgs })
      .then(res => {
        setTags(res)
      })
  }

  const fetchAuthor = () => {
    const userArgs = {
      id: filterAuthor,
    }
    apiFetch({ path: `/wp/v2/users`, userArgs })
      .then(res => {
        setAuthor(res)
      })
  }

  const fetchCategories = () => {
    const cateArgs = {
      id: filterCategories
    }
    apiFetch({ path: `/wp/v2/categories`, cateArgs }).then(res => {
      setCategories(res)
    })
  }

  const fetchStatus = () => {
    const statusArgs = {
      name: filterStatus
    }
    apiFetch({ path: '/wp/v2/statuses', statusArgs }).then(res => {
      setStatus(res)
    })
  }

  const getStatusArray = () => {
    status ? setStatusArray(Object.values(status).map((value) =>
      value = value.slug)
    ) : setStatusArray([]);
  }
  const getStatusName = () => {
    status ? setStatusName(Object.values(status).map((value) =>
      value = value.name)
    ) : setStatusName([]);
  }

  const page = Array.from({ length: totalPages }, (_, index) => index + 1
  )

  const handleOrder = () => {
    setOrder(prev => (prev != 'desc' ? 'desc' : 'asc'))
  }
  const handleSortTitle = () => {
    handleOrder()
    setOrderBy('title')
  }
  const handleSortDate = () => {
    handleOrder()
    setOrderBy('date')
  }

  useEffect(() => {
    fetchAuthor();
    fetchCategories();
    fetchStatus();
    getStatusArray();
    getStatusName();
    fetchTag();
    fetchPost();

    if (filterCategories) {
      params.set('categories', filterCategories)
    }
    if (filterTags) {
      params.set('tag', filterTags)
    }
    if (filterAuthor) {
      params.set('author', filterAuthor)
    }
    if (filterStatus) {
      params.set('status', filterStatus)
    }
    params.set('page', currentPage);
    params.set('orderby', orderBy);
    params.set('order', order);

    if (params.get('tag') == null || params.get('tag') == undefined || params.get('tag') == '') {
      params.delete('tag')
    }
    if (params.get('status') == null || params.get('status') == undefined || params.get('status') == '') {
      params.delete('status')
    }
    if (params.get('author') == null || params.get('author') == undefined || params.get('author') == '') {
      params.delete('author')
    }
    if (params.get('categories') == null || params.get('categories') == undefined || params.get('categories') == '') {
      params.delete('categories')
    }
    setParams(params)
  }, [currentPage, searchInput, filterSlug, params, orderBy, order, filterAuthor, filterCategories, filterTags, filterStatus])



  const handleNext = () => {
    if (currentPage >= totalPages) {
      setPages(currentPage)
      setCurrentPage(currentPage)
      return currentPage
    }
    const next = parseInt(currentPage, 10) + 1;
    setPages(next)
    setCurrentPage(next);
    params.set('page', next);
  }

  const handlePrev = () => {
    if (currentPage <= 1) {
      setPages(currentPage)
      setCurrentPage(currentPage)
      return currentPage;
    }
    const prev = parseInt(currentPage, 10) - 1;
    setPages(prev)
    setCurrentPage(prev);
    params.set('page', prev);
  }
  const handleStatus = (status) => {
    setFilterStatus(status)
    params.set('status', status.join(','));
  }
  const handleAuthor = (author) => {
    setFilterAuthor(author)
    params.set('author', author.join(','));
  }
  const handleCategories = (categories) => {
    setFilterCategories(categories)
    params.set('categories', categories.join(','));
  }
  const handleTags = (tags) => {
    setFilterTags(tags)
    params.set('tag', tags.join(','));
  }
  const handlePage = (e) => {
    setPages(e.target.innerText)
    setCurrentPage(e.target.innerText)
    params.set('page', e.target.innerText)
  }

  return (
    <>
      <h2 style={{ display: 'flex', justifyContent: 'center' }}>Welcome to posts</h2>
      <FormFilter statusArray={statusArray} filterStatus={filterStatus} filterAuthor={filterAuthor} filterTags={filterTags} filterCategories={filterCategories} onStatusChange={handleStatus} onAuthorChange={handleAuthor} onTagsChange={handleTags} onCategoriesChange={handleCategories} url={url} />

      <hr style={{ height: "1px", borderWidth: "0", color: "gray", backgroundColor: "black" }} />

      {postLength > 0 ? <AllPost page={page} currentPage={currentPage} totalPages={totalPages} postList={postList} postLength={postLength} handleNext={handleNext} handlePrev={handlePrev} handlePage={handlePage} author={author} handleSortTitle={handleSortTitle} handleSortDate={handleSortDate} categories={categories} tags={tags} status={status} statusArray={statusArray} statusName={statusName} handleAuthor={handleAuthor} handleTags={handleTags} handleCategories={handleCategories} /> : <div><center><Loader /></center></div>}
    </>

  )
}
export default App