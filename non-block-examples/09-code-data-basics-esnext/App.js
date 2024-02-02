import './style.css'
import { useState, useEffect } from '@wordpress/element';
import apiFetch from '@wordpress/api-fetch';
import { addQueryArgs } from '@wordpress/url';
import AllPost from './components/AllPost';
import FormFilter from './components/FormFilter';
import Loader from './components/Loader';
import { useSearchParams } from 'react-router-dom';
import PageTitlesList, { MyAuthorsListBase, Page, PageRenameForm } from './components/CodeCheckBlock';



function App() {
  let url = window.location.href;

  const [postLength, setPostLength] = useState()
  const [totalPages, setTotalPages] = useState()
  const [postList, setPostList] = useState([])

  const [author, setAuthor] = useState()
  const [categories, setCategories] = useState()
  const [tags, setTags] = useState([])
  const [status, setStatus] = useState()


  const [searchInput, setSearchInput] = useState('')
  const [filterSlug, setFilterSlug] = useState('')
  const [orderBy, setOrderBy] = useState('date')
  const [order, setOrder] = useState('desc')

  const [statusArray, setStatusArray] = useState([])
  const [statusName, setStatusName] = useState([])

  const [params, setParams] = useSearchParams(new URLSearchParams(url.search))

  var filterCategories = params.get('categories');
  var filterAuthor = params.get('author');
  var filterStatus = params.get('status');
  var filterTags = params.get('tags');
  let currPage = params.get('page');
  currPage = isNaN(currPage) || currPage === null || currPage === undefined ? 1 : params.get('page');

  const fetchPost = () => {
    let postArgs = {}

    if (filterCategories) {
      postArgs = { ...postArgs, categories: filterCategories };
    }

    if (filterStatus) {
      postArgs = { ...postArgs, status: filterStatus };
    }
    if (filterTags) {
      postArgs = { ...postArgs, tags: filterTags };
    }
    if (filterAuthor) {
      postArgs = { ...postArgs, author: filterAuthor };
    }
    if (currPage) {
      postArgs = { ...postArgs, page: currPage };
    }
    postArgs = {
      ...postArgs,
      order: order,
      orderby: orderBy
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
    params.set('order', order)
  }
  const handleSortTitle = () => {
    handleOrder()
    setOrderBy('title')
  }
  const handleSortDate = () => {
    handleOrder()
    setOrderBy('date')
  }

  useEffect(() => { //refresh

    const authorOnRefresh = params.get('author')
    const statusOnRefresh = params.get('status')
    const tagsOnRefresh = params.get('tags')
    const categoriesOnRefresh = params.get('categories')


    if (tagsOnRefresh === null || tagsOnRefresh === undefined || tagsOnRefresh == '') {
      params.delete('tags')
    }

    if (statusOnRefresh === null || statusOnRefresh === undefined || statusOnRefresh == '') {
      params.delete('status')
    }

    if (authorOnRefresh === null || authorOnRefresh === undefined || authorOnRefresh == '') {
      params.delete('author')
    }
    if (categoriesOnRefresh === null || categoriesOnRefresh === undefined || categoriesOnRefresh == '') {
      params.delete('categories')
    }
    fetchStatus();
    fetchTag();
    fetchAuthor();
    fetchCategories();
    getStatusName();
    getStatusArray();
    fetchPost();

  }, [])

  useEffect(() => { //render

    const authorOnRefresh = params.get('author')
    const statusOnRefresh = params.get('status')
    const tagsOnRefresh = params.get('tags')
    const categoriesOnRefresh = params.get('categories')


    if (tagsOnRefresh === null || tagsOnRefresh === undefined || tagsOnRefresh == '') {
      params.delete('tags')
    } else {
      handleTags([tagsOnRefresh])
    }

    if (statusOnRefresh === null || statusOnRefresh === undefined || statusOnRefresh == '') {
      params.delete('status')
    } else {
      handleStatus([statusOnRefresh])
    }

    if (authorOnRefresh === null || authorOnRefresh === undefined || authorOnRefresh == '') {
      params.delete('author')
    } else {
      handleAuthor([authorOnRefresh])
    }

    if (categoriesOnRefresh === null || categoriesOnRefresh === undefined || categoriesOnRefresh == '') {
      params.delete('categories')
    } else {
      handleCategories([categoriesOnRefresh])
    }

    fetchPost();

  }, [filterCategories, filterStatus, filterTags, filterAuthor, currPage])



  const handleNext = () => {
    if (currPage >= totalPages) {
      params.set('page', currPage);
      return currPage;
    }
    const next = parseInt(currPage, 10) + 1;
    params.set('page', next);
    setParams(params);
  }

  const handlePrev = () => {
    if (currPage <= 1) {
      params.set('page', currPage)
      return currPage;
    }
    const prev = parseInt(currPage, 10) - 1;
    params.set('page', prev)
    setParams(params)
  }

  const handleStatus = (status) => {
    params.set('status', status.join(','));
    postLength <= 10 && params.delete('page')
    setParams(params)
  }
  const handleAuthor = (author) => {
    params.set('author', author.join(','));
    postLength <= 10 && params.delete('page')
    setParams(params)

  }
  const handleCategories = (categories) => {
    params.set('categories', categories.join(','));
    postLength <= 10 && params.delete('page')
    setParams(params)
  }

  const handleTags = (tags) => {
    params.set('tags', tags.join(','));
    postLength <= 10 && params.delete('page')
    setParams(params)
  }

  const handlePage = (e) => {
    params.set('page', e.target.innerText)
    setParams(params)
  }

  return (
    <>
      <h2 style={{ display: 'flex', justifyContent: 'center', color: '#101c38' }}>Welcome to posts
        <h3>Task for tomorrow - clean the filterform component</h3></h2>


      {/* <FormFilter
        statusArray={statusArray}
        filterStatus={filterStatus || []}
        filterAuthor={filterAuthor || []}
        filterTags={filterTags || []}
        filterCategories={filterCategories || []}
        onStatusChange={handleStatus}
        onAuthorChange={handleAuthor}
        onTagsChange={handleTags}
        onCategoriesChange={handleCategories}
      /> */}

      <hr style={{ height: "1px", borderWidth: "0", color: "#1f6a7a", backgroundColor: "#1f6a7a" }} />

      {/* {postLength > 0 ? <AllPost page={page} currPage={currPage} totalPages={totalPages} postList={postList} postLength={postLength}
        author={author}
        handleNext={handleNext} handlePrev={handlePrev}
        handlePage={handlePage}
        handleSortTitle={handleSortTitle} handleSortDate={handleSortDate}
        handleTags={handleTags} handleCategories={handleCategories}
        handleAuthor={handleAuthor}
        categories={categories} tags={tags} status={status} statusArray={statusArray} statusName={statusName}
      /> : <div><center><Loader /></center></div>} */}

      <PageTitlesList id={2} />
      <PageRenameForm id={14} />
      <Page pageId={55} />
      <MyAuthorsListBase />
    </>

  )
}
export default App