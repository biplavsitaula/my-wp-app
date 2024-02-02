import { useEntityRecord } from '@wordpress/core-data';
import { useDispatch } from '@wordpress/data';
import { useCallback } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { TextControl, Snackbar } from '@wordpress/components';
import { store as noticeStore } from '@wordpress/notices';
import { useResourcePermissions } from '@wordpress/core-data';
import Loader from './Loader';

function PageTitlesList({ id }) {
  const pages = useEntityRecord('postType', 'page', id);

  if (pages.isResolving) {
    return <Loader />;
  }

  return (
    <ul>
      {console.log(pages?.record?.title?.rendered)}
      {/* {pages?.records?.map((page) => (
        <li>{page?.title?.rendered}</li>
      ))} */}
    </ul>
  );
};

export default PageTitlesList;

export function PageRenameForm({ id }) {
  const page = useEntityRecord('postType', 'page', id);
  const { createSuccessNotice, createErrorNotice } =
    useDispatch(noticeStore);

  const setTitle = useCallback((title) => {
    page.edit({ title });
  }, [page.edit]);

  if (page.isResolving) {
    return <Loader />;
  }

  async function onRename(event) {
    event.preventDefault();
    try {
      await page.save();
      createSuccessNotice(__('Page renamed.'), {
        type: 'Snackbar',
      });
    } catch (error) {
      createErrorNotice(error.message, { type: 'Snackbar' });
    }
  }

  return (<>
    <form onSubmit={onRename}>
      <TextControl
        label={__('Name')}
        value={page.editedRecord.title}
        onChange={setTitle}
      />
      <button type="submit">{__('Save')}</button>
    </form></>
  );
}


export function Page({ pageId }) {
  const pagePermissions = useResourcePermissions('pages', pageId);

  if (pagePermissions.isResolving) {
    return <Loader />;
  }

  return (
    <div>
      {pagePermissions.canCreate
        ? ('Create a new page')
        : false}
      {pagePermissions.canUpdate
        ? ('Edit page')
        : false}
      {pagePermissions.canDelete
        ? ('Delete page')
        : false}

    </div>
  );
}
const { useSelect } = wp.data;

export function MyAuthorsListBase() {
  const authors = useSelect((select) => {
    return select('core').getUsers();
  }, []);

  if (!authors) {
    return null;
  }

  return (
    <ul>
      {console.log(authors)}
      {authors.map((author) => (
        <li key={author.id}>{author.name}</li>
      ))}
    </ul>
  );
}
