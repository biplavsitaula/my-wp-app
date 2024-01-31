import React from 'react'
import { useState, useEffect } from '@wordpress/element'
import apiFetch from '@wordpress/api-fetch';
import { addQueryArgs } from '@wordpress/url';
import { RichText } from '@wordpress/block-editor';
import { Button } from '@wordpress/components'

var totalPages = null;
var postLength = null

function Display({ stat }) {
  console.log(stat);
  const [postList, setPostList] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [status, setStatus] = useState()

  const fetchPost = () => {
    const filterArgs = {
      page: currentPage,
      status: stat
    }
    apiFetch({
      path: addQueryArgs("/wp/v2/posts", filterArgs),
      parse: false
    })
      .then(res => {
        postLength = res.headers.get('X-WP-Total');
        totalPages = res.headers.get('X-WP-Totalpages')
        return res.json()
      })
      .then((post) => {
        setPostList(post)
      })
  }
  useEffect(() => {
    setStatus(stat)
    fetchPost()
  }, [stat, currentPage])

  const handleNext = () => {
    if (currentPage == totalPages) {
      return currentPage
    }
    const next = currentPage + 1;
    setCurrentPage(next);
  }

  const handlePrev = () => {
    if (currentPage === 1) {
      return currentPage;
    }
    const prev = currentPage - 1;
    setCurrentPage(prev);
  }

  return (
    <div>
      {postList.length > 0 ? Object.values(postList).map((data) => (
        <ul>
          <li style={{ listStyle: 'none' }}>
            <h3>{data?.title?.rendered}</h3>
            <p>{data?.id}</p>
            <p>{status}</p>
            <RichText.Content tagName='p' value={`${data?.date?.split('T')[0]} at ${data?.date?.split('T')[1]}`} />
            <RichText.Content tagName='p' value={data?.excerpt?.rendered} />
          </li>
          <hr />
        </ul>
      ))
        :
        <p>No {status} post</p>
      }
      <strong>Number of Post: {postLength}</strong><br />
      < Button varient='primary' onClick={handlePrev}>Previous</Button>
      {currentPage} of {totalPages}
      <Button variant='primary' onClick={handleNext}>Next</Button>
    </div >
  )
}

export default Display