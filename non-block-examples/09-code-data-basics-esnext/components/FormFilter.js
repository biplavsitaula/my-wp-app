import { FormTokenField } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

function FormFilter({ statusArray, onStatusChange, onAuthorChange, onTagsChange, onCategoriesChange, filterStatus, filterAuthor, filterCategories, filterTags }) {

  return (
    <div className='form-filter'>
      <FormTokenField
        value={filterStatus || []}
        suggestions={statusArray}
        onChange={(status) => {
          onStatusChange(status)
        }}
        label="Status"
      />

      <FormTokenField
        value={filterAuthor || []}
        onChange={(author) => {
          onAuthorChange(author)
        }}
        label="Author"
      />
      <FormTokenField
        value={filterTags || []}
        onChange={(tags) => {
          onTagsChange(tags)
        }}
        label="Tags"
      />

      <FormTokenField
        value={filterCategories || []}
        onChange={(categories) => {
          onCategoriesChange(categories)
        }}
        label="Categories"
      />
      {/* <SearchControl
        label={__('Search posts')}
        value={searchInput}
        onChange={handleStatusFilter}
      />

      <InputControl placeholder='Filter by slug' value={filterSlug} onChange={handleStatusFilter}
      />

      <DatePicker
        currentDate={filterAfter}
        onChange={handleStatusFilter}
        startOfWeek={1}
      /> */}
    </div>
  )
}

export default FormFilter